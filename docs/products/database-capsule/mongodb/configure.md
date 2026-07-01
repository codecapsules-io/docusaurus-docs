---
slug: '/products/database-capsule/mongodb/configure'
description: 'Configure a MongoDB Capsule in the Details and Config tabs of the Capsule dashboard.'
---

# Configure

Configure a MongoDB Capsule from the **Details** and **Config** tabs of the Capsule dashboard.

## View Connection Details

The **Details** tab provides connection details once the capsule is ready.

Click **show** in the **Connection details** section to view:

![MongoDB Capsule Details tab Connection details section](/gitbook-assets/products/database-capsule/details/mongodb-details.png)

- Database name
- Username
- Password

While the capsule is still being created, an info message explains that connection details will appear when provisioning completes.

## Public Connection String

MongoDB Capsules provide a **Public Connection String** on the **Details** tab. This string is available once the capsule has been created and is the URI your applications should use to connect.

Click **show** next to **Public Connection String** to reveal the value, then use the copy icon to copy it to your clipboard.

![MongoDB Capsule Details tab Public Connection String](/gitbook-assets/products/database-capsule/details/mongodb-details-public-access.png)

The string uses the `mongodb+srv://` format and includes embedded credentials.

## Edit Capsule Name

To change the name of the Capsule, click **Edit** next to the Capsule name in the **Capsule Details** section on the **Details** tab.

## Configure MongoDB Version

:::info

Version configuration is only available for **Dedicated** MongoDB Capsules. Shared clusters cannot change their MongoDB version from the dashboard.

:::

Additional MongoDB configuration is available in the **Config** tab.

In the **MongoDB Configuration** section, click **Edit** to change the MongoDB server version on Dedicated clusters.

![MongoDB Capsule Config tab MongoDB Configuration version selector](/gitbook-assets/products/database-capsule/config/mongodb-config.png)

You can upgrade to a newer supported version; downgrades are not supported.

If your capsule uses the **latest** version option, MongoDB is automatically upgraded to the newest available version when it is released.

See [Versions](/products/database-capsule/mongodb/versions/) for supported versions and upgrade paths.
