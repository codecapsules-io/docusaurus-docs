---
slug: "/products/docker-capsule"
description: "Run containerized apps on Code Capsules with a Docker Capsule, built from your own Dockerfile or deployed from an existing public container image."
title: "Docker Container Hosting"
sidebar_label: "Docker Capsule"
---

# Everything About Hosting Your Docker Container

Deploy applications on Code Capsules using your own Dockerfile or an existing container image. Docker Capsules give you full control over how your capsule is built and run, while Code Capsules handles hosting, networking, scaling, and operations.

## When to use a Docker Capsule

A Docker Capsule is a good fit when:

- You maintain a `Dockerfile` in your repository
- You already publish a public container image, for example to Docker Hub or GitHub Container Registry
- You need a specific base image or system packages
- Your application has a multi-stage or non-standard build
- You want full control over how your capsule is built and run

## Choose how to deploy

You can deploy a Docker Capsule in one of two ways:

|                   | [From Git](/products/docker-capsule/git/deploy/) | [From an existing image](/products/docker-capsule/image/deploy/) |
| ----------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| **You provide**   | A Git repository with a `Dockerfile`             | A public container image                                         |
| **Who builds it** | Code Capsules builds the image                   | You build and publish the image                                  |
| **First deploy**  | Starts automatically when the capsule is created | Click **Pull & Deploy** after the capsule is created             |
| **Updates**       | Auto-deploy on every push to your branch         | Click **Pull & Deploy** to deploy a newer image                  |
| **Best for**      | Apps you build from source                       | Images built in your own CI, or published software               |

To start, click the yellow **+** button in your Space, select **New Capsule**, and choose **Docker Capsule**. On the **Source** step, choose **Git repository** or **Container image**.

![Docker Capsule creation Source step showing the Git repository and Container image options](/gitbook-assets/products/docker-capsule/deploy/docker-choose-source.png)

You can't switch between the two after the capsule is created. To use the other source, create a new Docker Capsule.

## Documentation

- [Container requirements](/products/docker-capsule/container-requirements/) — what every container needs to run on Code Capsules
- **From Git**
  - [Deploy](/products/docker-capsule/git/deploy/) — prepare a Dockerfile and create a capsule from your Git repository
  - [Builds & Auto-deploy](/products/docker-capsule/git/builds/) — trigger builds, auto-deploy on push, and set the Dockerfile path and build context
- **From an existing image**
  - [Deploy](/products/docker-capsule/image/deploy/) — create a capsule from a public container image
  - [Image Updates](/products/docker-capsule/image/updates/) — deploy a newer version of your image or change the image
- [Deployments](/products/docker-capsule/deployments/) — change the source, set the deployment strategy, view build logs, and roll back
- [Configure](/products/docker-capsule/configure/) — network port, environment variables, data capsules, and (for Git deployments) the Dockerfile path and build context
- [Scale](/products/docker-capsule/scale/) — allocate CPU, memory, and replicas as traffic grows
- [Monitor](/products/docker-capsule/monitor/) — view metrics and performance data
- [Logs](/products/docker-capsule/logs/) — view runtime and access logs
- [Notifications](/products/alerting/) — set up notifications for capsule events

## Guides

Step-by-step tutorials for deploying Docker Capsules from Git:

- [Flask Docker App](/backend/docker/flask-docker-app/)
- [Docker PHP App](/backend/docker/docker-php-app/)
- [Docker Laravel App](/backend/docker/docker-laravel-app/)
- [Caddy Docker Site](/backend/docker/caddy-docker-site/)
- [All Docker deployment guides](/backend/docker/)
