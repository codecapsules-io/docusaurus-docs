---
slug: "/products/frontend-capsule"
description: "Host static sites and single-page applications on Code Capsules. Choose Static hosting, with a free plan, or Container hosting for always-on serving with logs, metrics, and scaling."
title: "Frontend App Hosting"
sidebar_label: "Frontend Capsule"
---

# Everything About Hosting Your Frontend App

Host static sites and single-page applications (SPAs) on Code Capsules. Frontend Capsules build your project from your Git repository, serve the output over HTTPS, and redeploy automatically when you push to your branch.

## When to use a Frontend Capsule

A Frontend Capsule is a good fit when:

- Your project is plain HTML, CSS, and JavaScript
- You use a framework such as React, Angular, Vue, or Svelte that builds to a folder of static files
- Your site doesn't need a server-side runtime, server-side rendering (SSR), or API routes

If your app needs SSR or API routes, use a [Backend Capsule](/products/backend-capsule/) instead. See [Supported Runtimes](/products/frontend-capsule/supported-runtimes/#not-supported-on-frontend-capsules) for details.

## Choose how to host

Both hosting options build your project the same way and serve the files your build produces. The difference is whether a web server runs in a container to serve them.

|                      | [Static](/products/frontend-capsule/static/deploy/)                    | [Container](/products/frontend-capsule/container/deploy/)                                                        |
| -------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **How it's served**  | Your built files are stored and served directly. No server is running. | A web server runs in a container that stays on.                                                                  |
| **Plans**            | [Free or Paid](/products/frontend-capsule/static/plans/)               | Paid. You choose the CPU, memory, and replicas.                                                                  |
| **Pricing**          | From $0. Paid is a flat monthly rate.                                  | Based on the resources you allocate                                                                              |
| **Scaling**          | Not needed. There are no compute resources to manage.                  | [Scale](/products/frontend-capsule/scale/) CPU, memory, and replicas                                             |
| **Logs and metrics** | Access logs, and storage and traffic use on the **Details** tab        | Runtime [logs](/products/frontend-capsule/logs/), access logs, and [metrics](/products/frontend-capsule/monitor/) |
| **Best for**         | Most sites and SPAs, from personal projects to production sites        | Sites where you want runtime logs and metrics, or room to scale                                                  |

To start, click the yellow **+** button in your Space, select **New Capsule**, and choose **Frontend Capsule**. On the **Hosting** step, choose **Static** or **Container**.

:::warning[You can't switch hosting later]

You can't change between Static and Container after the capsule is created. To use the other option, create a new Frontend Capsule. You can [upgrade a Free static capsule to Paid](/products/frontend-capsule/static/plans/#upgrade-to-paid) at any time.

:::

:::info

Static hosting and the Free plan depend on your cluster. If the **Static** option shows **Not available on this cluster**, use **Container**.

:::

## Documentation

- **Static**
  - [Deploy](/products/frontend-capsule/static/deploy/): create a static capsule from your Git repository
  - [Free and Paid Plans](/products/frontend-capsule/static/plans/): limits for each plan, what happens when you reach them, and how to upgrade
- **Container**
  - [Deploy](/products/frontend-capsule/container/deploy/): create a container capsule from your Git repository
- [Framework Guides](/products/frontend-capsule/deploy/): step-by-step guides for React, Angular, Vue, Svelte, and static HTML
- [Supported Runtimes](/products/frontend-capsule/supported-runtimes/): frameworks, build settings, and Node.js pinning
- [Configure](/products/frontend-capsule/configure/): build command, output folder, and environment variables
- [Scale](/products/frontend-capsule/scale/): allocate resources to a container capsule, or upgrade a Free static capsule
- [Monitor](/products/frontend-capsule/monitor/): view metrics and usage
- [Logs](/products/frontend-capsule/logs/): view build, runtime, and access logs
- [Custom Domains](/products/frontend-capsule/custom-domains/): serve your site from your own domain
- [Notifications](/products/alerting/): set up notifications for capsule events
