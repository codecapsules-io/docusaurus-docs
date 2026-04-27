---
slug: "/agentic-automation/the-framework"
description: >-
  The orchestrator and agent architecture — how an always-on orchestrator
  drives ephemeral agent capsules through structured workflows using BullMQ,
  webhooks, and the Code Capsules scale API.
---

# The Framework

The architecture has two moving parts: an **orchestrator** and one or more **agents**. Understanding the relationship between them — and why they are separated — is the foundation of everything else.

---

## The two roles

### The orchestrator

The orchestrator is the only component that runs continuously. It has one job: to know what needs to happen, in what order, and to make sure it happens.

It does not do any of the actual work. It does not call APIs, process data, or make decisions about business logic. It manages state, triggers agents, and reacts to their results. Think of it as a dispatcher: it knows the schedule, it knows the routes, it assigns the work.

Concretely, the orchestrator:

- Stores **workflow definitions** — ordered sequences of agent steps with cron schedules
- Uses **BullMQ** to fire scheduled workflows reliably, with retry logic and deduplication
- Calls the **Code Capsules API** to wake an agent capsule when it has work to do
- Waits for the agent to report healthy, then sends it the job via a REST call
- Receives results via a **webhook** when the agent finishes
- Scales the agent capsule back to zero and advances to the next step — or marks the run complete

The orchestrator has no knowledge of what any agent does internally. It only knows the contract: what to send, what to expect back.

### An agent

An agent is a capsule that sleeps at zero replicas until the orchestrator wakes it. It receives a single structured job, executes it, POSTs the result back, and exits.

An agent:

- Implements a standard REST API contract (`GET /health`, `GET /status`, `POST /run`)
- Accepts an `AgentRunRequest` and returns an `AgentRunResult` via webhook
- Contains all the logic for one specific task — and nothing else
- Can be written in any language, use any model, call any API
- Costs nothing when it is not running

The agent is entirely ignorant of the orchestrator's implementation. It receives structured input, does its work, and reports structured output to whatever URL it was given. It does not need to know about BullMQ, about other agents, or about what comes before or after it in the workflow.

---

## The workflow lifecycle

Here is the full sequence for a scheduled workflow — for example, a weekly SEO audit that runs every Monday morning.

```
Monday 09:00 UTC
       │
       ▼
┌─────────────────┐
│  BullMQ cron    │  Scheduled job fires
│  fires          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Orchestrator   │  Creates a run record in Redis (runId, workflowId, status: running)
│  creates run    │
└────────┬────────┘
         │  CC API: scale seo-agent capsule → 1 replica
         ▼
┌─────────────────┐
│  Capsule wakes  │  Code Capsules provisions the container
│  (10–30s)       │
└────────┬────────┘
         │  Orchestrator polls GET /health until { status: "ok" }
         ▼
┌─────────────────┐
│  Orchestrator   │  POST /run with AgentRunRequest
│  triggers run   │  { workflowId, stepId, runId, input, config.webhookUrl }
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agent runs     │  Fetches GSC data → calls Claude → builds report
│                 │  (takes 30–300 seconds depending on task)
└────────┬────────┘
         │  POST orchestrator/webhook with AgentRunResult
         ▼
┌─────────────────┐
│  Orchestrator   │  CC API: scale seo-agent capsule → 0 replicas
│  receives       │  Stores step output in Redis
│  webhook        │  Advances to next step — or marks run complete
└─────────────────┘
```

The agent capsule runs for only as long as the job takes. Between Monday mornings, it does not exist. It costs nothing.

---

## The typed contract

Every agent in the system speaks the same language. The `AgentRunRequest` and `AgentRunResult` types are fixed and shared. This is not a convention — it is the structural guarantee that makes the orchestrator model-agnostic.

```typescript
// What the orchestrator sends to every agent
interface AgentRunRequest {
  workflowId: string        // "seo-audit-weekly"
  stepId: string            // "seo-audit"
  runId: string             // UUID for this specific execution
  input: Record<string, unknown>  // accumulated output from previous steps
  config: {
    webhookUrl: string      // where to POST the result
    timeoutSeconds: number
  }
}

// What every agent POSTs back to the orchestrator
interface AgentRunResult {
  workflowId: string
  stepId: string
  runId: string
  status: 'success' | 'error' | 'timeout'
  output: Record<string, unknown>  // step-specific output
  durationMs: number
  error?: string
}
```

The `output` field is the only part that varies between agents. Its contents are step-specific — an SEO agent returns a report object, a notification agent returns a delivery receipt — but the envelope is always the same.

This has a useful consequence for multi-step workflows: each step's output is stored by the orchestrator and merged into the `input` field for the next step. By the time step three runs, its `input` contains the combined output of steps one and two. Agents further down the chain have access to everything that came before, without any agent needing to know about any other agent.

---

## Multi-step workflows

The real power of the framework becomes visible when a workflow has more than one step. Consider an extended SEO workflow:

```
Step 1: seo-fetcher     → fetches raw GSC data
Step 2: seo-analyser    → calls Claude, produces structured report
Step 3: seo-notifier    → sends the report to Slack
```

Each step is a separate agent capsule. Each runs, reports back, and is scaled to zero before the next one wakes. The orchestrator holds the state — it knows which step succeeded, what the output was, and what to do next.

If step 2 fails, the orchestrator marks the run as failed and scales everything down. Step 3 never runs. The failure is recorded in Redis with the full error message and the output from step 1. You can inspect it, fix the analysis agent, and re-run from step 2 without re-fetching the data.

This is fault isolation. Not just for the failure case — for the success case too. You can update the analysis agent without touching the fetcher or the notifier. You can test the notifier in isolation by posting a fake step 2 output to it. You can swap the notifier for a different delivery mechanism without anyone else knowing.

---

## State management

The orchestrator uses Redis to track workflow run state. Each run is stored under a key with a seven-day TTL:

```json
{
  "runId": "a1b2c3...",
  "workflowId": "seo-audit-weekly",
  "status": "running",
  "currentStepId": "seo-audit",
  "stepOutputs": {
    "fetch": { "rowCount": 1050, "fetchedAt": "2026-04-27T09:00:12Z" }
  },
  "startedAt": "2026-04-27T09:00:00Z",
  "completedAt": null,
  "error": null
}
```

The `GET /runs/:runId` endpoint on the orchestrator exposes this state. You can check the current status of any run, inspect the output of each step, and see exactly where a failure occurred — without tailing logs.

---

## What the orchestrator does not do

It is worth being explicit about what the orchestrator does *not* contain:

- No business logic
- No LLM calls
- No data transformation
- No direct database queries
- No knowledge of what any agent does internally

The moment business logic starts appearing in the orchestrator, the architecture is degrading. The orchestrator is infrastructure, not application code. Keep it that way.
