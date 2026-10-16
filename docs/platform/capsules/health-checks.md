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

### Check interval

Code Capsules checks each replica every 10 seconds. If the timeout is longer than 10 seconds, the check runs once per timeout instead, so checks never overlap. The time limits stay about the same, but fewer checks fit in them:

| Timeout     | Check interval | Traffic stops after | Restart after         |
| ----------- | -------------- | ------------------- | --------------------- |
| 1–10 s      | 10 s           | 5 checks, ~50 s     | 30 checks, 5 minutes  |
| 15 s        | 15 s           | 5 checks, ~75 s     | 20 checks, 5 minutes  |
| 30 s        | 30 s           | 5 checks, ~150 s    | 10 checks, 5 minutes  |
| 60 s        | 60 s           | 5 checks, ~5 min    | 5 checks, 5 minutes   |

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

During a [rolling update](/products/docker-capsule/deployments/#deployment-strategy), old replicas keep serving traffic until the new replicas pass their checks. A build that never becomes healthy does not take your capsule offline.

### When the health check is off

When the health check is **Off**, a Backend, Docker, or Agent Capsule gets traffic as soon as its container starts, and is only restarted if its process exits. An application that is still starting, or that has stopped responding without exiting, keeps getting traffic.

A WordPress Capsule with the health check off still checks that port `80` accepts connections.

## Example configurations

### A typical web application

An Express or Flask application that starts in a few seconds, with a `/health` route that responds immediately.

| Setting      | Value       |
| ------------ | ----------- |
| Health Check | **Automatic** |
| Endpoint     | `/health`   |

**Automatic** suits most applications. Its startup phase allows 10 minutes, so it also works for applications that take a minute or two to start.

### An application that takes a long time to start

An application that loads a large machine learning model, and takes about 12 minutes before it can respond. With **Automatic**, the 10-minute startup limit would restart it before it is ready.

| Setting                | Value      |
| ---------------------- | ---------- |
| Health Check           | **Manual** |
| Endpoint               | `/health`  |
| Timeout                | `5`        |
| Time to first check    | `300`      |

The first check runs 5 minutes after start, and the replica then has another 10 minutes to pass it.

### A slow endpoint

An endpoint that checks a dependency and sometimes takes up to 8 seconds to respond. With **Automatic**, the 5-second timeout fails those checks.

| Setting                | Value      |
| ---------------------- | ---------- |
| Health Check           | **Manual** |
| Endpoint               | `/health`  |
| Timeout                | `15`       |
| Time to first check    | `10`       |

A timeout of 15 seconds also makes the checks run every 15 seconds, so the replica stops getting traffic after about 75 seconds of failures, not 50. Where you can, make the endpoint faster instead.

## Write a good health check endpoint

- **Respond quickly.** Return a response well within the timeout. A slow endpoint fails checks even when your application is working.
- **Keep it public.** Code Capsules sends the check directly to each replica, so [HTTP Basic authentication](/platform/security/basic-auth/) on your domains does not apply. Authentication in your own application does, so leave the endpoint unauthenticated.
- **Accept any host name.** The check is sent to the replica's internal address, not your domain. Frameworks that only accept known host names, such as Django with `ALLOWED_HOSTS`, can reject it with a `400`.
- **Check only what your application needs to serve requests.** If the endpoint also fails when a database is unreachable, every replica stops getting traffic until the database is back. That is the right choice only if your application cannot serve anything without it.

The check includes an `X-Forwarded-Proto: https` header, the same as traffic from your domains, so applications that redirect HTTP to HTTPS respond as they normally would.

:::tip

For a WordPress Capsule, `/wp-login.php` is a good endpoint: it loads WordPress and connects to the database without rendering your theme. If a security plugin hides the login page, choose another page that loads WordPress, because a `404` fails the check.

:::

## Example endpoints

Each example returns `200` on `/health`. Make sure the application listens on your capsule's network port.

### Node.js (Express)

```js
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});
```

### Python (Flask)

```python
@app.get("/health")
def health():
    return "ok", 200
```

### Python (FastAPI)

```python
@app.get("/health")
def health():
    return {"status": "ok"}
```

### Python (Django)

Django checks the `Host` header against `ALLOWED_HOSTS`, and the check uses the replica's internal address, so a normal view returns `400`. Answer the check in a middleware that runs before Django reads the host:

```python
# myproject/health.py
from django.http import HttpResponse

class HealthCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path == "/health":
            return HttpResponse("ok")
        return self.get_response(request)
```

Add it as the first entry in `MIDDLEWARE`:

```python
MIDDLEWARE = [
    "myproject.health.HealthCheckMiddleware",
    # ...
]
```

### Go

```go
http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("ok"))
})
```

### Check a dependency

To stop traffic to a replica when the database is unreachable, check the database in the endpoint, and return `503` when it fails. Keep the check fast, for example a single `SELECT 1`:

```js
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).send('ok');
  } catch {
    res.status(503).send('database unavailable');
  }
});
```

Only do this if your application cannot serve anything without the database. See [Write a good health check endpoint](#write-a-good-health-check-endpoint).
