---
slug: "/cli/readme/commands/proxy"
---

# proxy

## Description

Proxy a capsule to your local machine. For example, if you have a MySQL Capsule running on Code Capsules, this command will set up a secure TCP tunnel to give you access to the MySQL instance via a local port.

## Usage

```bash
codecaps proxy capsule -s <space slug> -c <capsule id> -P <local port>
```

## Example Usage

```bash
# proxy a mysql capsule to local port 50001
codecaps proxy capsule -s my-space-slug-123 -c 12345678 -P 50001

# connect to the MySQL instance via the proxy tunnel
mysql -u root -p'MyPass' -h 127.0.0.1 -P 50001 app
```

## Arguments

* `<target>` (Required) The target to create a proxy to. Currently, the only available value for this argument is  "`capsule`"

## Options

* `-s, --space` (Required) The slug of the Space in which the desired Capsule resides
* `-c, --capsule` (Required) The ID of the desired Capsule to proxy
* `-P, --port` (Optional) The local port to set up the tunnel on. If not provided, a random port will be used
