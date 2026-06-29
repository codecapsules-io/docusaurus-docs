---
slug: '/products/backend-capsule/supported-runtimes'
description: >-
  Supported language runtimes and versions for Backend Capsules on Code
  Capsules.
---

# Supported Runtimes

Backend Capsules automatically detect your application's language from project files (for example, `package.json` for Node.js or `requirements.txt` for Python), install dependencies, and build a runnable image. This page lists the language versions Code Capsules currently supports.

:::info

Runtime versions are resolved at **build time**, not baked into the platform image. When you pin a version line (for example, `24.x` or `3.14`), each build uses the latest patch available on that line. When you do not pin a version, Code Capsules falls back to the platform default line for that language — again using the latest patch on that line when the build runs.

:::

## Platform

| Property               | Value                                                           |
| ---------------------- | --------------------------------------------------------------- |
| **Operating system**   | Ubuntu 24.04 LTS                                                |
| **Language detection** | Automatic — from project configuration files in your repository |

Code Capsules inspects version hints in your project (for example, the `engines` field in `package.json` or a `.python-version` file). Each build resolves a runtime version in this order:

1. Your app's explicit pin (project file or environment variable)
2. The platform default line for that language (if no pin exists)

Unpinned applications use the latest patch release on the platform default line at build time. This is not a fixed version — if a newer patch is available when your build runs, that version is used. Code Capsules does not move unpinned apps to a new major or minor line when upstream releases one — that only happens when the platform is upgraded.

Pin a major or minor version (for example, `3.14` or `24.x`) to receive the latest patch on that line automatically. Pin an exact patch version (for example, `3.14.6` or `v24.18.0`) when you need every build to use the same release.

## Supported language runtimes

The table below lists each supported version line and the platform default used when your project does not specify a version.

| Language               | Supported version lines    | Unpinned default           |
| ---------------------- | -------------------------- | -------------------------- |
| [**Node.js**](#nodejs) | 22.x.x, 24.x.x             | Latest patch on **24.x**   |
| [**Python**](#python)  | 3.13.x, 3.14.x             | Latest patch on **3.14.x** |
| [**Go**](#go)          | 1.x                        | Latest patch on **1.26.x** |
| [**Java**](#java)      | 17, 21, 25                 | Latest patch on **25**     |
| [**Ruby**](#ruby)      | 3.2.x, 3.3.x, 3.4.x, 4.0.x | Latest patch on **3.4.x**  |
| [**PHP**](#php)        | 8.2.x, 8.3.x, 8.4.x, 8.5.x | Latest patch on **8.4.x**  |
| [**.NET**](#net)       | 8.x.x, 10.x.x              | Latest patch on **10.x**   |

:::info

If your application requires a runtime or OS package not listed above, deploy with a [Docker Capsule](/products/docker-capsule/) and your own `Dockerfile`.

:::

## Pin a runtime version

Where supported, specify the runtime your application needs in your project configuration. Go and Java use an environment variable in the **Config** tab.

After changing a version pin, trigger a rebuild from the **Deploy** tab for the change to take effect. For file-based pins, push a new commit first.

### Node.js

Add an `engines` field to `package.json`. Semantic version ranges are supported — a line pin such as `24.x` resolves to the latest 24.x patch on each build.

```json
{
  "engines": {
    "node": "24.x"
  }
}
```

Pin an exact version when you need every build to use the same release:

```json
{
  "engines": {
    "node": "v24.18.0"
  }
}
```

### Python

Create a `.python-version` file in your project root:

```
3.14
```

You can specify a major.minor version (for example, `3.13` or `3.14`) to receive the latest patch on that line, or an exact patch version (for example, `3.14.6`).

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
3.4
```

You can specify a major.minor version to receive the latest patch on that line, or an exact patch version (for example, `3.4.9`).

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

Version constraints in `composer.json` resolve to the latest matching patch on each build.

### .NET

Create a `global.json` in your project root to pin the .NET SDK version:

```json
{
  "sdk": {
    "version": "10.0.301"
  }
}
```

You can pin a major version line to receive the latest patch on that line automatically, or pin an exact SDK version when you need reproducible builds.

## Platform upgrades and pins

| Scenario                                                           | Behaviour                                                                           |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Platform moves to a new default line, app unpinned                 | App uses the new default line on the next build                                     |
| Platform moves to a new default line, app pinned to a version line | App continues using the pinned line                                                 |
| New major release published upstream, app unpinned                 | App stays on the current platform default until Code Capsules upgrades the platform |
| Patch release on your pinned line, app pinned to that line         | App uses the newer patch on the next build                                          |
| Patch release on your pinned line, app pinned to an exact version  | App continues using the exact pinned version                                        |

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
