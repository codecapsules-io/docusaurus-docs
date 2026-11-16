---
slug: "/frontend/next.js"
description: "Deploy a Next.js application to Code Capsules from a GitHub repo. Host your React framework frontend in production with auto-deploys, step by step."
title: "How to Host a Next.js App"
sidebar_label: "Next.js"
---

# Host Your Next.js App in Minutes

:::info[Static export or server rendering]
A Next.js **static export** (`output: 'export'`, built with `next build` into the `out` folder) deploys on a [static Frontend Capsule](/products/frontend-capsule/static/deploy/), which is free for up to five sites. A **server-rendered** Next.js app needs a running server and deploys on a Backend Capsule, which is the setup this guide walks through.
:::

Deploy a Next.js application and learn how to host backend code on Code Capsules.

## Set up

To follow this guide, you'll need:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and a Space. See [Teams](/platform/teams/what-is-a-team/) and [Spaces](/platform/spaces/what-is-a-space/) to learn how to create them.
- A [GitHub or GitLab account linked](/platform/account/connect-version-control/) to Code Capsules.
- A Git repository for your Next.js app. If you're starting from the Code Capsules example, fork [codecapsules-io/demo-nextjs](https://github.com/codecapsules-io/demo-nextjs).

## Create the Capsule

Navigate to the Space you created, then click the yellow `+` icon on the bottom left of the screen and click **New Capsule**. Follow the steps below:

1. Under **Choose a Capsule**, select **Backend**. Select your **Team** and your **Space**, then click **Next**.

2. On **Configure Plan**, select a plan and click **Next**. The **Basic** plan is enough for this guide. You can [change the plan later](/products/backend-capsule/scale/).

3. On **Connect a Git Repository**:
   1. Select your Next.js repository from the **Git Repository** list. Type `nextjs` to search. If the repository isn't listed, click **Configure Git for Code Capsules** and give Code Capsules access to it. If you forked the repository after opening this page, reload the page so it appears.
   2. The **Branch** is filled in with your repository's default branch. Leave **Repo subpath** empty and click **Next**.

   :::note
   Code Capsules shows "Repo will be automatically shared with your team", so everyone on the Team can use that repo for their own capsules. To change this, see [Share a Repo with a Team](/platform/teams/share-a-repo-with-a-team/).
   :::

4. On **Build & Deploy**, leave **Run Command** blank. Code Capsules detects how to start a Next.js app from your repository. Leave **Capsule Name** as it is, or change it. You can rename it later from the **Details** tab.

5. Click **Create Capsule**.

Code Capsules automatically builds your application. While the build runs, the **Details** tab shows **Building** under **Capsule Status**.

To follow the build, click the **Deploy** tab. The **Builds** section lists the latest build with its status (for example **Succeeded**) and how long it took. Click **View Logs** to open the build log on the **Builds** tab.

Once the build shows **Succeeded**, go to the **Details** tab and click the link under **Public URL**, and you should see your deployed application.

If you'd like to deploy another application in a different language or framework, take a look at our other [deployment guides](/frontend/).
