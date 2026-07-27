---
slug: "/sandbox/tutorials/warm-pool"
title: "Building a Sandbox Warm Pool"
description: "Keep a handful of sandboxes booted and ready so callers never wait on cold start. A worked example against the live Sandbox API."
sidebar_label: "Warm pool"
---

# Building a sandbox warm pool

Full source: [`codecapsules-io/sandbox-pool-tutorial`](https://github.com/codecapsules-io/sandbox-pool-tutorial)

Every sandbox goes through the same setup before it's usable: validate your API key, pick a cluster with capacity, boot the microVM. That's fast, but if your app creates and tears down a sandbox for every agent turn or every user session, paying that cost on the hot path adds up.

This tutorial builds a small **warm pool**: a handful of sandboxes kept booted and idling, so callers get one immediately and a replacement boots in the background. It's the same tradeoff most "instant start" sandbox providers make internally — a bit of idle compute in exchange for consistently fast handoff.

:::note
This uses only the sandbox **lifecycle** calls — create, get, shutdown, delete. It doesn't run commands or move files in the sandbox; `exec` and file transfer aren't part of this walkthrough. Everything here is tested against the live `sandbox.codecapsules.io` API.
:::

## Prerequisites

- Node.js 18+
- An API key ([join the waitlist](https://www.codecapsules.io/sandbox/waitlist/) if you don't have one — auth is being finalized, so any non-empty bearer token works for now)

## Get the code

```bash
git clone https://github.com/codecapsules-io/sandbox-pool-tutorial.git
cd sandbox-pool-tutorial
npm install
cp .env.example .env
# fill in CODECAPSULES_API_KEY in .env
```

## The pool

The whole idea lives in one class. It wraps four `@codecapsules/sandbox` calls:

```typescript
import { Sandbox, SandboxNotFoundError, type SandboxConfig, type SandboxFlavor } from '@codecapsules/sandbox';

export class SandboxPool {
  private ready: Sandbox[] = [];
  // ...constructor takes size, flavor, ttlMinutes, etc.

  /** Fill the pool up to `size`. Tolerates partial failures (e.g. quota limits). */
  async start(): Promise<void> {
    const results = await Promise.allSettled(
      Array.from({ length: this.size }, () => this.bootOne())
    );
    for (const r of results) {
      if (r.status === 'fulfilled') this.ready.push(r.value);
    }
  }

  /** Hand out a ready sandbox and trigger a background replacement. */
  acquire(): Sandbox {
    const sb = this.ready.shift();
    if (!sb) throw new Error('Pool exhausted');
    this.replenish(); // fire-and-forget
    return sb;
  }

  private async bootOne(): Promise<Sandbox> {
    const sb = await Sandbox.create({ flavor: this.flavor, ttl: this.ttlMinutes }, this.config);
    await sb.waitUntilRunning({ timeout: 30_000 });
    return sb;
  }
}
```

A few things worth calling out:

- **`start()` uses `Promise.allSettled`, not `Promise.all`** — if one sandbox fails to boot (say, a `SandboxQuotaError`), the rest of the pool still comes up instead of the whole thing rejecting.
- **`acquire()` never awaits a boot.** It hands back a sandbox that's already `running`, and kicks off `bootOne()` in the background to replace it. The caller's latency is however long `Array.shift()` takes — nothing.
- **`waitUntilRunning()`** is doing the polling for you — it's already part of the SDK, calling `refresh()` in a loop until status flips from `starting` to `running` (or throws on `error`).

The full class also has `release()` (shutdown + delete), `reap()` (swap out anything that fell out of `running` or is close to its TTL), and `drain()` (delete everything, called on shutdown) — see [`src/pool.ts`](https://github.com/codecapsules-io/sandbox-pool-tutorial/blob/main/src/pool.ts) for the rest.

## Run the one-shot demo

```bash
npm run demo
```

```
Warming pool...
Pool ready: { ready: 2, target: 2, pendingReplenish: 0 }
Acquiring a sandbox...
Got sb_f0dd278d81e343fea58593b35e470326 (python-3.12, expires 2026-07-27T06:44:29.000Z)
Pool after acquire: { ready: 1, target: 2, pendingReplenish: 1 }
Pool after background replenish: { ready: 2, target: 2, pendingReplenish: 0 }
Releasing sb_f0dd278d81e343fea58593b35e470326...
Draining pool...
Final status: { ready: 0, target: 2, pendingReplenish: 0 }
```

## Run it as a service

`src/server.ts` wraps the pool in a tiny HTTP broker — the shape you'd actually deploy behind an agent orchestrator:

```bash
npm run server
```

```bash
curl http://localhost:8787/pool/status
curl -X POST http://localhost:8787/pool/acquire
curl -X POST http://localhost:8787/pool/release/<id-from-acquire>
```

Press `Ctrl-C` and the server drains the pool — deleting every idle sandbox — before it exits, so nothing is left running against your account.

## What this exercises

Because the pool holds several sandboxes at once and replaces them under load, it's a heavier workout for the API than a single create/delete pair:

- **Account auth and cluster selection** run on every `bootOne()` call, repeatedly, rather than once.
- **Capacity-based cluster routing** gets exercised across concurrent creates (`start()` boots the whole pool in parallel).
- **TTL expiry** is exercised by `reap()`, which checks each idle sandbox's `expiresAt` and recycles it before it lapses.
- **Cleanup correctness** is exercised by `drain()` and by `release()` tolerating a sandbox that's already gone (`SandboxNotFoundError`).

## Next steps

- [Sandbox SDK overview](/sandbox/): the three-line version, environments, and API references
- [TypeScript SDK reference](/sandbox/typescript/api-reference/)
- Once `exec` and file transfer are live, this pool becomes the front door for handing a *ready-to-run* sandbox to an agent — watch this page for an update.
