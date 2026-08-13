---
slug: "/sandbox/tutorials/sessions"
title: "Giving Each User Their Own Sandbox"
description: "Provision a sandbox per user session and make sure it's always cleaned up. A worked example against the live Sandbox API."
sidebar_label: "Per-user sessions"
---

# Giving each user their own sandbox

Full source: [`codecapsules-io/sandbox-sessions-tutorial`](https://github.com/codecapsules-io/sandbox-sessions-tutorial)

If your product gives each user an isolated environment — a coding assistant, a data-analysis tool, an agent that runs on their behalf — you need one sandbox per active user session: provisioned when they show up, and reliably cleaned up when they're done. Get the cleanup half wrong and abandoned sandboxes keep running (and costing) indefinitely.

This tutorial builds that integration: a `SandboxSessionManager` keyed by your own session id — whatever you already use to identify a user, like a login session or a request id.

:::note
This uses only the sandbox **lifecycle** calls — create, get, shutdown, delete. It doesn't run commands or move files in the sandbox; `exec` and file transfer aren't part of this walkthrough. The part covered here — provisioning on demand and never leaking a sandbox — is what you need to get right regardless of what your users' sessions actually *do* inside the sandbox. Everything here is tested against the live `sandbox.codecapsules.io` API.
:::

## Prerequisites

- Node.js 18+
- An API key ([join the waitlist](https://www.codecapsules.io/sandbox/waitlist/) if you don't have one — auth is being finalized, so any non-empty bearer token works for now)

## Get the code

```bash
git clone https://github.com/codecapsules-io/sandbox-sessions-tutorial.git
cd sandbox-sessions-tutorial
npm install
cp .env.example .env
# fill in CODECAPSULES_API_KEY in .env
```

## The session manager

```typescript
import { Sandbox, SandboxNotFoundError, type SandboxConfig, type SandboxFlavor } from '@codecapsules/sandbox';

export class SandboxSessionManager {
  private sessions = new Map<string, { sandbox: Sandbox; lastActiveAt: number }>();

  /** Provision a sandbox for a user session. Call this when they start using your product. */
  async startSession(sessionId: string) {
    if (this.sessions.has(sessionId)) throw new SessionAlreadyExistsError(sessionId);
    const sandbox = await Sandbox.create({ flavor: this.flavor, ttl: this.ttlMinutes }, this.config);
    await sandbox.waitUntilRunning({ timeout: 30_000 });
    this.sessions.set(sessionId, { sandbox, lastActiveAt: Date.now() });
    return this.toSessionInfo(sessionId, sandbox);
  }

  /** Call on every request from that user so an active session never gets reaped as idle. */
  touch(sessionId: string) {
    this.mustGet(sessionId).lastActiveAt = Date.now();
  }

  /** Call when the user is done — shuts down and deletes their sandbox. */
  async endSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return; // already gone, nothing to do
    this.sessions.delete(sessionId);
    await this.destroy(session.sandbox);
  }

  /** Sweep for sessions nobody has touch()'d recently, and clean them up. */
  async reapIdle() {
    const now = Date.now();
    const reaped: string[] = [];
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActiveAt < this.maxIdleMs) continue;
      this.sessions.delete(sessionId);
      await this.destroy(session.sandbox);
      reaped.push(sessionId);
    }
    return reaped;
  }
}
```

The failure mode this is designed around isn't "how do I create a sandbox" — it's "how do I make sure one never outlives the user it belongs to." Two independent mechanisms cover that:

- **`endSession()`** — the happy path, called when your app knows the user is done.
- **`reapIdle()`** — the fallback, called on an interval, for when your frontend can't tell you the user left (closed tab, dropped connection, crashed client). Nobody calling `touch()` for `maxIdleMs` is the signal.

Both funnel into the same `destroy()`, which tolerates a sandbox that's already gone (`SandboxNotFoundError`) — the reaper and an explicit `endSession()` call can race harmlessly.

The full class also has `endAllSessions()` (clean up everything, for process shutdown) and `getSession()` (live status) — see [`src/sessions.ts`](https://github.com/codecapsules-io/sandbox-sessions-tutorial/blob/main/src/sessions.ts) for the rest.

## Run the one-shot demo

```bash
npm run demo
```

It walks through one well-behaved session and one abandoned one side by side:

```
User A opens your app — starting their session...
Session ready: sb_0849c46be11c4fe99f981863060f3f3d (running, expires ...)
User A is active — sending a heartbeat...
Active sessions: 1
User B opens your app too, but then wanders off without closing it properly...
Active sessions: 2
User A keeps using your app (heartbeats every second)...
User B never sends another heartbeat...
Running the idle sweep...
Reaped idle sessions: [ 'user-b' ]
Active sessions: 1
User A is done — ending their session explicitly...
Active sessions: 0
```

Only `user-b` — the one that stopped sending heartbeats — gets swept. `user-a` survives the idle sweep and is cleaned up explicitly instead.

## Run it as a service

`src/server.ts` wraps the manager in a small HTTP API — the shape your own backend would expose to your frontend:

```bash
npm run server
```

```bash
curl -X POST http://localhost:8787/sessions -H 'content-type: application/json' -d '{"sessionId":"user-123"}'
curl -X POST http://localhost:8787/sessions/user-123/touch
curl http://localhost:8787/sessions/user-123
curl -X DELETE http://localhost:8787/sessions/user-123
```

Starting a session that's already open returns `409`; looking up or ending one that doesn't exist returns `404`. Press `Ctrl-C` and the server ends every still-open session before it exits, so nothing is left running under your account.

## Next steps

- [Sandbox SDK overview](/sandbox/): the three-line version, environments, and API references
- [TypeScript SDK reference](/sandbox/typescript/api-reference/)
- Once `exec` is live, `startSession()` is where you'd hand the caller a ready sandbox to run their code in — the provisioning and cleanup story here doesn't change.
