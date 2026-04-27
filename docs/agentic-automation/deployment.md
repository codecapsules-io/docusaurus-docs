---
slug: "/agentic-automation/deployment"
description: >-
  Deploying agentic automation with Code Capsules — git as the deployment
  primitive, the Procfile pattern, environment variables, and the capsule
  lifecycle that keeps idle agents at zero cost.
---

# Deployment

The framework described in this guide is intentionally simple to deploy. An orchestrator is a backend service. An agent is a backend service. Both are deployed exactly like any other application on Code Capsules — push to git, the platform builds it, a Procfile tells it how to start.

The infrastructure complexity is handled by the platform. The deployment complexity is handled by git. What remains — the only thing you need to think about — is the application code.

---

## Why git is the right deployment primitive

When AI can write code, the temptation is to let it also deploy that code. Generate a script, run it immediately, see if it works. Skip the commit, skip the review, skip the history.

This is the wrong model — not because AI-generated code is untrustworthy, but because *all* code deployed to production systems should be trustworthy for the same structural reasons.

**A commit is a record of intent.** When an agent starts behaving unexpectedly — and eventually one will — the first question is "what changed?" A git log answers that question precisely. A direct-deploy model answers it with silence.

**A pull request is a review checkpoint.** Even if the reviewer is another AI, a PR creates a moment where the change is visible, can be questioned, and can be rejected before it affects a running system. For agentic automation specifically — where an agent might be calling external APIs, sending emails, or modifying records — that checkpoint matters.

**A branch is a safe experiment.** Testing a new prompt engineering approach, a different model, or a changed output format in a branch means the production agent is unaffected until you decide to merge. There is no equivalent of a branch in a direct-deploy model.

**A revert is a fix.** When something goes wrong at 2am, `git revert` and a new deploy is almost always faster than understanding why it went wrong. That option only exists if there is a history to revert to.

The syntax of the agent code is irrelevant. TypeScript, Python, Go — it does not matter. What matters is that the code went through git before it reached production.

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

## The capsule lifecycle

The scale-to-zero model is what makes this architecture cost-efficient at scale. Understanding how it works helps with capacity planning and debugging.

**At rest (between workflow runs):**
The agent capsule has zero replicas. It is not running. It costs nothing. The container image exists but no compute is allocated.

**Wake sequence (orchestrator triggers a run):**
1. Orchestrator calls the Code Capsules API: `PATCH /capsules/:id` with `{ scaling: { desiredReplicas: 1 } }`
2. Code Capsules provisions a container from the cached image — typically 10–30 seconds for a cold start
3. The agent's Express server starts, the BullMQ worker connects to Redis
4. The orchestrator polls `GET /health` until it receives `{ status: "ok" }`
5. The orchestrator POSTs the job to `POST /run`
6. The agent processes the job and POSTs results to the webhook URL

**After the run:**
1. The orchestrator receives the webhook result
2. Orchestrator calls the Code Capsules API: `PATCH /capsules/:id` with `{ scaling: { desiredReplicas: 0 } }`
3. The capsule scales back to zero. Billing stops.

The entire agent lifecycle — wake, run, sleep — is driven by the orchestrator. The agent itself has no opinion about when it runs or how long it stays alive.

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

---

## Cost model

The cost of running this architecture on Code Capsules is almost entirely determined by the orchestrator — the one always-on component. Agent capsules only incur compute cost while they are running.

For a weekly SEO audit where the analysis takes roughly five minutes:
- **Orchestrator:** always-on, smallest plan sufficient for a Node.js process
- **SEO agent:** ~5 minutes of compute per week
- **Redis:** always-on, shared with orchestrator if running on the same capsule or small dedicated instance

The cost of 52 five-minute agent runs per year is negligible compared to the cost of a single always-on service. As you add more agents, each one adds only marginal cost proportional to how often it runs and how long it takes — not a baseline fixed cost.

This is the practical consequence of the scale-to-zero architecture: the system can have dozens of registered agents, most of which run for minutes per week, with a total infrastructure cost approaching that of a single always-on service.
