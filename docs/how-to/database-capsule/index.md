---
slug: "/how-to/database-capsule"
diataxis: how-to
description: "Deploy and manage database instances on Code Capsules, including MySQL, PostgreSQL, MongoDB, DocumentDB, and Redis."
title: "Managed Database Hosting"
sidebar_label: "Database Capsule"
---

# Everything About Hosting Your Managed Database

Deploy and manage managed database instances on Code Capsules.

## MySQL

- [Deploy](/how-to/database-capsule/mysql/deploy/) — framework guides and getting started
- [Configure](/how-to/database-capsule/mysql/configure/) — connection details, SQL modes, and version settings
- [Connect Locally](/how-to/database-capsule/mysql/connect-locally/) — connect from your laptop via CLI proxy
- [Versions](/reference/database-capsule/mysql/versions/) — supported versions and upgrade guides
- [Schema Migrations](/how-to/database-capsule/mysql/schema-migrations/) — application schema migrations with db-migrate
- [Scale](/how-to/database-capsule/mysql/scale/) — allocate resources as your workload grows
- [Backups](/how-to/database-capsule/mysql/backups/) — manual and scheduled backups
- [Monitor](/how-to/database-capsule/mysql/monitor/) — view metrics and performance data
- [Logs](/how-to/database-capsule/mysql/logs/) — access system logs
- [Alerting](/how-to/alerting/) — set up notifications for capsule events

## MongoDB

MongoDB Capsules are managed clusters on MongoDB Atlas. This is the **recommended** option for MongoDB-compatible workloads on Code Capsules.

- [Deploy](/how-to/database-capsule/mongodb/deploy/) — create a capsule and framework guides
- [Configure](/how-to/database-capsule/mongodb/configure/) — connection details and version settings
- [Versions](/reference/database-capsule/mongodb/versions/) — supported versions and upgrade guides
- [Scale](/how-to/database-capsule/mongodb/scale/) — change instance size, storage, replicas, or upgrade Shared to Dedicated
- [Backups](/how-to/database-capsule/mongodb/backups/) — manual and scheduled backups
- [Monitor](/how-to/database-capsule/mongodb/monitor/) — view usage and metrics
- [Alerting](/how-to/alerting/) — set up notifications for capsule events

## DocumentDB

DocumentDB is a self-hosted, MongoDB API-compatible database. For new projects, use a [MongoDB Capsule](/how-to/database-capsule/mongodb/deploy/) instead.

- [Deploy](/how-to/database-capsule/documentdb/deploy/) — create a capsule and connect applications
- [Configure](/how-to/database-capsule/documentdb/configure/) — connection details and binding to application capsules
- [Connect Locally](/how-to/database-capsule/documentdb/connect-locally/) — connect from your laptop via CLI proxy
- [Scale](/how-to/database-capsule/documentdb/scale/) — allocate resources as your workload grows
- [Backups](/how-to/database-capsule/documentdb/backups/) — manual and scheduled backups
- [Monitor](/how-to/database-capsule/documentdb/monitor/) — view metrics and usage data
- [Logs](/how-to/database-capsule/documentdb/logs/) — access system logs
- [Alerting](/how-to/alerting/) — set up notifications for capsule events

## PostgreSQL

- [Deploy](/how-to/database-capsule/postgresql/deploy/) — getting started
- [Configure](/how-to/database-capsule/postgresql/configure/) — connection details
- [Connect Locally](/how-to/database-capsule/postgresql/connect-locally/) — connect from your laptop via CLI proxy
- [Scale](/how-to/database-capsule/postgresql/scale/) — allocate resources as your workload grows
- [Backups](/how-to/database-capsule/postgresql/backups/) — manual and scheduled backups
- [Monitor](/how-to/database-capsule/postgresql/monitor/) — view metrics and performance data
- [Logs](/how-to/database-capsule/postgresql/logs/) — access system logs
- [Alerting](/how-to/alerting/) — set up notifications for capsule events

## Redis

- [Deploy](/how-to/database-capsule/redis/deploy/) — getting started
- [Configure](/how-to/database-capsule/redis/configure/) — connection details
- [Connect Locally](/how-to/database-capsule/redis/connect-locally/) — connect from your laptop via CLI proxy
- [Scale](/how-to/database-capsule/redis/scale/) — allocate resources as your workload grows
- [Monitor](/how-to/database-capsule/redis/monitor/) — view metrics and performance data
- [Logs](/how-to/database-capsule/redis/logs/) — access system logs
- [Alerting](/how-to/alerting/) — set up notifications for capsule events

## Deployment Guides

- [All Database Deployment Guides](/how-to/database/)
