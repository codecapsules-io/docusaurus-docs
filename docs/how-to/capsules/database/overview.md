---
slug: "/how-to/capsules/database/overview"
diataxis: how-to
sidebar_position: 0
description: "Deploy and manage database instances on Code Capsules, including MySQL, PostgreSQL, MongoDB, DocumentDB, and Redis."
title: "Managed Database Hosting"
sidebar_label: "Overview"
---

# Everything About Hosting Your Managed Database

Deploy and manage managed database instances on Code Capsules.

## MySQL

- [Deploy](/how-to/capsules/database/mysql/deploy/) — framework guides and getting started
- [Configure](/how-to/capsules/database/mysql/configure/) — connection details, SQL modes, and version settings
- [Connect Locally](/how-to/capsules/database/mysql/connect-locally/) — connect from your laptop via CLI proxy
- [Versions](/reference/capsules/database/mysql/versions/) — supported versions and upgrade guides
- [Schema Migrations](/how-to/capsules/database/mysql/schema-migrations/) — application schema migrations with db-migrate
- [Scale](/how-to/capsules/database/mysql/scale/) — allocate resources as your workload grows
- [Backups](/how-to/capsules/database/mysql/backups/) — manual and scheduled backups
- [Monitor](/how-to/capsules/database/mysql/monitor/) — view metrics and performance data
- [Logs](/how-to/capsules/database/mysql/logs/) — access system logs
- [Alerting](/how-to/capsules/alerting/) — set up notifications for capsule events

## MongoDB

MongoDB Capsules are managed clusters on MongoDB Atlas. This is the **recommended** option for MongoDB-compatible workloads on Code Capsules.

- [Deploy](/how-to/capsules/database/mongodb/deploy/) — create a capsule and framework guides
- [Configure](/how-to/capsules/database/mongodb/configure/) — connection details and version settings
- [Versions](/reference/capsules/database/mongodb/versions/) — supported versions and upgrade guides
- [Scale](/how-to/capsules/database/mongodb/scale/) — change instance size, storage, replicas, or upgrade Shared to Dedicated
- [Backups](/how-to/capsules/database/mongodb/backups/) — manual and scheduled backups
- [Monitor](/how-to/capsules/database/mongodb/monitor/) — view usage and metrics
- [Alerting](/how-to/capsules/alerting/) — set up notifications for capsule events

## DocumentDB

DocumentDB is a self-hosted, MongoDB API-compatible database. For new projects, use a [MongoDB Capsule](/how-to/capsules/database/mongodb/deploy/) instead.

- [Deploy](/how-to/capsules/database/documentdb/deploy/) — create a capsule and connect applications
- [Configure](/how-to/capsules/database/documentdb/configure/) — connection details and binding to application capsules
- [Connect Locally](/how-to/capsules/database/documentdb/connect-locally/) — connect from your laptop via CLI proxy
- [Scale](/how-to/capsules/database/documentdb/scale/) — allocate resources as your workload grows
- [Backups](/how-to/capsules/database/documentdb/backups/) — manual and scheduled backups
- [Monitor](/how-to/capsules/database/documentdb/monitor/) — view metrics and usage data
- [Logs](/how-to/capsules/database/documentdb/logs/) — access system logs
- [Alerting](/how-to/capsules/alerting/) — set up notifications for capsule events

## PostgreSQL

- [Deploy](/how-to/capsules/database/postgresql/deploy/) — getting started
- [Configure](/how-to/capsules/database/postgresql/configure/) — connection details
- [Connect Locally](/how-to/capsules/database/postgresql/connect-locally/) — connect from your laptop via CLI proxy
- [Scale](/how-to/capsules/database/postgresql/scale/) — allocate resources as your workload grows
- [Backups](/how-to/capsules/database/postgresql/backups/) — manual and scheduled backups
- [Monitor](/how-to/capsules/database/postgresql/monitor/) — view metrics and performance data
- [Logs](/how-to/capsules/database/postgresql/logs/) — access system logs
- [Alerting](/how-to/capsules/alerting/) — set up notifications for capsule events

## Redis

- [Deploy](/how-to/capsules/database/redis/deploy/) — getting started
- [Configure](/how-to/capsules/database/redis/configure/) — connection details
- [Connect Locally](/how-to/capsules/database/redis/connect-locally/) — connect from your laptop via CLI proxy
- [Scale](/how-to/capsules/database/redis/scale/) — allocate resources as your workload grows
- [Monitor](/how-to/capsules/database/redis/monitor/) — view metrics and performance data
- [Logs](/how-to/capsules/database/redis/logs/) — access system logs
- [Alerting](/how-to/capsules/alerting/) — set up notifications for capsule events

## Deployment Guides

- [All Database Deployment Guides](/indexes/database-guides/)
