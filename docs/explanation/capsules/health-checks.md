---
slug: "/explanation/capsules/health-checks"
diataxis: explanation
title: "How Health Checks Work"
description: "Why health checks matter, how Code Capsules uses them, and how they relate to high availability and deployments."
sidebar_label: "Health checks"
---

# Health Checks Explained

A health check lets Code Capsules ask your application whether it is ready to serve requests. Code Capsules only sends traffic to replicas that pass the check, and restarts replicas that keep failing it.

To set up a health check, see [How to configure health checks](/how-to/capsules/health-checks/). For the exact settings, timings and check interval, see [Health check settings](/reference/capsules/health-checks/).

## Why use a health check

Without a health check, Code Capsules only knows whether your application's process is running, not whether it can serve requests. A running process is not always a working application:

- It can still be starting, for example while it connects to a database or loads its configuration.
- It can be stuck, for example because of a deadlock or because it has run out of connections, and stop responding without exiting.
- It can be running a new version that starts but cannot handle requests.

In each case, your users get errors or timeouts, and nothing fixes the replica until you notice and restart it yourself.

A health check fixes this:

- **No errors during deployments.** New replicas only get traffic after they pass the check, and with the default **Rolling update** strategy, old replicas keep serving until then. Your users never reach a replica that is still starting.
- **Bad releases do not go live.** With **Rolling update**, if a new version never passes the check, the old version keeps serving traffic, so a broken release does not take your capsule offline.
- **Automatic recovery.** A replica that stops responding is restarted without you having to do anything, even in the middle of the night.
- **High availability.** Your application stays available to your users even when part of it fails. See below.

### Health checks and high availability

A highly available application keeps serving users when something goes wrong, such as a crashed process, a stuck replica, or a bad deploy. With a health check, Code Capsules can assist in automatically recovering whilst retaining high availability of your app.

High availability needs two things:

1. **More than one replica.** If one replica fails, another can serve its traffic. To add replicas, see [Horizontal scaling](/how-to/capsules/docker/scale/#horizontal-scaling).
2. **A health check.** Code Capsules needs to know which replicas are working. Without a health check, traffic is still sent to a replica that has stopped responding, so some of your users get errors even though other replicas are fine.

With both, when one replica fails its checks, Code Capsules stops sending it traffic, the other replicas serve your users, and the failing replica is restarted. Your users do not notice the failure.

A health check helps a single replica too: it recovers automatically and deploys without errors. But while that replica is failing or restarting, there is nothing else to serve your users. For high availability, use a health check with at least two replicas.

## How health checks work

Code Capsules sends the check to each replica on its own, so one unhealthy replica does not affect the others. Each replica goes through two phases.

### 1. Startup

When a replica starts, Code Capsules waits for the **Time to first check**, then checks the replica until it passes once.

- While the replica is starting, it gets no traffic.
- The first check that passes ends the startup phase, and the replica starts getting traffic.
- If the replica does not pass within 10 minutes of the first check, it is restarted, and the startup phase begins again.

### 2. Running

After startup, Code Capsules keeps checking the replica, and uses the results in two ways:

| Checks failed in a row      | What happens                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------- |
| 5                           | The replica stops getting traffic. It gets traffic again as soon as it passes a check. |
| Enough to cover 5 minutes   | The replica is restarted, and goes through startup again.                              |

There are two limits so that a short problem does not cause a restart. For example, if your endpoint fails while your database restarts, Code Capsules stops sending traffic to the replica after about 50 seconds. When the database is back and the check passes, the replica gets traffic again, without a restart.

If every replica is failing, your capsule has no replicas to send traffic to, and requests to it fail until a replica passes again.

For the check interval and the timings by timeout, see [Check interval](/reference/capsules/health-checks/#check-interval).

### Example timeline

A capsule uses **Automatic** with the endpoint `/health`. Its application takes 25 seconds to start.

| Time     | Event                                                                                        |
| -------- | -------------------------------------------------------------------------------------------- |
| 0 s      | The replica starts.                                                                          |
| 10 s     | First check. The application is not listening yet, so the check fails.                      |
| 20 s     | The check fails again.                                                                       |
| 30 s     | The check passes. Startup ends, and the replica starts getting traffic.                     |
| Later    | The application's database goes down, and `/health` starts returning `503`.                 |
| +50 s    | 5 checks have failed. The replica stops getting traffic.                                     |
| +2 min   | The database is back. The next check passes, and the replica gets traffic again.             |

If the database had stayed down for 5 minutes, the replica would have been restarted.

### Deployments

How deployments use the health check depends on the [deployment strategy](/how-to/capsules/docker/deployments/#deployment-strategy):

| Strategy                     | What happens during a deployment                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Rolling update** (default) | Old replicas keep serving traffic until the new replicas pass their checks. A version that never becomes healthy does not take your capsule offline. |
| **Recreate**                 | Old replicas are stopped before the new ones start. Your capsule gets no traffic until the new replicas pass their checks, and stays offline if they never do. |

### When the health check is off

When the health check is **Off**, a Backend, Docker, or Agent Capsule gets traffic as soon as its container starts, and is only restarted if its process exits. An application that is still starting, or that has stopped responding without exiting, keeps getting traffic.

A WordPress Capsule with the health check off still checks that port `80` accepts connections.
