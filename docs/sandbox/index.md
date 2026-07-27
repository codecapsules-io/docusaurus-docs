---
slug: "/sandbox"
title: "AI Agent Sandboxes: Firecracker microVMs"
description: "Ephemeral isolated Linux environments for AI agents. Create a Firecracker microVM, run any command, and delete it via REST API."
sidebar_label: "Overview"
---

# Sandbox SDK

Run untrusted code safely. The Sandbox API gives your AI agent a real Linux environment: create it, run anything, delete it.

Each sandbox is a Firecracker microVM: hardware-isolated, not a container. Boot time is ~125ms. Everything is deleted when you're done.

## What's in this section

- [Quick start](/sandbox/quickstart/): install, set your API key, run your first command
- [Environments](/sandbox/environments/): available flavors and what's preinstalled
- [TypeScript SDK](/sandbox/typescript/): `@codecapsules/sandbox` on npm
- [Python SDK](/sandbox/python/): `codecapsules-sandbox` on PyPI
- [Tutorials](/sandbox/tutorials/): worked examples, starting with giving each user their own sandbox

## The three-line version

```typescript
import { Sandbox } from '@codecapsules/sandbox';

await Sandbox.using(async (sb) => {
  const r = await sb.exec('python -c "print(2 ** 32)"');
  console.log(r.stdout); // "4294967296\n"
});
// sandbox deleted automatically
```

```python
from codecapsules_sandbox import Sandbox

with Sandbox.create() as sb:
    result = sb.exec('python -c "print(2 ** 32)"')
    print(result.stdout)  # "4294967296\n"
```

## Access

The API is in private beta. [Join the waitlist](https://www.codecapsules.io/sandbox/waitlist/) and you'll get an API key when your spot is ready.
