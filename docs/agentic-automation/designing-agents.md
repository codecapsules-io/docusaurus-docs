---
slug: "/agentic-automation/designing-agents"
description: >-
  How to design agents that do one thing well — choosing the right model for
  each task, defining clean boundaries, and applying microservice principles to
  AI automation.
---

# Designing Agents

The most common mistake when building agentic automation systems is making agents too large. An agent that fetches data, cleans it, analyses it, formats it, and sends it is not an agent — it is a monolith with an AI API call in the middle. It has all the problems described in [The Problem](../the-problem) section, just with a more modern technology stack.

This page describes how to think about agent design: how to draw boundaries, how to choose models, and how to build agents that are genuinely reusable across workflows.

---

## The single responsibility principle for agents

Every agent should answer yes to the question: *does this agent do exactly one thing?*

Not "one category of things." One thing.

**Too broad:**
- `marketing-agent` — runs marketing workflows
- `data-agent` — processes data
- `reporting-agent` — generates and sends reports

**Correctly scoped:**
- `gsc-fetcher` — fetches Google Search Console data for a given site and date range
- `seo-analyser` — takes raw GSC data and produces a structured SEO report using Claude
- `slack-notifier` — posts a formatted message to a Slack channel

Notice that the correctly scoped agents are not opinionated about what comes before or after them. The `gsc-fetcher` does not know that its output will be analysed. The `seo-analyser` does not know whether its input came from `gsc-fetcher` or from a CSV file. The `slack-notifier` does not know it is sending an SEO report — it sends whatever structured content it receives.

This is what makes them reusable. The `slack-notifier` can be the last step of an SEO workflow, a revenue alert workflow, or a deployment notification workflow. It does not need to be rewritten for each one.

---

## Drawing the right boundaries

A useful heuristic for finding agent boundaries: **one agent per external system or per model call**.

Every time an agent touches an external system — Google Search Console, Slack, a database, an email API — that interaction is a candidate for its own agent. External systems have rate limits, auth complexity, failure modes, and API contracts that are specific to them. Isolating that complexity means it can be updated, monitored, and rate-limited independently.

Similarly, every LLM call is a candidate for its own agent. LLM calls are the most expensive, most variable, and most failure-prone operations in the workflow. Isolating them means you can monitor their cost and latency independently, swap models without touching data fetching logic, and retry them without re-running upstream steps.

Applying both heuristics to the SEO workflow:

| Step | External system | LLM call | Agent |
|---|---|---|---|
| Fetch GSC data | Google Search Console API | No | `gsc-fetcher` |
| Analyse with Claude | No | Yes (Claude Opus) | `seo-analyser` |
| Send Slack notification | Slack API | No | `slack-notifier` |

Three external interactions, three agents. The boundary lines draw themselves.

---

## Choosing the right model for each task

One of the structural advantages of the microservice agent pattern is that each agent can use the best model for its specific task. There is no reason to use the same model for every step.

Think about what each task actually requires:

**High reasoning, open-ended analysis** — Use the most capable model available. Tasks like interpreting ambiguous data, generating nuanced recommendations, or synthesising information from multiple sources benefit from frontier models (Claude Opus, GPT-4o). The cost is justified because the task is genuinely hard.

**Structured extraction and classification** — Tasks with well-defined inputs and expected outputs often perform equally well with smaller, faster, cheaper models. Classifying a support ticket into one of ten categories does not require the same model as writing a strategic analysis.

**Routing and orchestration decisions** — If you ever find yourself asking an LLM "which workflow should run next?" or "is this a billing question or a technical question?", use the smallest capable model. These decisions are cheap to get right with a good prompt and a fast model. Using a frontier model for routing wastes money and adds latency.

**Validation and formatting** — Checking whether an LLM output conforms to a schema, or formatting a structured report for a specific output channel, is often better done with deterministic code than with another LLM call. Not every step needs AI.

A rough guide for the Code Capsules agent platform:

