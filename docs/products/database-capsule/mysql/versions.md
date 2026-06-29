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

If you connect from your local machine, see [Connect Locally](/products/database-capsule/mysql/connect-locally/) to open a secure tunnel and connect with the `mysql` client.

## Upgrade Paths

Major version upgrades must follow a single step at a time. You cannot downgrade.

| From | To  | Allowed                           | Guide                                                                        |
| ---- | --- | --------------------------------- | ---------------------------------------------------------------------------- |
| 5.7  | 8.0 | Yes                               | [5.7 to 8.0](/products/database-capsule/mysql/versions/upgrades/5-7-to-8-0/) |
| 8.0  | 5.7 | No — downgrades are not supported | —                                                                            |

## Upgrade Guides

- [5.7 to 8.0](/products/database-capsule/mysql/versions/upgrades/5-7-to-8-0/)

See [MySQL Versions](/products/database-capsule/mysql/versions/) for supported versions and general upgrade requirements.
