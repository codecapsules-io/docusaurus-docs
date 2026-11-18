---
slug: "/database/mysql/java-+-mysql"
title: "Deploy Java with MySQL"
description: "Deploy a Java app with a MySQL database on Code Capsules from GitHub. Connect your Java backend to a managed MySQL Data Capsule, step by step."
---

# Java + MySQL

Deploy a Java MySQL application and learn how to host backend code on Code Capsules.

## Setup

Code Capsules connects to GitHub repositories to deploy applications. To follow this guide, you'll need a [Code Capsules](https://www.codecapsules.io/) account and a [GitHub](https://github.com/) account.

To demonstrate how to deploy a Java MySQL application with Code Capsules, we've provided an example application, which you can find on the [Code Capsules GitHub repository](https://github.com/codecapsules-io/demo-java-mysql).

Sign in to GitHub, and fork the example application by clicking **Fork** at the top-right of your screen and selecting your GitHub account as the destination.

## Create the Capsules

A [Capsule](/platform/capsules/what-is-a-capsule/) provides the server for hosting an application on Code Capsules.

Navigate to the Spaces tab and open the Space you'll be using.

Click the yellow **+** button in the bottom left of the screen, select **New Capsule**, and follow the instructions below to create a MySQL Capsule:

1. Choose **MySQL**. The Team and Space are already selected because you started from the Space's page. Click **Next**.
2. Select a **Version** and choose a **Plan** (Basic, Standard, Premium, or Custom).
3. Enter a **Capsule Name** and click **Create Capsule**.

Navigate to the **Space** containing your recently created MySQL Capsule, click the yellow **+** button in the bottom left of the screen, and select **New Capsule**. Follow the instructions below to create a Backend Capsule:

1. Choose **Backend**. The Team and Space are already selected because you started from the Space's page. Click **Next**.
2. Choose your payment plan and click **Next**.
3. Select your forked GitHub repository and branch, then click **Next**.
4. Leave **Run Command** blank, then click **Create Capsule**.

Code Capsules will automatically build your application when you've finished creating the Capsule.

Once your application is live, you can view the build log by selecting the **Deploy** tab and clicking the **View Logs** link in the **Builds** section.

![Build Logs](/gitbook-assets/get-started/backend-capsule-build-logs-1.png)

## Connect the Capsules

After the two capsules have been successfully built, the next step is to connect them. To do this, navigate to the **Config** tab of your Backend Capsule. Scroll down to the **Data Capsule** section and click **View** to view the environment variables from the Data Capsule. Click the `+` next to the `Connection string` variable to create a `DATABASE_URL` environmental variable in your Backend Capsule, which gives access to services and features of your Data Capsule.

![Connect Data Capsule](/gitbook-assets/get-started/sql-bind-env.png)

## View Application

You can now view the application after the two capsules have been connected. To see how it looks, click on the URL in the **Details** tab.

![Deployed App](/gitbook-assets/get-started/java-mysql-app.png)

If you’d like to deploy another application in a different language or framework, take a look at our other [deployment guides](/database/).
