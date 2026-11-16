---
slug: "/frontend/angular"
description: >-
  Deploy an Angular application on Code Capsules with auto-deployments from a
  specified branch on your GitHub repository.
title: "How to Host an Angular Application"
sidebar_label: "Angular"
---

# Host Your Angular Application in Minutes

Deploy an Angular application and learn how to host frontend code on Code Capsules. At the end of the guide, you would have deployed the application in the screenshot below and can adapt it to meet your unique needs.

![Deployed App](/gitbook-assets/get-started/cc-angular-app.png)

## Setup

Code Capsules connects to GitHub repositories to deploy applications. To follow this guide, you’ll need a [Code Capsules](https://www.codecapsules.io/) account and a [GitHub](https://github.com/) account.

To demonstrate how to deploy an Angular application with Code Capsules, we’ve provided an example application, which you can find on the [Code Capsules GitHub repository](https://github.com/BrentonJScott/demo-angular-22).

Sign in to GitHub, and fork the example application by clicking **Fork** at the top-right of your screen and selecting your GitHub account as the destination.

## Create an Account with Code Capsules

If you don’t already have an account, navigate to the [Code Capsules](https://www.codecapsules.io/) site and click the **Sign Up** button in the top right corner of the screen. Enter your details to create an account, or log in to an existing one.

If you’ve just signed up for an account, you’ll be directed to a welcome page on your first login. Click on the **Go To Personal Team** button.

Alternatively, if you’re signing in again, click on the **Spaces** tab.

For a better understanding of Teams, Spaces, and Capsules, take a look at [our explanation](/platform/platform/).

## Create a Space for Your App

Log in to your Code Capsules account and navigate to the **Spaces** tab. Once there, click the yellow `+` icon on the bottom left of the screen to add a new Space.

Follow the prompts, choosing your region and giving your Space a name, then click **Create Space**.

![Create a New Space](/gitbook-assets/get-started/space-name-1.png)


1. Choose a Team — you can use a default “personal” Team if you’re the only person working on this project, or a named Team if you’re collaborating with others
2. This should remind you of the project, for example, “customer-api” or “notetaking-app”
3. Choose a country close to where most of your users will be

## Create the Capsule

A [Capsule](/platform/capsules/what-is-a-capsule/) provides the server for hosting an application on Code Capsules.

Navigate to the Space you just created, then click the yellow `+` icon on the bottom left of the screen and click **New Capsule**. You can also click **Deploy Now** on the **Angular** card on the **Quick Start** page, which preselects the Frontend Capsule type. Follow the steps below to create a Frontend Capsule:

1. Under **Choose a Capsule**, select **Frontend**. Select your **Team** and your **Space**, then click **Next**.
2. On **Hosting**, select **Static** and click **Next**. Static serves the files your build produces and is the right choice for an Angular app that doesn't need server-side rendering.
3. On **Plan**, select **Free** or **Paid** and click **Next**. The **Free** plan costs $0, allows 30MB per build and 50GB of traffic a month, and is enough for this guide. See [Static Frontend Free and Paid Plans](/products/frontend-capsule/static/plans/) for the details.
4. On **Connect a Git Repository**, select the repository you forked from the **Git Repository** list. Type `angular` to search. If the repository isn't listed, click **Configure Git for Code Capsules** and give Code Capsules access to it. If you forked the repository after opening this page, reload the page so it appears.
5. The **Branch** is filled in with your repository's default branch, `main`. Leave **Repo subpath** empty and click **Next**. Code Capsules shows "Repo will be automatically shared with your team", so everyone on the Team can use that repo for their own capsules.
6. On **Build & Deploy**, enter:
   - **Build Command**: `npm run build`
   - **Path to static content**: `dist/cc-demo-angular/browser`

   Leave **Capsule Name** as it is, or change it. You can rename the capsule later from the **Details** tab.
7. Click **Create Capsule**.

Code Capsules automatically builds your application when you've finished creating the Capsule. The **Details** tab opens and shows **Building** under **Capsule Status**.

To follow the build, click the **Deploy** tab. The **Builds** section lists the latest build with its status, for example **Succeeded** and how long it took. Click **View Logs** to open the build log on the **Builds** tab. This build takes under a minute.

![Build Logs](/gitbook-assets/get-started/angular-build-logs.png)

Once the build shows **Succeeded**, go to the **Details** tab and click the link under **Public URL**, and you should see your deployed application.

![Deployed App](/gitbook-assets/get-started/cc-angular-app.png)

If you’d like to deploy another application in a different language or framework, take a look at our other [deployment guides](/frontend/).

:::tip[Video Guides]
If you prefer watching videos to reading text, check out our [Video Guides](/tutorials/video-guides/).
:::
