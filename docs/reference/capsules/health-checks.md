---
slug: "/reference/capsules/health-checks"
diataxis: reference
title: "Health Check Settings and Timings"
description: "Health check settings, defaults, limits and check intervals for Backend, Docker, Agent and WordPress Capsules."
sidebar_label: "Health checks"
---

# Health Check Reference

The settings and timings for health checks on Backend, Docker, Agent, and WordPress Capsules. To set one up, see [How to configure health checks](/how-to/capsules/health-checks/). For how the checks run, see [Health checks explained](/explanation/capsules/health-checks/).

## Health check settings

| Setting       | What Code Capsules checks                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| **Off**       | No health check. Traffic is sent to a replica as soon as it starts.                                     |
| **Automatic** | Your endpoint, with recommended timings: the first check runs 10 seconds after start, with a 5 second timeout. |
| **Manual**    | Your endpoint, with your own timeout and time to first check.                                           |

Changing the health check redeploys the capsule. It does not trigger a new build.

### Endpoint

The **Endpoint** is the path in your application that Code Capsules sends an HTTP `GET` request to, for example `/health`. It must start with `/` and cannot contain spaces.

The request goes to your capsule's network port. A WordPress Capsule is checked on port `80`.

A response with a status code from `200` to `399` passes the check. Any other status code, or no response before the timeout, fails it.

### Timeout (seconds)

:::info[Manual only]

**Automatic** uses a timeout of 5 seconds.

:::

How long Code Capsules waits for a response before the check fails. Enter a value from `1` to `60`.

### Time to first check (seconds)

:::info[Manual only]

**Automatic** waits 10 seconds.

:::

How long Code Capsules waits after your application starts before running the first check. Enter a value from `0` to `600`. Give your application enough time to start listening on its port.

## Check interval

Code Capsules checks each replica every 10 seconds. If the timeout is longer than 10 seconds, the check runs once per timeout instead, so checks never overlap. The time limits stay about the same, but fewer checks fit in them:

| Timeout     | Check interval | Traffic stops after | Restart after         |
| ----------- | -------------- | ------------------- | --------------------- |
| 1–10 s      | 10 s           | 5 checks, ~50 s     | 30 checks, 5 minutes  |
| 15 s        | 15 s           | 5 checks, ~75 s     | 20 checks, 5 minutes  |
| 30 s        | 30 s           | 5 checks, ~150 s    | 10 checks, 5 minutes  |
| 60 s        | 60 s           | 5 checks, ~5 min    | 5 checks, 5 minutes   |
