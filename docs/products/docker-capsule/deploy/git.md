---
slug: "/products/docker-capsule/deploy/git"
description: "Deploy a Docker Capsule on Code Capsules from a Dockerfile in your Git repository, with automatic builds and auto-deploy on every push to your branch."
title: "How to Deploy a Dockerfile From Git"
sidebar_label: "From Git"
---

# Deploy Your Dockerfile From a Git Repository

Deploy from a Git repository when you want Code Capsules to build your image for you. Code Capsules builds an image from the `Dockerfile` in your repository, runs it, and can rebuild automatically each time you push to your branch.

To deploy an image you have already built and published instead, see [Deploy an existing image](/products/docker-capsule/deploy/image/).

## Prerequisites

Before creating a capsule, make sure you have:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and Space
- A Git repository containing a working `Dockerfile` — see [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/)
- Your GitHub account linked under [Connect Version Control](/platform/account/connect-version-control/)

## Create the capsule

1. Log in to Code Capsules and open the Space where you want to run your application.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Docker Capsule**, your Team, and Space, then click **Next**.
4. On the **Plan** step, select or customize a payment plan, then click **Next**.
5. On the **Source** step, select **Git repository**.
6. Select a repository from the **Git Repository** list, or click **Configure Git for Code Capsules** to link a new one.
7. Select the **Branch** to deploy from, then click **Next**.
8. On the **Deploy** step, set your build options:
   - **Dockerfile location** — the subfolder containing your `Dockerfile`. Leave empty if the Dockerfile is at the repository root (uses `/Dockerfile`).
   - **Docker build context** — the directory used as the Docker build context. Leave empty for the repository root.
   - **Capsule Name** — a display name for your capsule.
9. Click **Create Capsule**.

![Docker Capsule creation Deploy step showing Dockerfile location, build context, and capsule name](/gitbook-assets/products/docker-capsule/deploy/docker-deploy-plan.png)

Code Capsules creates the capsule, links it to your repository, assigns a default hostname, and **automatically starts the first build**. You are taken to the capsule **Details** tab.

## Manage your Git source

Open the **Deploy** tab to see and manage how your capsule is built.

### Repository and branch

The **Capsule Source** section shows the linked **Repo** and **Branch**. Click **Edit** to change the repository or branch. Saving a new repository or branch starts a new build. See [Change the source](/products/docker-capsule/deploy/#change-the-source) to switch to an existing image instead.

### Manual build

Click **Build & Deploy** to start a manual build from the linked branch. Follow progress in the **Builds** tab or via the notification link.

### Auto-deploy

**Auto-deploy** controls whether Code Capsules automatically rebuilds your capsule when you push commits to the linked Git branch. It is **enabled by default**.

| Setting          | Behavior                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| **On** (default) | Each push to the linked branch triggers a new build                     |
| **Off**          | Git pushes are ignored; trigger builds manually with **Build & Deploy** |

Toggle auto-deploy with the switch in the **Auto Build & Deploy** section.

### Dockerfile path and build context

Change the **Docker File** path and **Docker Build Context** in the **Config** tab — see [Configure](/products/docker-capsule/configure/). Changing either one starts a new build.

## Verify your capsule

1. Open the **Details** tab and click the capsule URL.
2. If the page does not load, check the [network port](/products/docker-capsule/configure/#network-port) and the [Dockerfile requirements](/products/docker-capsule/writing-a-dockerfile/).
3. If the build fails, read the build log in the **Builds** tab — see [Troubleshooting builds](/products/docker-capsule/builds/#troubleshooting-builds).

## Example guides

- [Flask Docker App](/backend/docker/flask-docker-app/)
- [Docker PHP App](/backend/docker/docker-php-app/)
- [Docker Laravel App](/backend/docker/docker-laravel-app/)
- [Caddy Docker Site](/backend/docker/caddy-docker-site/)
