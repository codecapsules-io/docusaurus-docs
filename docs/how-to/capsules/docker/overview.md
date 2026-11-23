---
slug: "/how-to/capsules/docker/overview"
sidebar_position: 0
diataxis: how-to
description: "Run containerized apps on Code Capsules with a Docker Capsule, built from your own Dockerfile or deployed from an existing public container image."
title: "Docker Container Hosting"
sidebar_label: "Overview"
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

|                   | [From Git](/how-to/capsules/docker/git/deploy/) | [From an existing image](/how-to/capsules/docker/image/deploy/) |
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

- [Container requirements](/reference/capsules/docker/container-requirements/) — what every container needs to run on Code Capsules
- **From Git**
  - [Deploy](/how-to/capsules/docker/git/deploy/) — prepare a Dockerfile and create a capsule from your Git repository
  - [Builds & Auto-deploy](/how-to/capsules/docker/git/builds/) — trigger builds, auto-deploy on push, and set the Dockerfile path and build context
- **From an existing image**
  - [Deploy](/how-to/capsules/docker/image/deploy/) — create a capsule from a public container image
  - [Image Updates](/how-to/capsules/docker/image/updates/) — deploy a newer version of your image or change the image
- [Deployments](/how-to/capsules/docker/deployments/) — change the source, set the deployment strategy, view build logs, and roll back
- [Configure](/how-to/capsules/docker/configure/) — network port, environment variables, data capsules, and (for Git deployments) the Dockerfile path and build context
- [Scale](/how-to/capsules/docker/scale/) — allocate CPU, memory, and replicas as traffic grows
- [Monitor](/how-to/capsules/docker/monitor/) — view metrics and performance data
- [Logs](/how-to/capsules/docker/logs/) — view runtime and access logs
- [Notifications](/how-to/capsules/alerting/) — set up notifications for capsule events

## Guides

Step-by-step tutorials for deploying Docker Capsules from Git:

- [Flask Docker App](/how-to/capsules/backend/guides/docker/flask-docker-app/)
- [Docker PHP App](/how-to/capsules/backend/guides/docker/docker-php-app/)
- [Docker Laravel App](/how-to/capsules/backend/guides/docker/docker-laravel-app/)
- [Caddy Docker Site](/how-to/capsules/backend/guides/docker/caddy-docker-site/)
- [All Docker deployment guides](/how-to/capsules/backend/guides/docker/overview/)
