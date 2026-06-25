---
slug: "/products/database-capsule/mongodb/deploy"
description: "Deploy a MongoDB Capsule on Code Capsules."
---

# Deploy

MongoDB Capsules are managed clusters on MongoDB Atlas. When you create a capsule in the dashboard, it is presented as **MongoDB** and provisioned with your chosen cluster type, version, and capacity.

## Create a MongoDB Capsule

1. Click **New Capsule** and select **MongoDB**, your Team, and Space.
2. On **Plan & Deploy**, choose a **Cluster Type**:
   - **Dedicated** — dedicated CPU and RAM based on the instance size you select.
   - **Shared** — shared CPU and RAM at a lower cost. Can be upgraded to Dedicated later.
3. Select a **Version**. See [Versions](/products/database-capsule/mongodb/versions/) for supported options.
4. Choose a **Plan** and configure **Storage** and **Replicas** for Dedicated clusters.
5. Enter a **Capsule Name** and click **Create Capsule**.

Cluster creation can take several minutes. See the [MongoDB getting started guide](/database/mongodb/) for connection and binding instructions.

## Framework Guides

- [Django + MongoDB](/database/mongodb/django-+-mongodb/)
- [Express + MongoDB](/database/mongodb/express-+-mongodb/)
- [Flask + MongoDB](/database/mongodb/flask-+-mongodb/)
