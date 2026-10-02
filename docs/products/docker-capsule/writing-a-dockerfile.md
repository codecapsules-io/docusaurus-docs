---
slug: "/products/docker-capsule/writing-a-dockerfile"
description: "Write a Dockerfile for a Docker Capsule deployed from Git on Code Capsules: a working example, file location, build context, and multi-stage builds."
title: "How to Write a Dockerfile"
sidebar_label: "Dockerfile"
---

# Write a Dockerfile That Runs on Code Capsules

When you [deploy from Git](/products/docker-capsule/deploy/git/), Code Capsules builds your image from a `Dockerfile` in your repository. This page covers how to write that Dockerfile.

If you [deploy an existing image](/products/docker-capsule/deploy/image/) instead, you don't need a Dockerfile on Code Capsules. Your image still needs to meet the [container requirements](/products/docker-capsule/container-requirements/).

## Minimal example

This Dockerfile works for a Node.js application. It meets the [container requirements](/products/docker-capsule/container-requirements/): it listens on `0.0.0.0`, uses the `PORT` environment variable, and starts the app with `CMD`.

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

In your application code, read the port from the environment. See [Use the PORT environment variable](/products/docker-capsule/container-requirements/#use-the-port-environment-variable) for examples in other languages.

```javascript
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});
```

## Dockerfile location and build context

By default, Code Capsules looks for `/Dockerfile` at the repository root and uses `/` as the build context.

If your Dockerfile is somewhere else, enter its subfolder in the **Dockerfile location** field when you [create the capsule](/products/docker-capsule/deploy/git/#create-the-capsule). After creation, set the full **Docker File** path and **Docker Build Context** in the **Config** tab. See [Configure](/products/docker-capsule/configure/#docker-file) for examples, including monorepo layouts.

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

## Common build issues

### Missing files in build context

If your Dockerfile references files outside the configured build context, the build fails. See [Docker Build Context](/products/docker-capsule/configure/#docker-build-context).

### Build errors

Read the full build log in the **Builds** tab, and test the build locally with `docker build -f <dockerfile-path> <context-path>`. See [Troubleshooting builds](/products/docker-capsule/builds/#troubleshooting-builds).

For problems after the build succeeds, such as the app not responding, see [Container requirements](/products/docker-capsule/container-requirements/#common-issues).
