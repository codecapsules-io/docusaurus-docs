---
slug: "/how-to/agentic-automation/deployment"
diataxis: how-to
description: >-
  Deploying agentic automation with Code Capsules — git as the deployment
  primitive, the Procfile pattern, environment variables, and the capsule
  lifecycle that keeps idle agents at zero cost.
title: "How to Deploy Business Automation Agents"
sidebar_label: "Deployment"
---

# Put Your Automation Agents Into Production

The framework described in this guide is intentionally simple to deploy. An orchestrator is a backend service. An agent is a backend service. Both are deployed exactly like any other application on Code Capsules — push to git, the platform builds it, a Procfile tells it how to start.

The infrastructure complexity is handled by the platform. The deployment complexity is handled by git. What remains — the only thing you need to think about — is the application code.

For why this process uses git, how agents scale to zero and what that costs, see [How agent deployment works](/explanation/agentic-automation/deployment/).

---

## The Procfile pattern

Every agent and the orchestrator uses a `Procfile` to declare how the process starts:

```
web: node dist/index.js
```

This is the entire deployment configuration. Code Capsules reads the Procfile, starts the process on the declared port, and manages everything else — health routing, restart on crash, log aggregation.

For TypeScript projects, the build step compiles to JavaScript first:

```bash
npm run build   # runs tsc
npm start       # runs node dist/index.js
```

Code Capsules runs `npm run build` during the build phase and `npm start` (or the Procfile command) to start the process. No Docker configuration, no Kubernetes manifests, no server provisioning.

---

## Environment variables as configuration

Agents are configured entirely through environment variables. This means the same container image can run in development, staging, and production with different behaviour — and sensitive values like API keys never appear in the codebase.

The standard set of variables for any agent:

```bash
# Behaviour
AGENT_MODE=api           # "startup" in production, "api" in development
PORT=3000

# Infrastructure
REDIS_URL=redis://...

# Orchestrator
ORCHESTRATOR_WEBHOOK_URL=https://orchestrator.codecapsules.io/webhook

# Agent-specific secrets
ANTHROPIC_API_KEY=sk-...
GOOGLE_SERVICE_ACCOUNT_JSON=eyJ...  # base64-encoded service account key
GSC_SITE_URL=https://www.example.com/
```

Every agent ships with a `.env.example` file that documents every variable it requires. When deploying a new agent on Code Capsules, these become the capsule's environment variables, set once in the dashboard and never committed to the repository.

---

## Deploying a new agent

The process for adding a new agent to the system is intentionally simple. Here is the complete sequence:

**1. Write the agent**

Copy the scaffolding from an existing agent. Replace the job logic in `src/jobs/` with your new task. Update `.env.example` with any new variables the job requires.

**2. Push to git and deploy on Code Capsules**

Create a new Backend Capsule connected to the agent's git repository. Set all required environment variables in the capsule settings. Set `AGENT_MODE=api` for the initial test.

**3. Test the agent in isolation**

With `AGENT_MODE=api`, the agent waits for a `POST /run`. Use the Postman collection from the API docs to send a test payload:

```json
{
  "workflowId": "test",
  "stepId": "my-new-step",
  "runId": "00000000-0000-0000-0000-000000000001",
  "input": {},
  "config": {
    "webhookUrl": "https://webhook.site/your-test-id",
    "timeoutSeconds": 300
  }
}
```

Inspect the output at your webhook.site URL. Confirm the `AgentRunResult` shape matches what you expect.

**4. Register with the orchestrator**

Add the agent to `src/registry/index.ts` in the orchestrator project:

```typescript
{
  id: 'my-new-agent',
  name: 'My New Agent',
  capsuleId: process.env.CC_CAPSULE_ID_MY_NEW_AGENT ?? '',
  baseUrl: process.env.CC_AGENT_URL_MY_NEW_AGENT ?? 'http://localhost:3002',
}
```

Add the capsule ID and URL to the orchestrator's environment variables. Add the agent as a step in an existing workflow, or define a new workflow with a cron schedule.

**5. Set `AGENT_MODE=startup` in production**

Update the agent capsule's environment variable from `api` to `startup`. In this mode, the agent enqueues its job immediately on startup, runs it, reports back, and waits to be scaled down. The orchestrator handles everything from there.

**6. Deploy the updated orchestrator**

Push the orchestrator changes to git. Code Capsules redeploys it. On startup, `registerSchedules()` picks up the new workflow definition and registers its cron schedule with BullMQ. The new workflow will run on its next scheduled tick.
