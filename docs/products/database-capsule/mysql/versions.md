---
slug: '/products/database-capsule/mysql/versions'
description: 'Supported MySQL versions on Code Capsules and how to upgrade between major versions.'
---

# Versions

Code Capsules MySQL Capsules run one of two supported major versions. This guide covers which versions are available, how to check your current version, and how to plan a major version upgrade.

:::info

This section is about **MySQL server version upgrades**. For application schema changes, see [Schema Migrations](/products/database-capsule/mysql/schema-migrations/).

:::

## Supported Versions

| Version | Status    |
| ------- | --------- |
| **5.7** | Supported |
| **8.0** | Supported |

New MySQL Capsules are provisioned on the latest supported version unless you choose otherwise during setup.

Patch releases within a major version (for example, `8.0.34` to `8.0.36`) are applied automatically and do not require any action on your part.

## Check Your Version

Connect to your MySQL Capsule and run:

```sql
SELECT VERSION();
```

If you connect from your local machine, use the [CLI proxy](/cli/readme/commands/proxy/) to open a secure tunnel to your Capsule first.

## Upgrade Paths

Major version upgrades must follow a single step at a time. You cannot downgrade.

| From | To  | Allowed                           | Guide                                                                        |
| ---- | --- | --------------------------------- | ---------------------------------------------------------------------------- |
| 5.7  | 8.0 | Yes                               | [5.7 to 8.0](/products/database-capsule/mysql/versions/upgrades/5-7-to-8-0/) |
| 8.0  | 5.7 | No — downgrades are not supported | —                                                                            |

## Before Any Major Upgrade

1. **Take a backup.** Create a [manual backup](/products/database-capsule/mysql/backups/) before changing the MySQL version. Major upgrades modify your data directory and are difficult to reverse.
2. **Plan for brief disruption.** Code Capsules rolls out the new version instance by instance. Your applications may experience short connection interruptions during the rollout.
3. **Follow the upgrade guide for your target version.** See [5.7 to 8.0](/products/database-capsule/mysql/versions/upgrades/5-7-to-8-0/).

## Change the MySQL Version

After prerequisites are met (if applicable):

1. Open your MySQL Capsule dashboard.
2. Go to the **Config** tab.
3. In the **MySQL Configuration** section, select the target version and save.

Code Capsules validates the upgrade path and runs compatibility checks before applying a new major version. The Capsule status reflects progress while the upgrade completes. Wait until the Capsule reports as ready and the new version is fully applied before running further changes.

Patch-level updates within the same major version do not trigger these checks and are applied transparently.

## After Upgrading

- Verify application connectivity against the new version.
- Re-run `SELECT VERSION();` to confirm the expected version is active.
- Review application logs for authentication or SQL compatibility errors.
