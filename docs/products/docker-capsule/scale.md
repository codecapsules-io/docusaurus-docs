---
slug: '/products/docker-capsule/scale'
description: >-
  Allocate CPU, memory, GPU, and replicas to a Docker Capsule as your
  application's traffic and computational needs change.
---

# Scale

Allocate more resources to a Docker Capsule as your application's traffic and computational needs change. Docker Capsules support horizontal scaling through replicas and vertical scaling through CPU, memory, and optional GPU allocation.

## Scale resources

View scaling options in the **Scale** tab of the capsule dashboard. Click **Edit** in the **Capsule Capacity** section to adjust resources.

![Scale a Capsule](/gitbook-assets/products/backend-capsule/scale/backend-scale-edit.png)

Use the sliders to configure:

| Resource     | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| **CPU**      | Processing power allocated to each replica                       |
| **Memory**   | RAM available to each replica                                    |
| **GPU**      | GPU devices per replica (when available in your region and plan) |
| **Replicas** | Number of capsule replicas running simultaneously                |

Click **Save** to apply your changes. If the capsule is already running, Code Capsules updates it with the new resource limits.

![Configure Capsule Capacity](/gitbook-assets/products/backend-capsule/scale/backend-scale-custom.png)

## Horizontal scaling

Increase **Replicas** to run multiple instances of your capsule behind the same URL. Code Capsules load-balances traffic across active replicas.

Horizontal scaling works well for stateless applications. If your app stores state in memory or on local disk, externalize it with a [Storage Capsule](/products/storage-capsule/deploy/) or [Database Capsule](/products/database-capsule/) as appropriate, or use a single replica.

## Vertical scaling

Increase **CPU** or **Memory** when individual replicas need more capacity — for example, when handling larger workloads, running compute-heavy tasks, or addressing out-of-memory errors.

Vertical scaling applies to each replica independently. If you run three replicas with 1 GB of memory each, total memory usage across the capsule is 3 GB.

## GPU scaling

When GPU support is enabled for your Space and plan, you can allocate GPU devices to Docker Capsules. This is useful for machine learning inference, media processing, and other GPU-accelerated workloads.

GPU availability depends on your region and namespace capabilities. Configure GPU allocation from the same **Scale** tab when the option is available.

## Start and stop

You can temporarily stop a Docker Capsule without deleting it:

- **Stop** — sets replicas to `0`; the capsule stops consuming compute resources but retains its configuration and build history
- **Start** — sets replicas to `1` and brings the capsule back online

Use the toggle in the capsule header to turn the capsule off and on.

## Scaling and Storage Capsules

Before increasing replicas, consider how your application handles shared state. Bind a [Storage Capsule](/products/storage-capsule/deploy/) or [Database Capsule](/products/database-capsule/) — see [Configure](/products/docker-capsule/configure/#connect-database-and-storage-capsules). Local capsule storage is not shared between replicas and is lost on rebuild.
