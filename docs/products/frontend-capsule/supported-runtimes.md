---
slug: '/products/frontend-capsule/supported-runtimes'
description: >-
  Supported frameworks, platform versions, and Node.js runtimes for Frontend
  Capsules on Code Capsules.
---

# Supported Runtimes

Frontend Capsules build static sites and single-page applications (SPAs). Code Capsules installs Node.js dependencies, runs your build command, and serves the compiled output over HTTPS.

:::info

Frontend Capsules serve **static files** after the build step. They do not run a persistent application server. Frameworks that need server-side rendering or a Node.js process at runtime — such as Next.js with a server or Nuxt with Nitro — should be deployed as a [Backend Capsule](/products/backend-capsule/supported-runtimes/#server-side-javascript-frameworks) instead.

:::

## Supported frameworks

Frontend Capsules work with any npm-based toolchain that produces static files. The table below lists frameworks with tested deployment guides and typical build settings.

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

Framework **versions** are not pinned by the platform. They come from your `package.json` dependencies and lock file. Use the version ranges recommended by each framework's documentation.

If your framework is not listed, any build that outputs static HTML, CSS, and JavaScript into a folder will work — set the **Build Command** and **Static Content Folder Path** in the [Config](/products/frontend-capsule/configure/) tab to match your project.

## Pin a Node.js version

Set `engines.node` in `package.json` to pin the Node.js version used during the build:

```json
{
  "engines": {
    "node": "v24.18.0"
  }
}
```

:::caution Exact version format required

`engines.node` must be in **exact** `vMAJOR.MINOR.PATCH` format (for example, `v24.18.0`). Semantic ranges such as `24.x`, `^24.0.0`, or `>=24` are not supported and fall back to the latest LTS (**v24.18.0**).

:::

## Package managers

Code Capsules uses **npm** for Frontend Capsule builds. Include a `package-lock.json` for faster, reproducible installs. Other lock files (`yarn.lock`, `pnpm-lock.yaml`) are not used — convert to npm or ensure `package-lock.json` is committed.

## Serving behavior

After a successful build, your static files are served with:

- HTTPS on your capsule's public URL
- **gzip** and **zstd** compression
- SPA-style routing — requests for unknown paths fall back to `index.html`
- Files served from your configured static content folder

Environment variables are available during the **build** step. They are not available to client-side JavaScript at runtime. To inject values such as a backend API URL into your site, bake them in during the build (for example, with a `postbuild` script). See the [Heroku migration guide](/tutorials/heroku-migration-guide/) for an example.

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