| Task type | Recommended model |
|---|---|
| Deep analysis, synthesis, strategy | Claude Opus |
| General-purpose generation, summarisation | Claude Sonnet |
| Classification, extraction, routing | Claude Haiku or rule-based code |
| Formatting, delivery, integration | No LLM needed |

The point is not to always use the cheapest model. It is to match the model to the task, and to make that decision per-agent rather than globally.

---

## The language does not matter

An agent is a process that receives a JSON payload, does work, and POSTs a JSON result. The language it is written in is an implementation detail.

This is worth stating explicitly because one of the consequences of AI-assisted development is that your team may now have agents written in Python, TypeScript, Go, and Ruby — because different team members are comfortable with different languages, and AI made all of them productive enough to ship something.

This is fine. The orchestrator does not care whether the agent is a Node.js Express server or a Flask app. It sends an HTTP request and receives an HTTP response. The Procfile and the environment variables are the only interface that matters.

What this means in practice:

- A data scientist can write an analysis agent in Python using the libraries they know
- A backend developer can write an integration agent in TypeScript
- A future developer can rewrite either one in a completely different language without touching the orchestrator or any other agent

The contract is the interface. The language is an internal detail of the implementation. As long as the agent speaks `AgentRunRequest` in and `AgentRunResult` out, it belongs in the system.

---

## The agent contract as a design discipline

The fixed input/output contract (`AgentRunRequest` / `AgentRunResult`) is not just a technical requirement — it is a design discipline that forces clarity.

Before writing a single line of code for a new agent, you should be able to answer:

1. **What is the input?** What fields in `request.input` does this agent read? Where do they come from?
2. **What is the output?** What does `result.output` contain when this agent succeeds?
3. **What are the failure modes?** What errors can this agent produce? How should the orchestrator respond to them?
4. **What does this agent *not* do?** What is explicitly out of scope?

If you cannot answer all four questions clearly, the agent is not well-designed yet. The contract forces you to think about the agent as a component in a system, not just as a script that solves an immediate problem.

---

## Keeping agents thin

A well-designed agent has very little code that is specific to *being an agent*. Most of the code should be business logic — the actual work the agent does.

The scaffolding — the Express server, the BullMQ queue, the webhook sender, the health endpoint — is identical across every agent. In the reference implementation, this scaffolding is roughly 150 lines of code. The remaining code is the job logic: the API calls, the model calls, the data transformations.

When adding a new agent, the process is:

1. Copy the scaffolding from an existing agent
2. Replace the job logic with the new task
3. Update the contract documentation (what goes in `input`, what comes out in `output`)
4. Register it with the orchestrator

The scaffolding should never need to change. If you find yourself modifying the base server or queue code for a specific agent, that is a signal that something belongs in the orchestrator or in a shared library — not in the agent itself.

---

## An example: designing the SEO audit agent system

To make this concrete, here is the full design process for the SEO audit agent system, showing how the principles above translate into specific decisions.

**The workflow goal:** Produce a weekly SEO report with actionable recommendations and deliver it to Slack.

**Step 1 — Identify the external systems and model calls:**
- Google Search Console (external system)
- Claude Opus for analysis (LLM call)
- Slack (external system)

**Step 2 — Draw agent boundaries:**
Three agents: `gsc-fetcher`, `seo-analyser`, `slack-notifier`

**Step 3 — Define contracts:**

`gsc-fetcher` input: `{ siteUrl, startDate, endDate }` (or defaults from env)
`gsc-fetcher` output: `{ queries: [...], pages: [...], period: { startDate, endDate } }`

`seo-analyser` input: (the above output, passed through automatically)
`seo-analyser` output: `{ summary, ctrOpportunities, newContentSuggestions, positionDrops, topWin }`

`slack-notifier` input: (the above output)
`slack-notifier` output: `{ delivered: true, messageTs: "..." }`

**Step 4 — Model selection:**
- `gsc-fetcher`: no LLM, pure API calls
- `seo-analyser`: Claude Opus (the reasoning step that produces the most value)
- `slack-notifier`: no LLM, format the report and call the Slack API

**Result:** three focused agents, each replaceable independently, each testable in isolation, total scaffolding shared across all three.
