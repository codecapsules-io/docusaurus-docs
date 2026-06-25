---
slug: '/products/backend-capsule/supported-runtimes'
description: >-
  Supported language runtimes and versions for Backend Capsules on Code
  Capsules.
---

# Supported Runtimes

Backend Capsules automatically detect your application's language from project files (for example, `package.json` for Node.js or `requirements.txt` for Python), install dependencies, and build a runnable image. This page lists the language versions Code Capsules currently supports.

:::info

This page covers **language runtimes**. Application frameworks (Django, Express, Spring, and so on) are installed from your project's dependency files — their versions are determined by your `package.json`, `requirements.txt`, `go.mod`, or equivalent.

:::

## Platform

| Property               | Value                                                           |
| ---------------------- | --------------------------------------------------------------- |
| **Operating system**   | Ubuntu 24.04 LTS                                                |
| **Language detection** | Automatic — from project configuration files in your repository |

Code Capsules inspects version hints in your project (for example, the `engines` field in `package.json`). If no version is specified, the latest supported version for that language is used.

## Supported language runtimes

| Language    | Supported versions         |
| ----------- | -------------------------- |
| **Python**  | 3.13.x, 3.14.x             |
| **Node.js** | 22.x.x, 24.x.x             |
| **Go**      | 1.x                        |
| **Java**    | 17, 21, 25                 |
| **Ruby**    | 3.2.x, 3.3.x, 3.4.x, 4.0.x |
| **PHP**     | 8.2.x, 8.3.x, 8.4.x, 8.5.x |
| **.NET**    | 8.x.x, 10.x.x              |

:::info

The versions above reflect the current platform base (Ubuntu 24.04 LTS). Older runtimes such as Python 3.10, Node.js 18, or Java 8 are **not** supported on Backend Capsules. If your application requires an older runtime, use a [Docker Capsule](/products/docker-capsule/) with a custom base image.

:::

## Pin a runtime version

Specify the runtime your application needs in the conventional file for your language. After changing a version pin, push a new commit or trigger a rebuild from the **Deploy** tab.

### Node.js

Add an `engines` field to `package.json`. Semantic version ranges are supported.

```json
{
  "engines": {
    "node": "24.x"
  }
}
```

### Python

Create a `runtime.txt` in your project root:

```
python-3.13.2
```

Alternatively, set the version in `.python-version`:

```
3.13.2
```

### Go

Set the Go version in `go.mod`:

```
go 1.24
```

### Java

Create a `system.properties` file:

```
java.runtime.version=21
```

For Maven projects, you can also set the Java version in `pom.xml`.

### Ruby

Create a `.ruby-version` file:

```
3.4.2
```

### PHP

Set the PHP version in `composer.json`:

```json
{
  "require": {
    "php": "^8.4"
  }
}
```

### .NET

Create a `global.json` in your project root:

```json
{
  "sdk": {
    "version": "8.0.100"
  }
}
```

## Common frameworks

These frameworks are commonly deployed on Backend Capsules. Framework versions come from your dependency files, not from the platform.

| Framework                | Language | Deployment guide                           |
| ------------------------ | -------- | ------------------------------------------ |
| Express.js               | Node.js  | [Express.js](/backend/node.js/express.js/) |
| Django                   | Python   | [Django](/backend/python/django/)          |
| Flask                    | Python   | [Flask](/backend/python/flask/)            |
| Java (Spring and others) | Java     | [Java](/backend/java/)                     |
| Go                       | Go       | [Go](/backend/go/go/)                      |

## Server-side JavaScript frameworks

Applications that need a persistent Node.js server at runtime — including SSR and full-stack frameworks — belong on a **Backend Capsule** or a [Docker Capsule](/products/docker-capsule/), not a Frontend Capsule.

| Framework             | Capsule type    | Guide                                          |
| --------------------- | --------------- | ---------------------------------------------- |
| Next.js (with server) | Backend Capsule | [Next.js](/frontend/next.js/)                  |
| Nuxt with Nitro       | Backend Capsule | [Nuxt3 and Nitro](/tutorials/nuxt3-and-nitro/) |

## Applications outside supported runtimes

If you need a runtime, OS package, or build step not listed above, deploy with a [Docker Capsule](/products/docker-capsule/) and your own `Dockerfile`.

## Related

- [Build and Deploy](/products/backend-capsule/deploy/) — language and framework deployment guides
- [Configure](/products/backend-capsule/configure/) — run command, port, and environment variables
- [Add a Procfile](/products/backend-capsule/add-procfile/) — custom process definitions for Python and other apps
