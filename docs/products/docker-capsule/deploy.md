---
slug: "/products/docker-capsule/deploy"
description: "Create a Docker Capsule on Code Capsules from a Git repository and Dockerfile, or deploy an existing public container image from Docker Hub or GHCR."
title: "How to Deploy a Docker Container"
sidebar_label: "Deploy"
---

# Deploy Your Docker Container

A Docker Capsule runs your application in a container on Code Capsules infrastructure. You can deploy it in one of two ways:

- **[From Git](/products/docker-capsule/deploy/git/)** — Code Capsules builds an image from a `Dockerfile` in your Git repository.
- **[From an existing image](/products/docker-capsule/deploy/image/)** — Code Capsules deploys a public image you have already published, for example on Docker Hub or GitHub Container Registry.

## Choose how to deploy

|                    | From Git                                       | From an existing image                           |
| ------------------ | ---------------------------------------------- | ------------------------------------------------ |
| **You provide**    | A Git repository with a `Dockerfile`           | A public container image                         |
| **Who builds it**  | Code Capsules builds the image                 | You build and publish the image                  |
| **First deploy**   | Starts automatically when the capsule is created | Click **Pull & Deploy** after the capsule is created |
| **Updates**        | Auto-deploy on every push to your branch       | Click **Pull & Deploy** to deploy a newer image  |
| **Best for**       | Apps you build from source                     | Images built in your own CI, or published software |

You can switch between the two later — see [Change the source](#change-the-source).

## Create a Docker Capsule

1. Log in to Code Capsules and open the Space where you want to run your application.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Docker Capsule**, your Team, and Space, then click **Next**.
4. On the **Plan** step, select or customize a payment plan, then click **Next**.
5. On the **Source** step, choose how to deploy your capsule, then follow the guide for that source:
   - **Git repository** — see [Deploy from Git](/products/docker-capsule/deploy/git/)
   - **Container image** — see [Deploy an existing image](/products/docker-capsule/deploy/image/)

{/* TODO: add screenshot static/gitbook-assets/products/docker-capsule/deploy/docker-choose-source.png, then uncomment */}
{/* ![Docker Capsule creation Source step showing the Git repository and Container image options](/gitbook-assets/products/docker-capsule/deploy/docker-choose-source.png) */}

## Deploy tab

After creation, open the **Deploy** tab to manage your capsule's source and deployment settings. The settings below apply to both deploy methods. For source-specific settings, such as auto-deploy, see [Deploy from Git](/products/docker-capsule/deploy/git/#manage-your-git-source) or [Deploy an existing image](/products/docker-capsule/deploy/image/#manage-your-image-source).

### Change the source

Click **Edit** in the **Capsule Source** section to:

- Change the repository or branch
- Change the image reference
- Switch between **Git repository** and **Container image**

When you switch from a container image to a Git repository, you also set the **Docker File** and **Docker Build Context**.

Saving a new source starts a new build and deploy.

### Deployment strategy

The **Deployment strategy** controls how Code Capsules updates the capsule when a new build completes.

| Strategy                     | Behavior                                         | Best for                                         |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **Rolling update** (default) | New replicas start before old ones are removed   | Web applications with zero-downtime requirements |
| **Recreate**                 | All existing replicas stop before new ones start | Apps that cannot run two versions simultaneously |

Click **Edit** next to **Deployment Strategy** to change this setting. Saving restarts the capsule without triggering a new build.

### Recent builds

The **Builds** panel on the **Deploy** tab lists recent builds. Click **View Logs** to open build output in the **Builds** tab, or click **Deploy** on a previous successful build to roll back. See [Builds](/products/docker-capsule/builds/) for details.
