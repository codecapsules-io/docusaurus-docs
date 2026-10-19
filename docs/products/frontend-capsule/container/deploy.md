---
slug: "/products/frontend-capsule/container/deploy"
description: "Deploy a static site or SPA on Code Capsules with Container hosting. A web server runs in an always-on container with runtime logs, metrics, and scaling."
title: "How to Deploy a Container Frontend"
sidebar_label: "Deploy"
---

# Deploy Your Frontend With Container Hosting

With Container hosting, Code Capsules builds your project and serves the output from a web server that runs in an always-on container. You get runtime logs, access logs, and metrics, and you can scale CPU, memory, and replicas as your traffic grows.

Container hosting serves the same static files as [Static hosting](/products/frontend-capsule/static/deploy/). It doesn't run your own server code. If you need server-side rendering or API routes, use a [Backend Capsule](/products/backend-capsule/) instead.

## Prerequisites

Before creating a capsule, make sure you have:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and Space
- A payment method on your Team
- A repository with a site that builds to a folder of static files, or that already contains your `index.html`
- Your version control account linked under [Connect Version Control](/platform/account/connect-version-control/)

## Prepare your project

Your build must produce a folder that contains an `index.html` file, for example `dist` or `build`. See [Supported Runtimes](/products/frontend-capsule/supported-runtimes/#supported-frameworks) for the build command and output folder for common frameworks.

You don't need a `Dockerfile` or a web server in your project. Code Capsules builds your site and adds the web server for you. To run your own container image, use a [Docker Capsule](/products/docker-capsule/) instead.

## Create the capsule

1. Log in to Code Capsules and open the Space where you want to host your site.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Frontend Capsule**, your Team, and Space, then click **Next**.
4. On the **Hosting** step, select **Container**.
5. On the **Plan** step, select a plan, or choose **Custom** to set the CPU, memory, and replicas yourself. You can change this later from the [Scale](/products/frontend-capsule/scale/) tab.
6. On the **Configure** step:
   - Select a repository from the list, or click **Connect a Git Repository** to link a new one.
   - Select the branch to deploy from.
   - If your project is in a subfolder of the repository, enter it in **Repo subpath**.
7. On the **Deploy** step, set your build options:
   - **Build Command**: the command that builds your site, for example `npm run build`. Leave it empty if your site has no build step.
   - **Path to static content**: the folder your build creates that contains `index.html`, for example `dist`.
   - **Capsule Name**: a name for your capsule.
8. Click **Build & Deploy**.

Code Capsules creates the capsule and starts the first build. When the build finishes, the container starts and your site is live.

## How your site is served

The web server in your container:

- Serves your site over HTTPS on the capsule's address and any [custom domains](/products/frontend-capsule/custom-domains/)
- Returns your `index.html` for paths that don't match a file, so client-side routers such as React Router and Vue Router work on page refresh
- Compresses responses for faster loading

## Verify your capsule

1. Open the **Details** tab and click the capsule URL.
2. If the build fails, open the **Builds** tab to read the build log.
3. If the page is blank or returns an error, check that **Path to static content** points to the folder that contains `index.html`. See [Configure](/products/frontend-capsule/configure/).
4. Check the runtime [logs](/products/frontend-capsule/logs/) for errors from the web server.

## Next steps

- [Scale](/products/frontend-capsule/scale/): change CPU, memory, and replicas
- [Monitor](/products/frontend-capsule/monitor/) and [Logs](/products/frontend-capsule/logs/): watch performance and traffic
- [Configure](/products/frontend-capsule/configure/): change build settings and environment variables
- [Custom Domains](/products/frontend-capsule/custom-domains/): serve your site from your own domain
- [Framework Guides](/products/frontend-capsule/deploy/): React, Angular, Vue, Svelte, and static HTML
