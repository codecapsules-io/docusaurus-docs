---
slug: '/products/frontend-capsule/supported-runtimes'
description: >-
  Supported frameworks, Node.js build runtimes, and static site deployment for
  Frontend Capsules on Code Capsules.
---

# Supported Runtimes

Frontend Capsules host static websites over HTTPS. You can deploy a plain HTML, CSS, and JavaScript site with no build step, or use Node.js at build time to install dependencies and compile a framework project before serving the output.

:::info

**Static HTML sites.** If your repository already contains the files you want to serve — for example, `index.html`, CSS, and images — you do not need Node.js, `package.json`, or a version pin. Leave the **Build Command** empty and keep **Project Path** at `/` if your files are in the repository root. See the [Static HTML](/frontend/static-html/) guide and [Configure](/products/frontend-capsule/configure/) for capsule settings.

:::

:::info

Frontend Capsules serve **static files** over HTTPS. They do not run a persistent application server. Frameworks that need server-side rendering or a Node.js process at runtime — such as Next.js with a server or Nuxt with Nitro — should be deployed as a [Backend Capsule](/products/backend-capsule/supported-runtimes/#server-side-javascript-frameworks) instead.

:::

## Node.js at build time

The sections below apply when your project uses npm and a build command (for example, React, Vue, or Angular). They do not apply to plain static HTML sites.

### Platform

| Property             | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| **Operating system** | Ubuntu 24.04 LTS                                             |
| **Build runtime**    | Node.js — used for `npm install` and your build command only |

Node.js version selection happens at **build time**, not while your capsule is serving static files. Runtime versions are resolved at build time, not baked into the platform image. Each build resolves a version in this order:

1. Your app's explicit pin in `package.json` (if valid)
2. The platform default line for Node.js (if no valid pin exists)

Unpinned applications use the platform default line at build time. This is not a fixed version — if a newer patch is available when your build runs, that version is used. Code Capsules does not move unpinned apps to a new Node.js major when a new LTS is published — that only happens when the platform is upgraded.

### Supported language runtimes

The table below lists each supported Node.js version line and the platform default used when your project does not specify a version.

| Language               | Supported version lines | Unpinned default           |
| ---------------------- | ----------------------- | -------------------------- |
| [**Node.js**](#nodejs) | 22.x.x, 24.x.x          | Latest patch on **24.x**   |

:::info

If your application requires a runtime or build toolchain not listed above, deploy with a [Docker Capsule](/products/docker-capsule/) and your own `Dockerfile`.

:::

### Pin a runtime version

Pin Node.js in your project's `package.json`. After changing a version pin, push a new commit and trigger a rebuild from the **Deploy** tab for the change to take effect.

### Node.js

Set `engines.node` in `package.json` to pin an exact Node.js version for every build:

```json
{
  "engines": {
    "node": "v24.18.0"
  }
}
```

When a valid pin is present, the platform uses exactly that version for dependency installation and your build command.

:::caution

`engines.node` must be an exact version string in the form `v<major>.<minor>.<patch>` (for example, `v24.18.0` or `v22.23.1`).

The following are **not** supported and cause a fallback to the platform default at build time:

- Semver ranges (`>=18`, `^20`, `~22`, `24.x`)
- Bare major or minor versions (`20`, `24`)
- Version files (`.nvmrc`, `.node-version`)

:::

#### Platform upgrades and pins

| Scenario                                                          | Behaviour                                                                         |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Platform moves to a new default line, app unpinned                | App uses the new default line on the next build                                   |
| Platform moves to a new default line, app pinned to a version     | App continues using the pinned version                                            |
| New Node LTS published upstream, app unpinned                     | App stays on the current platform default until Code Capsules upgrades the platform |
| Patch release on the 24.x line, app unpinned                      | App uses the newer 24.x patch on the next build                                   |
| Patch release on the 24.x line, app pinned to an exact version    | App continues using the exact pinned version                                      |

Pin an exact version when your framework, native modules, or tooling require a specific Node.js release and you need builds to stay identical across platform patch updates.

## Supported frameworks

Frontend Capsules work with plain static HTML sites or any npm-based toolchain that produces static files. The table below lists frameworks with tested deployment guides and typical build settings.

| Framework                    | Build command   | Output directory      | Guide                                 |
| ---------------------------- | --------------- | --------------------- | ------------------------------------- |
| **React** (Create React App) | `npm run build` | `build`               | [React](/frontend/react/)             |
| **React** (Vite)             | `npm run build` | `dist`                | [React](/frontend/react/)             |
| **Angular**                  | `npm run build` | `dist/<project-name>` | [Angular](/frontend/angular/)         |
| **Vue** (Vite / Vue CLI)     | `npm run build` | `dist`                | [Vue](/frontend/vue/)                 |
| **Svelte**                   | `npm run build` | `public`              | [Svelte](/frontend/svelte/)           |
| **Static HTML**              | —               | `/` (repository root) | [Static HTML](/frontend/static-html/) |
| **Astro** (static output)    | `npm run build` | `dist`                | —                                     |
| **Gatsby**                   | `npm run build` | `public`              | —                                     |

Framework **versions** are not pinned by the platform. They come from your `package.json` dependencies and lock file.

If your framework is not listed, any build that outputs static HTML, CSS, and JavaScript into a folder will work — set the **Build Command** and **Build Output Directory** in the [Config](/products/frontend-capsule/configure/) tab to match your project.

## Package managers

Code Capsules uses **npm** for Frontend Capsule builds. Include a `package-lock.json` for faster, reproducible installs. Other lock files (`yarn.lock`, `pnpm-lock.yaml`) are not used — convert to npm or ensure `package-lock.json` is committed.

## Not supported on Frontend Capsules

| Use case                                               | Recommended approach                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Next.js with server / SSR                              | [Backend Capsule](/frontend/next.js/)                                                |
| Nuxt with Nitro server                                 | [Backend Capsule](/tutorials/nuxt3-and-nitro/)                                       |
| Custom web server (Express, Fastify, etc.)             | [Backend Capsule](/products/backend-capsule/)                                        |
| Non-Node build tools only (no `package.json`)          | [Static HTML](/frontend/static-html/) or [Docker Capsule](/products/docker-capsule/) |
| PHP, Python, or other non-JavaScript static generators | [Docker Capsule](/products/docker-capsule/)                                          |

## Related

- [Build and Deploy](/products/frontend-capsule/deploy/) — framework deployment guides
- [Configure](/products/frontend-capsule/configure/) — build command, output path, and environment variables
- [Custom Domains](/products/frontend-capsule/custom-domains/) — attach your own domain
