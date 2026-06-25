---
slug: '/products/docker-capsule/deploy'
description: >-
  Create a Docker Capsule, connect a Git repository, and run your application
  on Code Capsules.
---

# Deploy

A Docker Capsule builds your application from a `Dockerfile` in your Git repository and runs it on Code Capsules infrastructure.

## Prerequisites

Before creating a capsule, make sure you have:

- A [Code Capsules](https://codecapsules.io/) account with a Team and Space
- A Git repository containing a working `Dockerfile` — see [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/)
- Your GitHub account linked under [Connect Version Control](/platform/account/connect-version-control/)

## Create a Docker Capsule

1. Log in to Code Capsules and open the Space where you want to run your application.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Docker Capsule**, your Team, and Space.
4. Select a payment plan.
5. Click the GitHub button and grant access to your repository.
6. Select the repository and branch to build from.
7. Click **Create Capsule**.

Code Capsules creates the capsule, links it to your repository, assigns a default hostname, and **automatically starts the first build**.

## Build and run

When you create a Docker Capsule, Code Capsules immediately queues a fresh build. Open the **Deploy** tab to monitor progress — click **View build progress** to follow the build log.

When the build succeeds, Code Capsules automatically runs your capsule and your application becomes available at the capsule URL in the **Details** tab.

Review and adjust build settings in the **Config** tab — see [Configure](/products/docker-capsule/configure/). For details on subsequent builds, auto-build, build history, and rollbacks, see [Builds](/products/docker-capsule/builds/).

## Verify your capsule

1. Open the **Details** tab and click the capsule URL.
2. If the page does not load, check the [network port](/products/docker-capsule/configure/#network-port) and [Dockerfile requirements](/products/docker-capsule/writing-a-dockerfile/).

## Example guides

- [Flask Docker App](/backend/docker/flask-docker-app/)
- [Docker PHP App](/backend/docker/docker-php-app/)
- [Docker Laravel App](/backend/docker/docker-laravel-app/)
- [Caddy Docker Site](/backend/docker/caddy-docker-site/)
