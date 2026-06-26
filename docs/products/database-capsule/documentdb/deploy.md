---
slug: '/products/database-capsule/documentdb/deploy'
description: 'Deploy a DocumentDB Database Capsule on Code Capsules.'
---

# Deploy

DocumentDB is a self-hosted NoSQL document database [compatible with the MongoDB API](https://documentdb.io/). When you create a capsule in the dashboard, it is presented as **MongoDB Compatible**.

For new MongoDB-compatible workloads, use a [MongoDB Capsule](/products/database-capsule/mongodb/deploy/) instead. MongoDB Capsules are managed on MongoDB Atlas and receive more active platform support. DocumentDB Capsules remain available for existing workloads that require a self-hosted database inside your Space.

## Create a DocumentDB Capsule

1. Click **New Capsule** and select **MongoDB Compatible**, your Team, and Space.
2. On **Plan & Deploy**, choose a **Plan** and configure **CPU**, **RAM**, **Storage**, and **Replicas** as needed.
3. Enter a **Capsule Name** and click **Create Capsule**.

![New Capsule MongoDB Compatible Plan & Deploy step](/gitbook-assets/products/database-capsule/deploy/documentdb-deploy-plan.png)

Capsule creation can take several minutes. See [Configure](/products/database-capsule/documentdb/configure/) for connection details and binding instructions.

## Framework Guides

- [Django + MongoDB](/database/mongodb/django-+-mongodb/)
- [Express + MongoDB](/database/mongodb/express-+-mongodb/)
- [Flask + MongoDB](/database/mongodb/flask-+-mongodb/)

Use the MongoDB guides above and adapt the connection details from your DocumentDB Capsule.
