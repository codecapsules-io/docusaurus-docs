---
slug: "/sandbox/environments"
title: "Sandbox Environments & Flavors"
description: "Available sandbox flavors and what's preinstalled in each Linux environment."
sidebar_label: "Environments"
---

# Environments

Each sandbox is a pre-built Linux image. Pick the flavor that fits your workload.

## Available flavors

| Flavor | Preinstalled |
|--------|-------------|
| `python-3.12` | Python 3.12, pip, numpy, pandas, requests, git |
| `node-20` | Node.js 20, npm, yarn, git |
| `browser` | Chromium, Playwright, xvfb, Python 3.12 |
| `full` | Everything above + jq, ffmpeg, ImageMagick |

The default flavor is `python-3.12`.

## Resource limits

| Setting | Default | Maximum |
|---------|---------|---------|
| Memory | 512 MB | 8192 MB |
| vCPU | 1 | 4 |
| TTL | 60 min | 480 min |

## Specifying a flavor

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="ts" label="TypeScript">

```typescript
const sb = await Sandbox.create({ flavor: 'node-20' });
const sb = await Sandbox.create({ flavor: 'browser', memory: 2048 });

// or with using()
await Sandbox.using(async (sb) => {
  // ...
}, { flavor: 'full', memory: 4096, cpu: 2 });
```

</TabItem>
<TabItem value="py" label="Python">

```python
sb = Sandbox.create("node-20")
sb = Sandbox.create("browser", memory=2048)
sb = Sandbox.create("full", memory=4096, cpu=2)
```

</TabItem>
</Tabs>

## Installing additional packages

You can install anything at runtime with `exec()`. The install persists for the lifetime of that sandbox.

```bash
# Python packages
pip install scikit-learn torch transformers

# Node packages
npm install axios cheerio

# System packages
apt-get install -y curl build-essential
```

## Sandbox lifetime

Sandboxes are deleted when:

- You call `delete()` or exit the context manager / `using()` block
- The TTL expires (default 60 minutes)
- The sandbox encounters a fatal error

Nothing persists between sandboxes. Each one starts from a clean image.
