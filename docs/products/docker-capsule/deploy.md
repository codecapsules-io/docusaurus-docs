---
slug: '/products/docker-capsule/deploy'
description: >-
  Create a Docker Capsule from a Git repository or an existing container image,
  and run your application on Code Capsules.
---

# Deploy

A Docker Capsule runs your application in a container on Code Capsules infrastructure. You can deploy it in one of two ways:

- **Git repository** — Code Capsules builds an image from a `Dockerfile` in your Git repository.
- **Container image** — Code Capsules deploys an existing public image, for example from Docker Hub or GitHub Container Registry.

## Prerequisites

Before creating a capsule, make sure you have:

- A [Code Capsules](https://codecapsules.io/) account with a Team and Space

To deploy from a **Git repository**, you also need:

- A Git repository containing a working `Dockerfile` — see [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/)
- Your GitHub account linked under [Connect Version Control](/platform/account/connect-version-control/)

To deploy from a **Container image**, you also need:

- A public container image, for example `nginx:1.27` on Docker Hub or `ghcr.io/your-org/your-app:v1` on GitHub Container Registry

## Create a Docker Capsule

1. Log in to Code Capsules and open the Space where you want to run your application.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Docker Capsule**, your Team, and Space, then click **Next**.
4. On the **Plan** step, select or customize a payment plan, then click **Next**.
5. On the **Source** step, choose how to deploy your capsule, then follow the steps for that source below.

{/* TODO: add screenshot static/gitbook-assets/products/docker-capsule/deploy/docker-choose-source.png, then uncomment */}
{/* ![Docker Capsule creation Source step showing the Git repository and Container image options](/gitbook-assets/products/docker-capsule/deploy/docker-choose-source.png) */}

## Choose a Source

### Git Repository

To build and deploy your application from a `Dockerfile` in your repository:

1. Select **Git repository**.
2. Select a repository from the **Git Repository** list, or click **Configure Git for Code Capsules** to link a new one.
3. Select the **Branch** to deploy from.
4. Click **Next**.
5. On the **Deploy** step, set your build options:
   - **Dockerfile location** — the subfolder containing your `Dockerfile`. Leave empty if the Dockerfile is at the repository root (uses `/Dockerfile`).
   - **Docker build context** — the directory used as the Docker build context. Leave empty for the repository root.
   - **Capsule Name** — a display name for your capsule.
6. Click **Create Capsule**.

![Docker Capsule creation Deploy step showing Dockerfile location, build context, and capsule name](/gitbook-assets/products/docker-capsule/deploy/docker-deploy-plan.png)

Code Capsules creates the capsule, links it to your repository, assigns a default hostname, and **automatically starts the first build**. You are taken to the capsule **Details** tab.

### Container Image

To deploy an existing container image:

1. Select **Container image**.
2. Enter the **Image reference**, for example:
   - `nginx` — the `latest` tag of `nginx` on Docker Hub
   - `nginx:1.27` — a specific tag on Docker Hub
   - `ghcr.io/your-org/your-app:v1` — an image on GitHub Container Registry
3. Click **Next**.
4. On the **Deploy** step, check the image shown, and enter a **Capsule Name**. The name defaults to the image name.
5. Click **Create Capsule**.

{/* TODO: add screenshot static/gitbook-assets/products/docker-capsule/deploy/docker-image-reference.png, then uncomment */}
{/* ![Docker Capsule creation Source step with an image reference entered](/gitbook-assets/products/docker-capsule/deploy/docker-image-reference.png) */}

:::info

Only public images are supported. If you don't specify a tag, Code Capsules uses `latest`. Image names must be lowercase.

:::

Code Capsules creates the capsule and assigns a default hostname. You are taken to the capsule **Details** tab.

The image is not deployed until you start the first deploy. To deploy it:

1. Open the **Deploy** tab.
2. Click **Pull & Deploy**, then confirm.

:::tip

Capsules listen on port `3000` by default. If your image serves on a different port, change the [network port](/products/docker-capsule/configure/#network-port) in the **Config** tab.

:::

## Deploy tab

After creation, open the **Deploy** tab to manage builds and deployment settings.

### Capsule source

The **Capsule Source** section shows where your capsule is deployed from:

- For a **Git repository**, it shows the linked **Repo** and **Branch**.
- For a **Container image**, it shows the **Image** and the **Deployed digest**, which identifies the exact version of the image that is running. Before the first deploy, it shows **Not deployed yet**.

{/* TODO: add screenshot static/gitbook-assets/products/docker-capsule/deploy/docker-deploy-tab-image.png, then uncomment */}
{/* ![Docker Capsule Deploy tab showing an image source](/gitbook-assets/products/docker-capsule/deploy/docker-deploy-tab-image.png) */}

### Change the source

Click **Edit** in the **Capsule Source** section to:

- Change the repository or branch
- Change the image reference
- Switch between **Git repository** and **Container image**

When you switch from a container image to a Git repository, you also set the **Docker File** and **Docker Build Context**.

Saving a new source starts a new build and deploy.

### Manual build

For a **Git repository**, use **Build & Deploy** to start a manual build from the linked branch.

For a **Container image**, use **Pull & Deploy** to pull the image again and deploy it. If the tag now points to a newer version of the image, that version is deployed.

When the build starts, follow progress in the **Builds** tab or via the notification link.

### Auto-deploy

**Auto-deploy** controls whether Code Capsules automatically rebuilds your capsule when you push commits to the linked Git branch. It is **enabled by default**.

| Setting          | Behavior                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| **On** (default) | Each push to the linked branch triggers a new build                     |
| **Off**          | Git pushes are ignored; trigger builds manually with **Build & Deploy** |

Toggle auto-deploy with the switch in the **Auto Build & Deploy** section.

:::info

Auto-deploy is only available for capsules deployed from a Git repository. A capsule deployed from a container image does not update automatically when a new image is published. Click **Pull & Deploy** to deploy the latest version of the image tag.

:::

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
2. If the page does not load, check the [network port](/products/docker-capsule/configure/#network-port). For a capsule deployed from a Git repository, also check the [Dockerfile requirements](/products/docker-capsule/writing-a-dockerfile/).

For a capsule deployed from a Git repository, adjust the Docker File path and build context in the **Config** tab — see [Configure](/products/docker-capsule/configure/).

## Example guides

- [Flask Docker App](/backend/docker/flask-docker-app/)
- [Docker PHP App](/backend/docker/docker-php-app/)
- [Docker Laravel App](/backend/docker/docker-laravel-app/)
- [Caddy Docker Site](/backend/docker/caddy-docker-site/)
