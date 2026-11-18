---
slug: "/database/mysql/flask-+-mysql"
title: "Deploy Flask with MySQL"
description: "Deploy a Flask app with a MySQL database on Code Capsules from GitHub. Connect Flask to a managed MySQL Data Capsule, step by step."
---

# Flask + MySQL

Deploy a Flask MySQL application and learn how to host backend code on Code Capsules.

## Setup

Code Capsules connects to GitHub repositories to deploy applications. To follow this guide, you'll need a [Code Capsules](https://www.codecapsules.io/) account and a [GitHub](https://github.com/) account.

To demonstrate how to deploy a Flask MySQL application with Code Capsules, we've provided an example application, which you can find on the [Code Capsules GitHub repository](https://github.com/codecapsules-io/demo-flask-mysql).

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

## Edit `DATABASE_URL` Environment Variable

Once the binding is complete, you have to append `+pymysql` after `mysql` in the `DATABASE_URL` value under the **Capsule parameters** section on the **Configure** tab.

![Edit DATABASE\_URL Environment Variable](/gitbook-assets/get-started/psql-mysql-url.png)

Confirm your changes by clicking on **Update Capsule** then restart your capsule by toggling the radio button in the top right off and on again.

## View Application

After restarting the capsule, the application will now be ready to be viewed. Open the **Details** tab and click the link under **Public URL**, and you should see your deployed application.

![Deployed App](/gitbook-assets/get-started/flask-mysql-app.png)

If you’d like to deploy another application in a different language or framework, take a look at our other [deployment guides](/database/).
