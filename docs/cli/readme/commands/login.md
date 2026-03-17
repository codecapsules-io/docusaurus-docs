---
slug: "/cli/readme/commands/login"
---

# login

## Description

Authenticate the CLI with your Code Capsules account. This is required before running commands with the Code Capsules CLI.

## Usage

```bash
codecaps login -e <email> -p <password>
```

## Example usage

```bash
# without password
codecaps login -e my.cc.email@gmail.com

# or you can provide your password inline as an option (not recommended)
codecaps login -e my.cc.email@gmail.com -p MySecurePassword1234
```

## Options

* `-e, --email` (Required) The email of your Code Capsules account
* `-p, --password` (Optional) The password for your Code Capsules account. If not given, you will be prompted for your password.
