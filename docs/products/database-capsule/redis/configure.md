---
slug: "/products/database-capsule/redis/configure"
description: "Configure a Redis Capsule on Code Capsules: view connection details, connect from your local machine, and rename the capsule from the Details tab."
title: "How to Configure a Redis Database"
sidebar_label: "Configure"
---

# Configure Your Redis Database

Configure a Database Capsule in the **Details** tab of the Capsule dashboard.

## View Connection Details

The **Details** tab provides connection details for a Database Capsule.

![Redis Capsule Details tab Connection Details section](/gitbook-assets/products/database-capsule/details/redis-details.png)

Click **show** in the **Connection Details** section to view database credentials:

- Host
- Port
- Database name
- Username
- Password
- Connection string

## Connect from Your Local Machine

Redis Capsules are not publicly accessible. To connect from your laptop—for example, to inspect keys or run Redis commands—open a secure tunnel with the Code Capsules CLI and connect with `redis-cli`. See [Connect Locally](/products/database-capsule/redis/connect-locally/) for the full workflow, client installation, and examples.

## Edit Capsule Name

To change the name of the Capsule, click **Edit** next to the Capsule name in the **Capsule Details** section.
