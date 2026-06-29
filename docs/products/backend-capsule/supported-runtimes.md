---
slug: '/products/backend-capsule/supported-runtimes'
description: >-
  Supported language runtimes and versions for Backend Capsules on Code
  Capsules.
---

# Supported Runtimes

Backend Capsules automatically detect your application's language from project files (for example, `package.json` for Node.js or `requirements.txt` for Python), install dependencies, and build a runnable image. This page lists the language versions Code Capsules currently supports.

:::info

This page covers **language runtimes**. Patch versions are updated with the platform build image. When you do not pin a version, Code Capsules uses the latest supported patch for that language line.

:::

## Platform

| Property               | Value                                                           |
| ---------------------- | --------------------------------------------------------------- |
| **Operating system**   | Ubuntu 24.04 LTS                                                |
| **Language detection** | Automatic — from project configuration files in your repository |

Code Capsules inspects version hints in your project (for example, the `engines` field in `package.json` or a `.python-version` file). If no version is specified, the latest supported patch version for that language is used.

## Supported language runtimes

The table below lists each supported version line and the latest patch version available on the platform today. You can use any patch version up to and including the listed release.

| Language               | Version line | Latest supported patch |
| ---------------------- | ------------ | ---------------------- |
| [**Python**](#python)  | 3.13.x       | 3.13.14                |
|                        | 3.14.x       | 3.14.6                 |
| [**Node.js**](#nodejs) | 22.x.x       | 22.23.1                |
|                        | 24.x.x       | 24.18.0                |
| [**Go**](#go)          | 1.x          | 1.26.4                 |
| [**Java**](#java)      | 17           | 17.0.19                |
|                        | 21           | 21.0.11                |
|                        | 25           | 25.0.3                 |
| [**Ruby**](#ruby)      | 3.2.x        | 3.2.11                 |
|                        | 3.3.x        | 3.3.11                 |
|                        | 3.4.x        | 3.4.9                  |
|                        | 4.0.x        | 4.0.5                  |
| [**PHP**](#php)        | 8.2.x        | 8.2.31                 |
|                        | 8.3.x        | 8.3.31                 |
|                        | 8.4.x        | 8.4.22                 |
|                        | 8.5.x        | 8.5.7                  |
| [**.NET**](#net)       | 8.x.x        | 8.0.17                 |
|                        | 10.x.x       | 10.0.9                 |

:::info

If your application requires a runtime or OS package not listed above, deploy with a [Docker Capsule](/products/docker-capsule/) and your own `Dockerfile`.

:::

## Pin a runtime version

Where supported, specify the runtime your application needs in your project configuration. Most languages use a project file; Go and Java use an environment variable in the **Config** tab.

After changing a version pin, trigger a rebuild from the **Deploy** tab for the change to take effect. For file-based pins, push a new commit first.

You can pin a major or minor version (for example, `3.14` or `24.x`) to receive the latest supported patch automatically, or pin an exact patch version (for example, `3.14.6`).

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

Create a `.python-version` file in your project root:

```
3.14
```

You can specify a major.minor version (for example, `3.13` or `3.14`) or an exact patch version (for example, `3.14.6`).

### Go

Go does not support version pinning through project files. In the **Config** tab, add the `GOOGLE_GO_VERSION` environment variable and set it to the Go version you need (for example, `1.26`). See [Configure](/products/backend-capsule/configure/#set-environment-variables) for steps.

Trigger a rebuild from the **Deploy** tab after saving the variable. The updated Go version applies on the next build.

The `go` directive in `go.mod` sets the minimum language version for your module but does not select the compiler used during the build.

### Java

Java does not support version pinning through project files. In the **Config** tab, add the `GOOGLE_RUNTIME_VERSION` environment variable and set it to the JDK version you need (for example, `21`). See [Configure](/products/backend-capsule/configure/#set-environment-variables) for steps.

Trigger a rebuild from the **Deploy** tab after saving the variable. The updated JDK version applies on the next build.

Maven or Gradle compiler settings control compilation targets but do not select the JDK installed during the build.

### Ruby

Create a `.ruby-version` file:

```
3.4.9
```

If you use Bundler, Code Capsules also reads the `RUBY VERSION` entry in `Gemfile.lock`.

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

Create a `global.json` in your project root to pin the .NET SDK version:

```json
{
  "sdk": {
    "version": "10.0.301"
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
