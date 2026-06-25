---
slug: '/products/database-capsule/mongodb/versions'
description: 'Supported MongoDB versions on Code Capsules and how to upgrade between major versions.'
---

# MongoDB Versions

Code Capsules MongoDB Capsules run on MongoDB Atlas. Supported versions depend on whether you use a **Dedicated** or **Shared** cluster.

## Supported Versions

### Dedicated clusters

| Version   | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| **7.0**   | MongoDB 7.0                                                                 |
| **8.0**   | MongoDB 8.0                                                                 |
| **latest** | Automatically upgraded to the newest supported version when one is released |

### Shared clusters

| Version | Description   |
| ------- | ------------- |
| **8.0** | MongoDB 8.0   |

Shared cluster versions cannot be changed from the dashboard. Upgrade to a Dedicated cluster from the **Scale** tab if you need version management.

## Check Your Version

The current MongoDB server version is shown in the **Config** tab under **MongoDB Configuration**, and on the **Plan & Deploy** screen when creating a capsule.

You can also verify the version by connecting to your database and running:

```js
db.version()
```

## Upgrade Paths

Major version upgrades must move forward one version at a time. You cannot downgrade.

| From     | To       | Allowed |
| -------- | -------- | ------- |
| 7.0      | 8.0      | Yes     |
| 8.0      | latest   | Yes     |
| latest   | —        | Auto-upgraded when new versions are released |
| Any      | Earlier  | No — downgrades are not supported |

## Change the MongoDB Version

For Dedicated clusters:

1. Open your MongoDB Capsule dashboard.
2. Go to the **Config** tab.
3. In **MongoDB Configuration**, click **Edit**.
4. Select the target version and click **Save**.
5. Confirm the upgrade when prompted.

The capsule status shows **Updating** while the version change is applied. Wait until the capsule reports as **Running** before making further changes.

:::info

Take a [backup](/products/database-capsule/mongodb/backups/) before a major version upgrade.

:::
