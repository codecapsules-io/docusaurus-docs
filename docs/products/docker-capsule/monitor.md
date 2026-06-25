---
slug: "/products/docker-capsule/monitor"
description: >-
  View CPU, memory, network, and storage metrics for a Docker Capsule in the
  Metrics tab.
---

# Monitor

Each Docker Capsule tracks resource usage over time. Open the **Metrics** tab on the capsule dashboard to view performance data.

![Monitor Capsule Metrics](/gitbook-assets/products/backend-capsule/monitor/backend-capsule-metrics.png)

## Available metrics

| Metric | Description |
|---|---|
| **CPU usage** | Processor utilization across replicas |
| **Memory usage** | RAM consumption across replicas |
| **Network transmit** | Outbound network traffic |
| **Network receive** | Inbound network traffic |
| **Storage usage** | Disk utilization when applicable |

When running multiple replicas, metrics reflect usage across all active instances.

## Next steps

- Sustained high CPU or memory usage may indicate a need to [scale](/products/docker-capsule/scale/) resources or add replicas.
- Unexpected changes after a build may point to a regression — check [Logs](/products/docker-capsule/logs/) and consider rolling back via [Builds](/products/docker-capsule/builds/).
- Configure [notifications](/products/docker-capsule/alerting/) to be alerted when thresholds are exceeded.
