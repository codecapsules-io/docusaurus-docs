---
slug: '/products/docker-capsule/writing-a-dockerfile'
description: >-
  Write a Dockerfile that builds and runs correctly on Code Capsules Docker
  Capsules.
---

# Dockerfile

A Docker Capsule builds your application from a `Dockerfile` in your Git repository. Your Dockerfile should produce an application that listens on the configured network port and accepts external traffic when the capsule runs.

## Requirements

For your capsule to work on Code Capsules:

1. **Expose the correct port** — your application must listen on the port configured in the capsule's **Network port** setting (default `3000`). Code Capsules injects a `PORT` environment variable at runtime. Reading this keeps your Dockerfile portable across environments.
2. **Bind to all interfaces** — your app must listen on `0.0.0.0`, not `127.0.0.1` or `localhost`.
3. **Define a `CMD` or `ENTRYPOINT`** — your application must start when the capsule runs.

## Minimal example

This Dockerfile works for a Node.js application using the `PORT` environment variable:

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", "server.js"]
```

In your application code, read the port from the environment:

```javascript
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});
```

## Using the PORT environment variable

Code Capsules sets `PORT` to match your capsule's **Network port** configuration. Design your application to respect this variable so you can change the port in the Code Capsules UI without modifying your Dockerfile.

### Python (Flask)

```python
import os
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)
```

### Python (Gunicorn)

```dockerfile
CMD gunicorn --bind 0.0.0.0:${PORT:-3000} app:app
```

### Go

```go
port := os.Getenv("PORT")
if port == "" {
    port = "3000"
}
log.Fatal(http.ListenAndServe(":"+port, nil))
```

## Dockerfile location and build context

By default, Code Capsules looks for `Dockerfile` at the repository root and uses the entire repository as the build context. For nested or monorepo layouts, set the **Dockerfile path** and **Build context** in the [Config](/products/docker-capsule/configure/) tab.

## Multi-stage builds

Multi-stage builds are fully supported. Use them to keep production images small by separating build dependencies from the runtime image.

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE ${PORT}
CMD ["node", "dist/server.js"]
```

## System dependencies

Install any required system packages in your Dockerfile using the package manager for your base image. Everything your app needs must be declared in the Dockerfile — Code Capsules does not auto-detect dependencies.

```dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE ${PORT}
CMD ["python", "app.py"]
```

## Persistent storage

When bound to a [Storage Capsule](/products/storage-capsule/deploy/), read the mount path from the `PERSISTENT_STORAGE_DIR` environment variable. See [Configure](/products/docker-capsule/configure/#storage-capsule) for how to bind a Storage Capsule.

## Common issues

### Application listens on localhost

If your app binds to `127.0.0.1`, it will not accept traffic from Code Capsules ingress. Always bind to `0.0.0.0`:

```
# Wrong
app.run(host="127.0.0.1", port=3000)

# Correct
app.run(host="0.0.0.0", port=3000)
```

### Port mismatch

The port in your Dockerfile's `EXPOSE` directive is documentation only — it does not configure routing. The **Network port** in the [Config](/products/docker-capsule/configure/#network-port) tab must match the port your application actually listens on.

### Hardcoded port in CMD

Avoid hardcoding ports in your start command when possible. Use `$PORT` or read `process.env.PORT` / `os.environ["PORT"]` so the capsule configuration controls routing.

### Missing files in build context

If your Dockerfile references files outside the configured build context, the build will fail. See [Configure](/products/docker-capsule/configure/#build-context).
