---
slug: '/products/database-capsule/postgresql/connect-locally'
description: 'Connect to a PostgreSQL Database Capsule from your local machine using the Code Capsules CLI proxy and psql.'
---

# Connect Locally

PostgreSQL Capsules are private to your Space. To run queries, restore backups, or inspect data from your laptop, open a secure tunnel with the [Code Capsules CLI](/cli/) and connect with `psql` or other PostgreSQL client tools.

## When to Use This

Use a local connection when you need to:

- Run ad-hoc SQL or inspect tables
- Restore a backup with `pg_restore`
- Export data with `pg_dump`
- Debug application issues against the live database

## Prerequisites

1. Install and log in to the [Code Capsules CLI](/cli/readme/getting-started/installation-and-usage/) (`codecaps login`).
2. Install PostgreSQL client tools on your machine (see [Install PostgreSQL client tools](#install-postgresql-client-tools) below).

## Open a Proxy Tunnel

1. Open your PostgreSQL Capsule **Details** tab and copy the pre-built proxy command.
2. Run the command in a terminal. For example:

```bash
codecaps proxy capsule -s <space-slug> -c <capsule-id> -P 5432
```

3. Leave this terminal open. The tunnel stays active until you stop the process.

See the [proxy command reference](/cli/readme/commands/proxy/) for full options.

## Get Credentials

On the capsule **Details** tab, click **show** in the **Connection Details** section to reveal your credentials.

:::tip

Copy the connection string from the **Details** tab, not the CLI copy prompt. Replace the remote host and port with `127.0.0.1` and your proxy port.

```text
# Remote (from Details tab)
postgresql://myuser:mypass@db-host.internal:5432/mydb

# Local (after proxy on port 5432)
postgresql://myuser:mypass@127.0.0.1:5432/mydb
```

If your password contains special characters (`@`, `#`, `/`, and so on), URL-encode them in connection strings.

:::

## Install PostgreSQL Client Tools

`psql`, `pg_dump`, and `pg_restore` are distributed under the [PostgreSQL License](https://www.postgresql.org/about/licence/), a permissive open-source license.

| Platform | Install |
| -------- | ------- |
| macOS | `brew install libpq` (add `$(brew --prefix libpq)/bin` to your `PATH`) |
| Ubuntu / Debian | `sudo apt install postgresql-client` |
| Windows | [PostgreSQL Downloads](https://www.postgresql.org/download/windows/) |

Official installation guides: [PostgreSQL Downloads](https://www.postgresql.org/download/)

## Connect

With the proxy running, connect using a connection string adapted for localhost:

```bash
psql "postgresql://<username>:<password>@127.0.0.1:5432/<database>"
```

Replace `5432` with the port you passed to `-P` when starting the proxy.

You can also pass connection parameters individually:

```bash
psql -h 127.0.0.1 -p 5432 -U <username> -d <database>
```

You will be prompted for your password.

## Common Tasks

### Run a query

```bash
psql "postgresql://<username>:<password>@127.0.0.1:5432/<database>" -c 'SELECT version();'
```

### Restore a backup

```bash
pg_restore --no-acl --no-owner -d "postgresql://<username>:<password>@127.0.0.1:5432/<database>" backup.dump
```

The `--no-acl` and `--no-owner` flags avoid permission errors when restoring dumps created on a different host.

### Export a database

```bash
pg_dump "postgresql://<username>:<password>@127.0.0.1:5432/<database>" -Fc -f backup.dump
```

The `-Fc` flag writes a custom-format archive suitable for `pg_restore`.
