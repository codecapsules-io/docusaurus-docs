---
slug: "/products/database-capsule/configure"
---

# Configure

Configure a Database Capsule in the **Details** tab of the Capsule dashboard.

## View Connection Details

The **Details** tab provides connection details for a Database Capsule.

![Database Connection Details](/gitbook-assets/products/database-capsule/config/mysql-details.png)

Click **show** in the **Connection Details** section to view database credentials:

- Host
- Port
- Database name
- Username
- Password
- Connection string

## Edit Capsule Name

To change the name of the Capsule, click **Edit** next to the Capsule name in the **Capsule Details** section.

## Enable Public Access


:::info

The **Public Access** feature is currently available for **MongoDB** Capsules.

:::


Toggle on **Public Access** to allow access to the database from outside your Space.

When **Public Access** is toggled on, Code Capsules generates a public connection string that you can use to connect to the database.

![MongoDB Public Access](/gitbook-assets/products/database-capsule/config/mongo-details.png)

## Configure MySQL Settings


:::info

These settings are only available for **MySQL** Capsules.

:::


Additional MySQL configuration is available in the **Config** tab of MySQL Capsules.

![MySQL Configuration](/gitbook-assets/products/database-capsule/config/mysql-config.png)

### Set SQL Modes

In the **MySQL Configuration** section, click **Edit** to select SQL modes for your MySQL server.

SQL modes determine how MySQL handles queries and data validation. Common options include:

- `STRICT_TRANS_TABLES` - Enables strict mode for transactional tables
- `NO_ZERO_DATE` - Prevents the use of invalid date values
- `ONLY_FULL_GROUP_BY` - Requires `GROUP BY` to list all selected columns
