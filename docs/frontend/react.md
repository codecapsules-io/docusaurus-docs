---
slug: "/frontend/react"
description: "Deploy a React application to Code Capsules from a GitHub repo. Host your frontend in production with automatic deploys on every push, step by step."
title: "How to Host a React Application"
sidebar_label: "React"
---

# Host Your React Application in Minutes

Deploy a React application and learn how to host frontend code on Code Capsules.

## Setup

Code Capsules connects to GitHub repositories to deploy applications. To follow this guide, you'll need a [Code Capsules](https://www.codecapsules.io/) account and a [GitHub](https://github.com/) account.

To demonstrate how to deploy a React application with Code Capsules, we've provided an example application, which you can find on the [Code Capsules GitHub repository](https://github.com/codecapsules-io/demo-react).

Sign in to GitHub, and fork the example application by clicking **Fork** at the top-right of your screen and selecting your GitHub account as the destination.

## Create an Account with Code Capsules

Log in to your Code Capsules account and navigate to the **Spaces** tab. Once there, click the yellow `+` icon on the bottom left of the screen to add a new Space.

Follow the prompts, choosing your Team, selecting a location under **Select Location/Cluster**, and giving your Space a name, then click **Create Space**.

![Create a New Space](/gitbook-assets/get-started/space-name-1.png)


1. Choose a Team — you can use a default **personal** Team if you're the only person working on this project, or a named Team if you're collaborating with others
2. This should remind you of the project, for example, **customer-api** or **notetaking-app**
3. Choose a location under **Select Location/Cluster** close to where most of your users will be

## Create the Capsule

A [Capsule](/platform/capsules/what-is-a-capsule/) provides the server for hosting an application on Code Capsules.

To create a new Capsule for your Space, follow the instructions below:

1. Choose **Frontend**. If you started from the dashboard, choose your Team and then your Space (if not already selected). If you started from a Team's page, the Team is already selected; from a Space's page, the Team and Space are. Click **Next**.
2. Choose **Static** as your hosting type and click **Next**. Then, choose the **Free** plan and click **Next**.
3. Select your forked GitHub repository and branch, then click **Next**.
4. In the **Build Command** field, enter `npm run build`. In the **Path to static content** field, enter `build`. In the **Capsule Name** field, enter a name for your capsule, then click **Create Capsule**.

Code Capsules will automatically build your application when you've finished creating the Capsule.

Once your application is live, you can view the build log by selecting the **Deploy** tab and clicking the **View Logs** link in the **Builds** section.

![Build Logs](/gitbook-assets/get-started/frontend-build-logs.png)

Once the build is complete, a URL link will appear in the URL section in the **Details** tab. Click the link, and you should see your deployed application.

![Deployed App](/gitbook-assets/get-started/cc-react-app.png)

If you’d like to deploy another application in a different language or framework, take a look at our other [deployment guides](/frontend/).
