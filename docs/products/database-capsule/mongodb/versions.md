---
slug: '/products/database-capsule/mongodb/versions'
description: 'Supported MongoDB versions on Code Capsules and how to upgrade between major versions.'
---

# Versions

Code Capsules MongoDB Capsules run on MongoDB Atlas. Supported versions depend on whether you use a **Dedicated** or **Shared** cluster. This guide covers which versions are available, how to check your current version, and how to plan a major version upgrade.

## Supported Versions

### Dedicated clusters

| Version    | Status                                                            |
| ---------- | ----------------------------------------------------------------- |
| **7.0**    | Supported                                                         |
| **8.0**    | Supported                                                         |
| **latest** | Supported — automatically upgraded when new versions are released |

New Dedicated MongoDB Capsules are provisioned on the latest supported version unless you choose otherwise during setup.

### Shared clusters

| Version | Status    |
| ------- | --------- |
| **8.0** | Supported |

Shared cluster versions cannot be changed from the dashboard. Upgrade to a Dedicated cluster from the [Scale](/products/database-capsule/mongodb/scale/) tab if you need version management.

Patch releases within a major version are applied by MongoDB Atlas and do not require any action on your part.

## Check Your Version

The current MongoDB server version is shown in the **Config** tab under **MongoDB Configuration**.

You can also verify the version by connecting to your database and running:

```js
db.version();
```

If you connect from your local machine, use the [CLI proxy](/cli/readme/commands/proxy/) to open a secure tunnel to your Capsule first.

## Upgrade Paths

Major version upgrades must follow a single step at a time. You cannot downgrade. Upgrades are only available for **Dedicated** clusters.

| From   | To      | Allowed                                      | Guide                                                                          |
| ------ | ------- | -------------------------------------------- | ------------------------------------------------------------------------------ |
| 7.0    | 8.0     | Yes                                          | [7.0 to 8.0](/products/database-capsule/mongodb/versions/upgrades/7-0-to-8-0/) |
| 8.0    | latest  | Yes                                          | —                                                                              |
| latest | —       | Auto-upgraded when new versions are released | —                                                                              |
| Any    | Earlier | No — downgrades are not supported            | —                                                                              |

## Before Any Major Upgrade

1. **Take a backup.** Create a [manual backup](/products/database-capsule/mongodb/backups/) before changing the MongoDB version. Major upgrades are difficult to reverse.
2. **Plan for brief disruption.** Code Capsules applies the new version on MongoDB Atlas while your capsule status shows **Updating**. Your applications may experience short connection interruptions during the rollout.
3. **Follow the upgrade guide for your target version.** See [7.0 to 8.0](/products/database-capsule/mongodb/versions/upgrades/7-0-to-8-0/) when upgrading from MongoDB 7.0.

## Change the MongoDB Version

After prerequisites are met (if applicable):

1. Open your MongoDB Capsule dashboard.
2. Go to the **Config** tab.
3. In the **MongoDB Configuration** section, click **Edit**, select the target version, and save.
4. Confirm the upgrade when prompted.

Code Capsules validates the upgrade path before applying a new major version. Wait until the capsule reports as **Running** and the new version is fully applied before making further changes.

Selecting **latest** enables automatic upgrades to the newest supported version when one is released.

## After Upgrading

- Verify application connectivity against the new version.
- Re-run `db.version()` to confirm the expected version is active.
- Review application logs for driver compatibility or query errors.
