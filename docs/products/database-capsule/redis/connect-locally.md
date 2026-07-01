---
slug: '/products/database-capsule/redis/connect-locally'
description: 'Connect to a Redis Database Capsule from your local machine using the Code Capsules CLI proxy and redis-cli.'
---

# Connect Locally

Redis Capsules are private to your Space and cannot be reached through a public URL. To inspect keys, run commands, or debug cache behaviour from your laptop, open a secure tunnel with the [Code Capsules CLI](/cli/) and connect with `redis-cli`.

## When to Use This

Use a local connection when you need to:

- Inspect keys or run Redis commands interactively
- Verify connectivity and server info
- Debug application cache issues against the live instance

## Prerequisites

1. Install and log in to the [Code Capsules CLI](/cli/readme/getting-started/installation-and-usage/) (`codecaps login`).
2. Install `redis-cli` on your machine (see [Install redis-cli](#install-redis-cli) below).

## Open a Proxy Tunnel

1. Open your Redis Capsule **Details** tab and copy the pre-built proxy command.
2. Run the command in a terminal. For example:

```bash
codecaps proxy capsule -s <space-slug> -c <capsule-id> -P 6379
```

3. Leave this terminal open. The tunnel stays active until you stop the process.

See the [proxy command reference](/cli/readme/commands/proxy/) for full options.

## Get Credentials

On the capsule **Details** tab, click **show** in the **Connection Details** section to reveal your credentials:

- Username
- Password
- Connection string

:::tip

Copy the connection string from the **Details** tab, not the CLI copy prompt. Replace the remote host and port with `127.0.0.1` and your proxy port.

```text
# Remote (from Details tab)
redis://myuser:mypass@db-host.internal:6379

# Local (after proxy on port 6379)
redis://myuser:mypass@127.0.0.1:6379
```

If your password contains special characters (`@`, `#`, `/`, and so on), URL-encode them in connection strings.

:::

## Install redis-cli

`redis-cli` is part of the Redis distribution, licensed under the [BSD-3-Clause license](https://redis.io/docs/about/license/).

| Platform | Install |
| -------- | ------- |
| macOS | `brew install redis` |
| Ubuntu / Debian | `sudo apt install redis-tools` |
| Windows | Use [WSL](https://learn.microsoft.com/en-us/windows/wsl/) or see the [Redis install docs](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/) |

Official installation guides: [Install Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

## Connect

With the proxy running, connect using your credentials from the **Details** tab:

```bash
redis-cli -h 127.0.0.1 -p 6379 --user <username> -a '<password>'
```

Or pass a connection URI with the host and port adapted for localhost:

```bash
redis-cli -u "redis://<username>:<password>@127.0.0.1:6379"
```

Replace `6379` with the port you passed to `-P` when starting the proxy.

## Common Tasks

### Verify the connection

```bash
redis-cli -h 127.0.0.1 -p 6379 --user <username> -a '<password>' PING
```

A successful connection returns `PONG`.

### View server information

```bash
redis-cli -h 127.0.0.1 -p 6379 --user <username> -a '<password>' INFO server
```

### List keys matching a pattern

```bash
redis-cli -h 127.0.0.1 -p 6379 --user <username> -a '<password>' KEYS 'session:*'
```

Use `KEYS` sparingly on large databases. Prefer `SCAN` in production debugging.
