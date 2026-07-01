---
slug: '/products/database-capsule/documentdb/connect-locally'
description: 'Connect to a DocumentDB Capsule from your local machine using the Code Capsules CLI proxy and mongosh.'
---

# Connect Locally

DocumentDB Capsules are private to your Space and require TLS. To run queries, inspect collections, or check your server version from your laptop, open a secure tunnel with the [Code Capsules CLI](/cli/) and connect with `mongosh`.

:::info

For new projects, Code Capsules recommends a [MongoDB Capsule](/products/database-capsule/mongodb/configure/) instead. MongoDB Capsules run on MongoDB Atlas and provide a public `mongodb+srv://` connection string for local access without a proxy.

:::

## When to Use This

Use a local connection when you need to:

- Run queries or inspect collections interactively
- Check your server version
- Debug application issues against the live database

## Prerequisites

1. Install and log in to the [Code Capsules CLI](/cli/readme/getting-started/installation-and-usage/) (`codecaps login`).
2. Install `mongosh` on your machine (see [Install mongosh](#install-mongosh) below).

## Open a Proxy Tunnel

1. Open your DocumentDB Capsule **Details** tab and copy the pre-built proxy command.
2. Run the command in a terminal. For example:

```bash
codecaps proxy capsule -s <space-slug> -c <capsule-id> -P 27017
```

3. Leave this terminal open. The tunnel stays active until you stop the process.

See the [proxy command reference](/cli/readme/commands/proxy/) for full options.

## Get Credentials

On the capsule **Details** tab, click **show** in the **Connection details** section to reveal your credentials.

The connection string uses TLS:

```text
mongodb://<username>:<password>@<host>:<port>/<database>?tls=true&tlsAllowInvalidCertificates=true
```

:::tip

Copy the connection string from the **Details** tab, not the CLI copy prompt. Replace the remote host and port with `127.0.0.1` and your proxy port. Keep the TLS query parameters.

```text
# Remote (from Details tab)
mongodb://myuser:mypass@db-host.internal:27017/mydb?tls=true&tlsAllowInvalidCertificates=true

# Local (after proxy on port 27017)
mongodb://myuser:mypass@127.0.0.1:27017/mydb?tls=true&tlsAllowInvalidCertificates=true
```

If your password contains special characters (`@`, `#`, `/`, and so on), URL-encode them in connection strings.

:::

## Install mongosh

MongoDB Shell (`mongosh`) is distributed under the [Server Side Public License (SSPL)](https://www.mongodb.com/licensing/server-side-public-license). Review the license terms before installing.

| Platform | Install |
| -------- | ------- |
| macOS | `brew install mongosh` |
| Ubuntu / Debian | See [Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/) |
| Windows | [MongoDB Shell MSI installer](https://www.mongodb.com/try/download/shell) |

Official installation guides: [Install mongosh](https://www.mongodb.com/docs/mongodb-shell/install/)

## Connect

With the proxy running, connect using a TLS connection string adapted for localhost:

```bash
mongosh "mongodb://<username>:<password>@127.0.0.1:27017/<database>?tls=true&tlsAllowInvalidCertificates=true"
```

Replace `27017` with the port you passed to `-P` when starting the proxy.

`tlsAllowInvalidCertificates=true` is required because the server certificate is issued for the remote hostname, not `127.0.0.1`.

## Common Tasks

### Check your server version

```javascript
db.version()
```

### List collections

```javascript
show collections
```

### Run a query

```javascript
db.<collection>.find().limit(10)
```
