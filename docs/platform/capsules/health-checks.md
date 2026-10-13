---
slug: "/platform/capsules/health-checks"
title: "How to Configure Health Checks"
description: "Use a health check so Code Capsules only sends traffic to replicas that can serve it, and restarts replicas that stop responding."
sidebar_label: "Health checks"
---

# Health Checks

A health check lets Code Capsules ask your application whether it is ready to serve requests. Code Capsules only sends traffic to replicas that pass the check, and restarts replicas that keep failing it.

Health checks are available for [Backend](/products/backend-capsule/configure/), [Docker](/products/docker-capsule/configure/), [Agent](/products/agent-capsule/configure/), and [WordPress](/products/wordpress-capsule/configure/) Capsules. Each Configure page shows where to set the health check for that capsule type.

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

## How health checks behave

Code Capsules checks each replica every 10 seconds. If the timeout is longer than 10 seconds, the check runs once per timeout instead, so checks never overlap.

| When                                  | What happens                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| A replica starts                      | It gets no traffic until it passes a check. If it does not pass within 10 minutes of the first check, it is restarted. |
| A replica fails 5 checks in a row     | It stops getting traffic, about 50 seconds after it starts failing. It gets traffic again when it passes a check. |
| A replica keeps failing for 5 minutes | It is restarted.                                                                                              |

During a [rolling update](/products/docker-capsule/deployments/#deployment-strategy), old replicas keep serving traffic until the new replicas pass their checks. A build that never becomes healthy does not take your capsule offline.

When the health check is **Off**, a Backend, Docker, or Agent Capsule gets traffic as soon as its container starts, and is only restarted if its process exits. A WordPress Capsule with the health check off still checks that port `80` accepts connections.

## Write a good health check endpoint

- **Respond quickly.** Return a response well within the timeout. A slow endpoint fails checks even when your application is working.
- **Keep it public.** Code Capsules sends the check directly to each replica, so [HTTP Basic authentication](/platform/security/basic-auth/) on your domains does not apply. Authentication in your own application does, so leave the endpoint unauthenticated.
- **Accept any host name.** The check is sent to the replica's internal address, not your domain. Frameworks that only accept known host names, such as Django with `ALLOWED_HOSTS`, can reject it with a `400`.
- **Check only what your application needs to serve requests.** If the endpoint also fails when a database is unreachable, every replica stops getting traffic until the database is back. That is the right choice only if your application cannot serve anything without it.

The check includes an `X-Forwarded-Proto: https` header, the same as traffic from your domains, so applications that redirect HTTP to HTTPS respond as they normally would.

:::tip

For a WordPress Capsule, `/wp-login.php` is a good endpoint: it loads WordPress and connects to the database without rendering your theme. If a security plugin hides the login page, choose another page that loads WordPress, because a `404` fails the check.

:::
