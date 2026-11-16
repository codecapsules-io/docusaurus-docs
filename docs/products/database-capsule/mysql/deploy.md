---
slug: "/products/database-capsule/mysql/deploy"
description: "Deploy a managed MySQL database on Code Capsules with a MySQL Capsule, then connect it to your backend app using a framework guide."
title: "How to Deploy a MySQL Database"
sidebar_label: "Deploy"
---

# Deploy Your MySQL Database

MySQL Capsules provide a managed MySQL database for your applications on Code Capsules. When you create a capsule in the dashboard, it is presented as **MySQL**.

## Create a MySQL Capsule

1. Click **New Capsule** and select **MySQL**. If you started from a Team's page, the Team is already selected; from a Space's page, the Team and Space are. Otherwise, choose your Team and then **Choose a Space**.
2. On **Plan & Deploy**, select a **Version**. See [Versions](/products/database-capsule/mysql/versions/) for supported options.
3. Choose a **Plan** (Basic, Standard, Premium, or Custom) to set your **CPU**, **RAM**, **Storage**, and **Replicas**.
4. Enter a **Capsule Name** and click **Create Capsule** to finish.

![MySQL Capsule Plan & Deploy step with Version selector and Plan options](/gitbook-assets/products/database-capsule/deploy/mysql-deploy-plan.png)

Capsule creation can take several minutes. See the [MySQL getting started guide](/database/mysql/) for connection and binding instructions.

## Framework Guides

- [Django + MySQL](/database/mysql/django-+-mysql/)
- [Flask + MySQL](/database/mysql/flask-+-mysql/)
- [Java + MySQL](/database/mysql/java-+-mysql/)
