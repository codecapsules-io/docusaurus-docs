---
slug: "/products/frontend-capsule/static/deploy"
description: "Deploy a static site or SPA on Code Capsules with Static hosting. Your built files are served directly, with a Free plan and no server to keep running."
title: "How to Deploy a Static Frontend"
sidebar_label: "Deploy"
---

# Deploy Your Frontend With Static Hosting

With Static hosting, Code Capsules builds your project, stores the files your build produces, and serves them directly. There's no server to keep running between visits, so Static hosting is quick to serve and is available on a [Free plan](/products/frontend-capsule/static/plans/).

To run your site in an always-on container instead, see [Deploy with Container hosting](/products/frontend-capsule/container/deploy/).

## Prerequisites

Before creating a capsule, make sure you have:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and Space
- A repository with a site that builds to a folder of static files, or that already contains your `index.html`
- Your version control account linked under [Connect Version Control](/platform/account/connect-version-control/)
- For the **Paid** plan, a payment method on your Team. The **Free** plan doesn't need one.

## Prepare your project

Your build must produce a folder that contains an `index.html` file, for example `dist` or `build`. See [Supported Runtimes](/products/frontend-capsule/supported-runtimes/#supported-frameworks) for the build command and output folder for common frameworks.

If your repository already contains the files you want to serve, you don't need a build step. Leave **Build Command** empty when you create the capsule.

## Create the capsule

1. Log in to Code Capsules and open the Space where you want to host your site.
2. Click the yellow **+** button and select **New Capsule**.
3. Choose **Frontend Capsule**, your Team, and Space, then click **Next**.
4. On the **Hosting** step, select **Static**.
5. On the **Plan** step, select **Free** or **Paid**. Each plan shows its limits and price. See [Free and Paid Plans](/products/frontend-capsule/static/plans/) to compare them.
6. On the **Configure** step:
   - Select a repository from the list, or click **Connect a Git Repository** to link a new one.
   - Select the branch to deploy from.
   - If your project is in a subfolder of the repository, enter it in **Repo subpath**.
7. On the **Deploy** step, set your build options:
   - **Build Command**: the command that builds your site, for example `npm run build`. Leave it empty if your site has no build step.
   - **Path to static content**: the folder your build creates that contains `index.html`, for example `dist`.
   - **Capsule Name**: a name for your capsule. On the Free plan, the name is also part of your site's address. Code Capsules checks that the address is available as you type.
8. Click **Build & Deploy**.

Code Capsules creates the capsule and starts the first build. When the build finishes, your site is live.

## How your site is served

Static capsules handle the common needs of a frontend site for you:

- **HTTPS**: every address gets its own SSL certificate, including [custom domains](/products/frontend-capsule/custom-domains/).
- **SPA routing**: requests for paths that don't match a file return your `index.html`, so client-side routers such as React Router and Vue Router work on page refresh.
- **Caching**: HTML pages are always revalidated, so visitors get your latest deploy. Assets with a content hash in the file name, such as `main.3f9a1c.js`, are cached by browsers for up to a year.
- **Compression**: responses are compressed for faster loading.
- **Safe deploys**: new assets are uploaded before your HTML is switched over, so visitors don't load a page that points at missing files. Files from the previous deploy stay available for 24 hours.

## Verify your capsule

1. Open the **Details** tab and click the capsule URL.
2. If the build fails, open the **Builds** tab to read the build log.
3. If the build succeeds but the page is blank or returns an error, check that **Path to static content** points to the folder that contains `index.html`. See [Configure](/products/frontend-capsule/configure/).

The **Details** tab also shows how much storage your site uses and how much traffic it has served this month.

## Turn your site off and on

To stop serving your site, turn the capsule off with the switch on the capsule dashboard. Visitors can no longer reach it, but its files and address are kept. Turn it back on to put the site back online at the same address. No rebuild is needed.

## Next steps

- [Free and Paid Plans](/products/frontend-capsule/static/plans/): limits, monthly traffic, and upgrading
- [Configure](/products/frontend-capsule/configure/): change build settings and environment variables
- [Custom Domains](/products/frontend-capsule/custom-domains/): serve your site from your own domain
- [Framework Guides](/products/frontend-capsule/deploy/): React, Angular, Vue, Svelte, and static HTML
