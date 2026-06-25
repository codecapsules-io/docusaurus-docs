---
slug: "/products/docker-capsule/logs"
description: >-
  View build, runtime, and access logs for a Docker Capsule to monitor activity
  and debug issues.
---

# Logs

Use capsule logs to monitor activity and debug runtime issues. Docker Capsules provide runtime logs and HTTP access logs. Build logs are covered in [Builds](/products/docker-capsule/builds/#view-build-logs).

## Runtime logs

View application output in the **Logs** tab. This includes stdout and stderr from your application and any processes started by your Dockerfile's `CMD` or `ENTRYPOINT`.

![Capsule Logs](/gitbook-assets/products/shared/logs.png)

When running multiple replicas, logs are collected from all active replicas. You can also inspect logs per replica to isolate issues affecting a single instance.

## Access logs

For capsules serving web traffic, open the **Access Logs** tab to view HTTP request logs.

![Access Logs](/gitbook-assets/products/shared/access-logs.png)

Access logs show request method, path, response status, client IP, and timing.

## Debugging with logs

| Symptom | Where to look |
|---|---|
| Build failure | [Build logs](/products/docker-capsule/builds/#view-build-logs) |
| App not starting or crashing | Runtime logs in the **Logs** tab |
| Port or binding issues | Runtime logs — see [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/) |
| Out of memory | Runtime logs for OOM messages — see [Scale](/products/docker-capsule/scale/) |
| Routing or slow endpoints | **Access Logs** tab |

## Log retention

Logs are retained for a limited period. For long-term storage or analysis, export or forward logs to an external system.
