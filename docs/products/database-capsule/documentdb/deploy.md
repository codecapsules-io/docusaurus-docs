---
slug: '/products/database-capsule/documentdb/deploy'
description: 'Deploy a DocumentDB Database Capsule on Code Capsules.'
---

# Deploy

:::warning[Recommended alternative]

Code Capsules recommends using a [MongoDB Capsule](/products/database-capsule/mongodb/deploy/) for new projects. MongoDB Capsules are managed on MongoDB Atlas, receive more active platform support, and offer features such as version management, public connection strings, and Dedicated or Shared cluster types.

DocumentDB Capsules remain available for existing workloads that require a self-hosted, MongoDB-compatible database inside your Space.

:::

DocumentDB is a NoSQL document database [compatible with the MongoDB API](https://documentdb.io/). In the Code Capsules dashboard it appears as **MongoDB Compatible**.

## Create a DocumentDB Capsule

1. Click **New Capsule** and select **MongoDB Compatible**, your Team, and Space, then click **Next**.
2. On **Plan & Deploy**:
   - Choose a **Plan** and adjust CPU, RAM, storage, and replicas as needed.
   - Enter a **Capsule Name**.
3. Click **Create Capsule**.

Provisioning can take a few minutes. When the capsule is ready, connection details appear on the **Details** tab — see [Configure](/products/database-capsule/documentdb/configure/).

After creation you are taken to the capsule **Details** tab.

## Connect an application

DocumentDB Capsules are reachable from other capsules in the same Space using the private connection string on the **Details** tab.

To connect a Backend, Docker, or Agent Capsule:

1. Open the application capsule's **Config** tab.
2. In the **Data capsules** section, click **View** next to your DocumentDB Capsule.
3. Click **+** next to **Connection string** to add a `DATABASE_URL` environment variable.

The connection string uses the `mongodb://` format with TLS enabled:

```
mongodb://<username>:<password>@<host>:<port>/<database>?tls=true&tlsAllowInvalidCertificates=true
```

Use the same MongoDB client libraries and connection patterns as you would for MongoDB. For step-by-step framework examples, see the [MongoDB deployment guides](/database/mongodb/) and adapt the connection details from your DocumentDB Capsule.

## Limitations

Compared with [MongoDB Capsules](/products/database-capsule/mongodb/deploy/), DocumentDB Capsules on Code Capsules:

- Do not support public access or custom domains
- Do not expose a public connection string
- Do not have a **Config** tab for version or server settings
- Are not provisioned on MongoDB Atlas

For new MongoDB workloads, use a [MongoDB Capsule](/products/database-capsule/mongodb/deploy/) instead.
