---
slug: "/how-to/capsules/health-checks"
diataxis: how-to
title: "How to Configure Health Checks"
description: "Use a health check so Code Capsules only sends traffic to replicas that can serve it, and restarts replicas that stop responding."
sidebar_label: "Health checks"
---

# Health Checks

A health check lets Code Capsules ask your application whether it is ready to serve requests. Code Capsules only sends traffic to replicas that pass the check, and restarts replicas that keep failing it.

For what each setting does, see [Health check settings](/reference/capsules/health-checks/). To understand why health checks matter and how they run, see [Health checks explained](/explanation/capsules/health-checks/).

We recommend a health check for every capsule that serves HTTP traffic. **Automatic** with a simple `/health` endpoint is enough for most applications. See [Example endpoints](#example-endpoints) to add one.

## Where to set a health check

Health checks are available for [Backend](/how-to/capsules/backend/configure/), [Docker](/how-to/capsules/docker/configure/), [Agent](/how-to/capsules/agent/configure/), and [WordPress](/how-to/capsules/wordpress/configure/) Capsules. Each Configure page shows where to set the health check for that capsule type.

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
- **Keep it public.** Code Capsules sends the check directly to each replica, so [HTTP Basic authentication](/how-to/security/basic-auth/) on your domains does not apply. Authentication in your own application does, so leave the endpoint unauthenticated.
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
