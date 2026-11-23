---
slug: "/explanation/agentic-automation/deployment"
diataxis: explanation
title: "How Agent Deployment Works"
description: "Why git is the deployment primitive for automation agents, how the scale-to-zero capsule lifecycle works, and what it costs."
sidebar_label: "Deployment"
---

# How Agent Deployment Works

To deploy an agent, see [How to deploy business automation agents](/how-to/agentic-automation/deployment/).

## Why git is the right deployment primitive

When AI can write code, the temptation is to let it also deploy that code. Generate a script, run it immediately, see if it works. Skip the commit, skip the review, skip the history.

This is the wrong model — not because AI-generated code is untrustworthy, but because *all* code deployed to production systems should be trustworthy for the same structural reasons.

**A commit is a record of intent.** When an agent starts behaving unexpectedly — and eventually one will — the first question is "what changed?" A git log answers that question precisely. A direct-deploy model answers it with silence.

**A pull request is a review checkpoint.** Even if the reviewer is another AI, a PR creates a moment where the change is visible, can be questioned, and can be rejected before it affects a running system. For agentic automation specifically — where an agent might be calling external APIs, sending emails, or modifying records — that checkpoint matters.

**A branch is a safe experiment.** Testing a new prompt engineering approach, a different model, or a changed output format in a branch means the production agent is unaffected until you decide to merge. There is no equivalent of a branch in a direct-deploy model.

**A revert is a fix.** When something goes wrong at 2am, `git revert` and a new deploy is almost always faster than understanding why it went wrong. That option only exists if there is a history to revert to.

The syntax of the agent code is irrelevant. TypeScript, Python, Go — it does not matter. What matters is that the code went through git before it reached production.

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

## Cost model

The cost of running this architecture on Code Capsules is almost entirely determined by the orchestrator — the one always-on component. Agent capsules only incur compute cost while they are running.

For a weekly SEO audit where the analysis takes roughly five minutes:
- **Orchestrator:** always-on, smallest plan sufficient for a Node.js process
- **SEO agent:** ~5 minutes of compute per week
- **Redis:** always-on, shared with orchestrator if running on the same capsule or small dedicated instance

The cost of 52 five-minute agent runs per year is negligible compared to the cost of a single always-on service. As you add more agents, each one adds only marginal cost proportional to how often it runs and how long it takes — not a baseline fixed cost.

This is the practical consequence of the scale-to-zero architecture: the system can have dozens of registered agents, most of which run for minutes per week, with a total infrastructure cost approaching that of a single always-on service.
