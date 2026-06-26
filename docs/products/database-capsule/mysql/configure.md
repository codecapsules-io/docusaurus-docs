---
slug: '/products/database-capsule/mysql/configure'
description: 'Configure a MySQL Database Capsule in the Details tab of the Capsule dashboard.'
---

# Configure

Configure a Database Capsule in the **Details** tab of the Capsule dashboard.

## View Connection Details

The **Details** tab provides connection details for a Database Capsule.

![MySQL Capsule Details tab Connection Details section](/gitbook-assets/products/database-capsule/details/mysql-details.png)

Click **show** in the **Connection Details** section to view database credentials:

- Host
- Port
- Database name
- Username
- Password
- Connection string

## Edit Capsule Name

To change the name of the Capsule, click **Edit** next to the Capsule name in the **Capsule Details** section.

## Configure MySQL Settings

:::info

These settings are only available for **MySQL** Capsules.

:::

Additional MySQL configuration is available in the **Config** tab of MySQL Capsules.

![MySQL Capsule Config tab MySQL Configuration section](/gitbook-assets/products/database-capsule/config/mysql-config-edit.png)

### Set SQL Modes

In the **MySQL Configuration** section, click **Edit** to select SQL modes for your MySQL server.

SQL modes determine how MySQL handles queries and data validation. Common options include:

- `STRICT_TRANS_TABLES` - Enables strict mode for transactional tables
- `NO_ZERO_DATE` - Prevents the use of invalid date values
- `ONLY_FULL_GROUP_BY` - Requires `GROUP BY` to list all selected columns

### Set MySQL Version

In the **MySQL Configuration** section, you can select the MySQL server version for your Capsule.

Supported major versions are **5.7** and **8.0**. Major version upgrades must be done one step at a time (for example, 5.7 to 8.0).

See [MySQL Versions](/products/database-capsule/mysql/versions/) for supported versions and upgrade paths.
