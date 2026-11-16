---
slug: "/backend/java"
description: "Deploy a Java application to Code Capsules from a GitHub repo. Build and run your Java backend in production with managed hosting, step by step."
title: "How to Deploy a Java Application"
sidebar_label: "Java"
---

# Deploy Your Java Application in Minutes

Deploy a Java application and learn how to host backend code on Code Capsules.

## Set Up

Code Capsules connects to GitHub repositories to deploy applications. To follow this guide, you'll need a [Code Capsules](https://www.codecapsules.io/) account and a [GitHub](https://github.com/) account.

To demonstrate how to deploy a Java application with Code Capsules, we've provided an example application, which you can find on the [Code Capsules GitHub repository](https://github.com/codecapsules-io/demo-java).

Sign in to GitHub, and fork the example application by clicking **Fork** at the top-right of your screen and selecting your GitHub account as the destination.

## Create an Account with Code Capsules

If you don't already have an account, navigate to the [Code Capsules](https://www.codecapsules.io/) site and click the **Sign Up** button in the top right corner of the screen. Enter your details to create an account, or log in to an existing one.

If you've just signed up for an account, you'll be directed to a welcome page on your first login. Click on the **Go To Personal Team** button.

Alternatively, if you're signing in again, click on the **Spaces** tab.

Code Capsules gives every account a Personal Team by default. A Team is an environment for you to manage your Spaces and Capsules. For a better understanding of Teams, Spaces, and Capsules, take a look at [our explanation](/platform/platform/).

## Create a Space for your App

Log in to your Code Capsules account and navigate to the **Spaces** tab. Once there, click the yellow `+` icon on the bottom left of the screen to add a new Space.

Follow the prompts, choosing your Team, selecting a location under **Select Location/Cluster**, and giving your Space a name, then click **Create Space**.


1. Choose a Team — you can use a default **personal** Team if you're the only person working on this project, or a named Team if you're collaborating with others
2. This should remind you of the project, for example, **customer-api** or **notetaking-app**
3. Choose a location under **Select Location/Cluster** close to where most of your users will be

## Create the Capsule

A [Capsule](/platform/capsules/what-is-a-capsule/) provides the server for hosting an application on Code Capsules.

Navigate to the **Space** containing your recently created Data Capsule and click the yellow `+` icon on the bottom left of the screen. Follow the instructions below to create a Backend Capsule:

1. Choose **Backend**. If you started from the dashboard, choose your Team and then your Space (if not already selected). If you started from a Team's page, the Team is already selected; from a Space's page, the Team and Space are. Click **Next**.
2. Choose your payment plan and click **Next**.
3. Select your forked GitHub repository and branch, then click **Next**.
4. In the **Run Command** field, leave it blank. In the **Capsule Name** field, enter a name for your capsule, then click **Create Capsule**.

Code Capsules will automatically build your application when you've finished creating the Capsule. While the build is in progress, the **Capsule Status** on the **Details** tab shows **Building**, and you can follow the build in the **Builds** tab.

Once your application is live, you can view the build log by selecting the **Deploy** tab and clicking the **View Logs** link in the **Builds** section.

## View Application

Restart your capsule by toggling the radio button in the top right off and on again.

Once the build is complete, click the **URL** link in the **Details** tab, and you should see your deployed application.

![Deployed App](/gitbook-assets/get-started/cc-java-app.png)

If you’d like to deploy another application in a different language or framework, take a look at our other [deployment guides](/backend/).
