---
slug: '/products/docker-capsule'
description: >-
  Run applications on Code Capsules with full control over how your capsule is
  built using a Dockerfile.
---

# Docker Capsule

Deploy applications on Code Capsules using your own Dockerfile. Docker Capsules give you full control over how your capsule is built and run, while Code Capsules handles hosting, networking, scaling, and operations.

## When to use a Docker Capsule

A Docker Capsule is a good fit when:

- You maintain a `Dockerfile` in your repository
- You need a specific base image or system packages
- Your application has a multi-stage or non-standard build
- You want full control over how your capsule is built and run

## Documentation

- [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/) — write a Dockerfile that works on Code Capsules
- [Deploy](/products/docker-capsule/deploy/) — create a capsule, connect a repository, and manage builds and deployment settings
- [Configure](/products/docker-capsule/configure/) — Docker File path, build context, network port, and environment variables
- [Builds](/products/docker-capsule/builds/) — trigger builds, auto-deploy from Git, and roll back to previous builds
- [Scale](/products/docker-capsule/scale/) — allocate CPU, memory, and replicas as traffic grows
- [Monitor](/products/docker-capsule/monitor/) — view metrics and performance data
- [Logs](/products/docker-capsule/logs/) — access build and runtime logs
- [Alerting](/products/docker-capsule/alerting/) — set up notifications for capsule events

## Guides

Step-by-step tutorials for Docker Capsules:

- [Flask Docker App](/backend/docker/flask-docker-app/)
- [Docker PHP App](/backend/docker/docker-php-app/)
- [Docker Laravel App](/backend/docker/docker-laravel-app/)
- [Caddy Docker Site](/backend/docker/caddy-docker-site/)
- [All Docker deployment guides](/backend/docker/)
