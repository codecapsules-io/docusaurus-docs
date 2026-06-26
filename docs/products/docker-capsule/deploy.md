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
3. Choose **Docker Capsule**, your Team, and Space, then click **Next**.
4. On the **Plan** step, select or customize a payment plan, then click **Next**.
5. On the **Configure** step, connect a Git repository:
   - Select a repository from the list, or use the GitHub connect button to link a new one.
   - Choose the branch to deploy from.
   - Click **Next**.
6. On the **Deploy** step, set your build options:
   - **Dockerfile location** — the subfolder containing your `Dockerfile`. Leave empty if the Dockerfile is at the repository root (uses `/Dockerfile`).
   - **Docker build context** — the directory used as the Docker build context. Leave empty for the repository root.
   - **Capsule Name** — a display name for your capsule.
7. Click **Create Capsule**.

![Docker Capsule creation Deploy step showing Dockerfile location, build context, and capsule name](/gitbook-assets/products/docker-capsule/deploy/docker-deploy-plan.png)

Code Capsules creates the capsule, links it to your repository, assigns a default hostname, and **automatically starts the first build**. You are taken to the capsule **Details** tab.

## Deploy tab

After creation, open the **Deploy** tab to manage builds and deployment settings.

### Repository and branch

The **Capsule Branch** section shows the linked repository and branch. Click **Edit** to change the repository or branch. Saving a new repository or branch triggers a new build.

### Manual build

Use **Build & Deploy** to start a manual build from the linked branch. When the build starts, follow progress in the **Builds** tab or via the notification link.

### Auto-deploy

**Auto-deploy** controls whether Code Capsules automatically rebuilds your capsule when you push commits to the linked Git branch. It is **enabled by default**.

| Setting          | Behavior                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| **On** (default) | Each push to the linked branch triggers a new build                     |
| **Off**          | Git pushes are ignored; trigger builds manually with **Build & Deploy** |

Toggle auto-deploy with the switch in the **Auto Build & Deploy** section.

### Deployment strategy

The **Deployment strategy** controls how Code Capsules updates the capsule when a new build completes.

| Strategy                     | Behavior                                         | Best for                                         |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **Rolling update** (default) | New replicas start before old ones are removed   | Web applications with zero-downtime requirements |
| **Recreate**                 | All existing replicas stop before new ones start | Apps that cannot run two versions simultaneously |

Click **Edit** next to **Deployment Strategy** to change this setting. Saving restarts the capsule without triggering a new build.

### Recent builds

The **Builds** panel on the **Deploy** tab lists recent builds. Click **View Logs** to open build output in the **Builds** tab, or click **Deploy** on a previous successful build to roll back. See [Builds](/products/docker-capsule/builds/) for details.

## Verify your capsule

1. Open the **Details** tab and click the capsule URL.
2. If the page does not load, check the [network port](/products/docker-capsule/configure/#network-port) and [Dockerfile requirements](/products/docker-capsule/writing-a-dockerfile/).

Adjust Docker File path and build context in the **Config** tab — see [Configure](/products/docker-capsule/configure/).

## Example guides

- [Flask Docker App](/backend/docker/flask-docker-app/)
- [Docker PHP App](/backend/docker/docker-php-app/)
- [Docker Laravel App](/backend/docker/docker-laravel-app/)
- [Caddy Docker Site](/backend/docker/caddy-docker-site/)
