---
slug: "/frontend/static-html"
description: "Deploy a static HTML website on Code Capsules and learn how to host frontend code. A simple step-by-step guide to serving static sites in production."
title: "How to Host a Static HTML Website"
sidebar_label: "Static HTML"
---

# Host Your Static HTML Website in Minutes

Deploy a static HTML site and learn how to host frontend code on Code Capsules. At the end of this guide you'll have the application below deployed and ready to customise.

![Deployed App](/gitbook-assets/get-started/cc-html-site.png)

## Built with AI

The demo site above was generated using an AI coding agent. If you're building with agents yourself, here's the prompt that produced it:

```
Create a single-page static HTML site for CodeCapsules (a cloud hosting platform).
Use only index.html and style.css — no build tools, no JavaScript frameworks.

Design requirements:
- Dark theme with #0f0f0f background and #f5c800 yellow accent colour
- Navigation bar with logo and "Get Started" CTA button
- Hero section with a headline, subheading, two CTA buttons, and a terminal window graphic
  showing a git push → build succeeded → deployed sequence
- Features section with three cards: Frontend Capsules, Backend Capsules, Data Capsules
- CTA section prompting the user to deploy their own copy
- Footer with a "Built with plain HTML & CSS · Hosted on CodeCapsules" note
- Fully responsive (single column on mobile)

Keep the markup semantic and the CSS clean with custom properties.
```

## Set up

To follow this guide, you'll need:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and a Space. See [Teams](/platform/teams/what-is-a-team/) and [Spaces](/platform/spaces/what-is-a-space/) to learn how to create them.
- A [GitHub or GitLab account linked](/platform/account/connect-version-control/) to Code Capsules.
- A Git repository containing your `index.html` and `style.css` at the root. If you're starting from the Code Capsules example, fork [codecapsules-io/demo-html](https://github.com/codecapsules-io/demo-html).

## Create the Capsule

Navigate to the Space you created, then click the yellow `+` icon on the bottom left of the screen and click **New Capsule**. Follow the steps below:

1. Under **Choose a Capsule**, select **Frontend**. Select your **Team** and your **Space**, then click **Next**.

2. On **Hosting**, select **Static** and click **Next**. Static serves your files directly, with no build step needed.

3. On **Plan**, select **Free** or **Paid** and click **Next**. The **Free** plan costs $0, allows 30MB per build and 50GB of traffic a month. See [Static Frontend Free and Paid Plans](/products/frontend-capsule/static/plans/) for details.

4. On **Connect a Git Repository**:
   1. Select your HTML repository from the **Git Repository** list. Type `html` to search. If the repository isn't listed, click **Configure Git for Code Capsules** and give Code Capsules access to it. If you forked the repository after opening this page, reload the page so it appears.
   2. The **Branch** is filled in with your repository's default branch. Leave **Repo subpath** empty and click **Next**.

   :::note
   Code Capsules shows "Repo will be automatically shared with your team", so everyone on the Team can use that repo for their own capsules. To change this, see [Share a Repo with a Team](/platform/teams/share-a-repo-with-a-team/).
   :::

5. On **Build & Deploy**, leave **Build Command** and **Path to static content** blank. Code Capsules serves the files from the root of your repository. Leave **Capsule Name** as it is, or change it. You can rename it later from the **Details** tab.

6. Click **Create Capsule**.

Code Capsules automatically builds your site. While the build runs, the **Details** tab shows **Building** under **Capsule Status**.

To follow the build, click the **Deploy** tab. The **Builds** section lists the latest build with its status (for example **Succeeded**) and how long it took. Click **View Logs** to open the build log on the **Builds** tab.

Once the build shows **Succeeded**, go to the **Details** tab and click the link under **Public URL**, and you should see your deployed site.

If you'd like to deploy another application in a different language or framework, take a look at our other [deployment guides](/frontend/).
