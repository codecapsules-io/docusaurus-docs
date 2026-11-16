---
slug: "/frontend/react"
description: "Deploy a React application to Code Capsules from a GitHub repo. Host your frontend in production with automatic deploys on every push, step by step."
title: "How to Host a React Application"
sidebar_label: "React"
---

# Host Your React Application in Minutes

Deploy a React application and learn how to host frontend code on Code Capsules.

## Set up

To follow this guide, you'll need:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and a Space. See [Teams](/platform/teams/what-is-a-team/) and [Spaces](/platform/spaces/what-is-a-space/) to learn how to create them.
- A [GitHub or GitLab account linked](/platform/account/connect-version-control/) to Code Capsules.
- A Git repository for your React app. If you're starting from the Code Capsules example, fork [codecapsules-io/demo-react](https://github.com/codecapsules-io/demo-react).

## Create the Capsule

Navigate to the Space you created, then click the yellow `+` icon on the bottom left of the screen and click **New Capsule**. You can also click **Deploy Now** on the **React** card on the **Quick Start** page, which preselects the Frontend Capsule type. Follow the steps below:

1. Under **Choose a Capsule**, select **Frontend**. Select your **Team** and your **Space**, then click **Next**.

2. On **Hosting**, select **Static** and click **Next**. Static serves the files your build produces and is the right choice for a React app.

3. On **Plan**, select **Free** or **Paid** and click **Next**. The **Free** plan costs $0, allows 30MB per build and 50GB of traffic a month. See [Static Frontend Free and Paid Plans](/products/frontend-capsule/static/plans/) for details.

4. On **Connect a Git Repository**:
   1. Select your React repository from the **Git Repository** list. Type `react` to search. If the repository isn't listed, click **Configure Git for Code Capsules** and give Code Capsules access to it. If you created the repository after opening this page, reload the page so it appears.
   2. The **Branch** is filled in with your repository's default branch. Leave **Repo subpath** empty and click **Next**.

   :::note
   Code Capsules shows "Repo will be automatically shared with your team", so everyone on the Team can use that repo for their own capsules. To change this, see [Share a Repo with a Team](/platform/teams/share-a-repo-with-a-team/).
   :::

5. On **Build & Deploy**, enter:
   - **Build Command**: `npm run build`
   - **Path to static content**: `build`

   Leave **Capsule Name** as it is, or change it. You can rename it later from the **Details** tab.

6. Click **Create Capsule**.

Code Capsules automatically builds your application. While the build runs, the **Details** tab shows **Building** under **Capsule Status**.

To follow the build, click the **Deploy** tab. The **Builds** section lists the latest build with its status (for example **Succeeded**) and how long it took. Click **View Logs** to open the build log on the **Builds** tab.

Once the build shows **Succeeded**, go to the **Details** tab and click the link under **Public URL**, and you should see your deployed application.

If you'd like to deploy another application in a different language or framework, take a look at our other [deployment guides](/frontend/).
