---
slug: "/how-to/capsules/docker/monitor"
diataxis: how-to
description: "Monitor your Docker Capsule on Code Capsules and track CPU, memory, network, and storage metrics for your container from the Metrics tab."
title: "How to Monitor a Docker Container"
sidebar_label: "Monitor"
---

# Monitor Your Docker Container Performance

Each Docker Capsule tracks resource usage over time. Open the **Metrics** tab on the capsule dashboard to view performance data.

![Docker Capsule Metrics tab with CPU, memory, and network charts](/gitbook-assets/products/docker-capsule/monitor/docker-metrics.png)

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

- Sustained high CPU or memory usage may indicate a need to [scale](/how-to/capsules/docker/scale/) resources or add replicas.
- Unexpected changes after a deploy may point to a regression — check [Logs](/how-to/capsules/docker/logs/) and consider [rolling back](/how-to/capsules/docker/deployments/#roll-back-to-a-previous-build) to a previous build.
- Configure [notifications](/how-to/alerting/) to be alerted when thresholds are exceeded.
