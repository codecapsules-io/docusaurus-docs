---
slug: "/products/docker-capsule/deploy/image"
description: "Deploy an existing public container image from Docker Hub, GitHub Container Registry, or another public registry to a Docker Capsule on Code Capsules."
title: "How to Deploy an Existing Docker Image"
sidebar_label: "From an Existing Image"
---

# Deploy Your Existing Container Image

Deploy an existing image when you already build and publish your application as a container image. Code Capsules pulls the image and runs it. There is no Dockerfile build on Code Capsules.

To have Code Capsules build your image from a Dockerfile instead, see [Deploy from Git](/products/docker-capsule/deploy/git/).

## Prerequisites

Before creating a capsule, make sure you have:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and Space
- A public container image, for example on Docker Hub or GitHub Container Registry

Your image must meet the [container requirements](/products/docker-capsule/container-requirements/): it must listen on the capsule's network port, bind to `0.0.0.0`, and start your application.

## Image references

Enter the image the same way you would with `docker pull`:

| Image reference                | What is deployed                               |
| ------------------------------ | ---------------------------------------------- |
| `nginx`                        | The `latest` tag of `nginx` on Docker Hub      |
| `nginx:1.27`                   | The `1.27` tag of `nginx` on Docker Hub        |
| `ghcr.io/your-org/your-app:v1` | The `v1` tag of an image on GitHub Container Registry |

:::info

Only public images are supported. If you don't specify a tag, Code Capsules uses `latest`. Image names must be lowercase.

:::

## Create the capsule

1. Log in to Code Capsules and open the Space where you want to run your application.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Docker Capsule**, your Team, and Space, then click **Next**.
4. On the **Plan** step, select or customize a payment plan, then click **Next**.
5. On the **Source** step, select **Container image**.
6. Enter the **Image reference**, then click **Next**.
7. On the **Deploy** step, check the image shown, and enter a **Capsule Name**. The name defaults to the image name.
8. Click **Create Capsule**.

{/* TODO: add screenshot static/gitbook-assets/products/docker-capsule/deploy/docker-image-reference.png, then uncomment */}
{/* ![Docker Capsule creation Source step with an image reference entered](/gitbook-assets/products/docker-capsule/deploy/docker-image-reference.png) */}

Code Capsules creates the capsule and assigns a default hostname. You are taken to the capsule **Details** tab.

If the image's registry is not supported, Code Capsules shows an error when you click **Create Capsule**.

## Deploy the image

The image is not deployed until you start the first deploy:

1. Open the **Deploy** tab.
2. Click **Pull & Deploy**, then confirm.

Follow progress in the **Builds** tab, where each pull appears as an **Image import** with its own log.

:::tip

Capsules listen on port `3000` by default. If your image serves on a different port, change the [network port](/products/docker-capsule/configure/#network-port) in the **Config** tab.

:::

## Manage your image source

The **Capsule Source** section on the **Deploy** tab shows the **Image** and the **Deployed digest**, which identifies the exact version of the image that is running. Before the first deploy, it shows **Not deployed yet**.

{/* TODO: add screenshot static/gitbook-assets/products/docker-capsule/deploy/docker-deploy-tab-image.png, then uncomment */}
{/* ![Docker Capsule Deploy tab showing an image source](/gitbook-assets/products/docker-capsule/deploy/docker-deploy-tab-image.png) */}

### Deploy a newer version

Each deploy runs the exact version of the image that was pulled. Publishing a new image to the same tag does not update your capsule automatically, and auto-deploy is not available for image deploys.

To deploy the latest version of your tag, click **Pull & Deploy**. If the tag now points to a newer version of the image, that version is deployed.

### Change the image

Click **Edit** in the **Capsule Source** section and enter a new **Image reference**. Saving a different image starts a new deploy. See [Change the source](/products/docker-capsule/deploy/#change-the-source) to switch to a Git repository instead.

## Verify your capsule

1. Open the **Details** tab and click the capsule URL.
2. If the page does not load, check that the [network port](/products/docker-capsule/configure/#network-port) matches the port your image serves on.
3. If the deploy fails, see [Image deploy fails](/products/docker-capsule/builds/#image-deploy-fails).
