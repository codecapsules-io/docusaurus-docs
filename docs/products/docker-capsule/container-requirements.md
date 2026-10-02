---
slug: "/products/docker-capsule/container-requirements"
description: "Make sure your container runs on a Code Capsules Docker Capsule: listen on the network port, bind to 0.0.0.0, start your app, and read the PORT variable."
title: "Docker Container Runtime Requirements"
sidebar_label: "Container Requirements"
---

# Make Your Container Ready for Code Capsules

Every Docker Capsule runs your application in a container, whether Code Capsules [builds it from a Dockerfile in your Git repository](/products/docker-capsule/deploy/git/) or you [deploy an existing image](/products/docker-capsule/deploy/image/). In both cases, the running container must meet the requirements on this page to receive traffic.

## Requirements

For your capsule to work on Code Capsules:

1. **Listen on the network port** — your application must listen on the port configured in the capsule's [Network port](/products/docker-capsule/configure/#network-port) setting (default `3000`).
2. **Bind to all interfaces** — your app must listen on `0.0.0.0`, not `127.0.0.1` or `localhost`.
3. **Start your application** — the image must define a `CMD` or `ENTRYPOINT` that starts your application when the capsule runs.

## Use the PORT environment variable

Code Capsules sets a `PORT` environment variable to match your capsule's **Network port**. If your application reads this variable, you can change the port in the Code Capsules UI without rebuilding your image.

### Node.js

```javascript
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});
```

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

## Images that use a fixed port

Many published images ignore `PORT` and always listen on a fixed port. For example, the official `nginx` image listens on port `80`. When you deploy an image like this, set the capsule's [Network port](/products/docker-capsule/configure/#network-port) to the port the image listens on.

## Persistent storage

Files written inside the container are lost when the capsule restarts. To keep files, bind a [Storage Capsule](/products/storage-capsule/deploy/) and read the mount path from the `PERSISTENT_STORAGE_DIR` environment variable. See [Configure](/products/docker-capsule/configure/#storage-capsule) for how to bind a Storage Capsule.

## Common issues

### Application listens on localhost

If your app binds to `127.0.0.1`, it will not accept traffic from Code Capsules. Always bind to `0.0.0.0`:

```
# Wrong
app.run(host="127.0.0.1", port=3000)

# Correct
app.run(host="0.0.0.0", port=3000)
```

### Port mismatch

The port in a Dockerfile's `EXPOSE` directive is documentation only — it does not configure routing. The **Network port** in the [Config](/products/docker-capsule/configure/#network-port) tab must match the port your application actually listens on at runtime.

### Hardcoded port in CMD

Avoid hardcoding ports in your start command when possible. Use `$PORT` or read `process.env.PORT` / `os.environ["PORT"]` so the capsule configuration controls routing.

If the capsule still does not respond, check the runtime output in [Logs](/products/docker-capsule/logs/).
