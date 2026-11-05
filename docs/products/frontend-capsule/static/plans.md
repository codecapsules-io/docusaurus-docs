---
slug: "/products/frontend-capsule/static/plans"
description: "Compare the Free and Paid plans for static Frontend Capsules on Code Capsules, including build size, monthly traffic, rate limits, and how to upgrade."
title: "Static Frontend Free and Paid Plans"
sidebar_label: "Free and Paid Plans"
---

# Free and Paid Plans for Static Hosting

Static Frontend Capsules come in two plans. **Free** is for personal projects, prototypes, and smaller sites. **Paid** removes the build size and traffic limits for production sites. You choose a plan on the **Plan** step when you create the capsule.

## Compare plans

|                                   | Free                                                     | Paid                                         |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------- |
| **Price**                         | $0                                                       | Flat monthly rate per capsule, pro-rated daily |
| **Payment method required**       | No                                                       | Yes                                          |
| **Number of capsules**            | 5 per user                                               | No limit                                     |
| **Build output size**             | 30 MB per build                                          | No limit                                     |
| **Traffic**                       | 50 GB per calendar month                                 | Unmetered                                    |
| **Request rate**                  | 50 requests per second per visitor, with bursts up to 100 | No limit                                    |
| **Builds**                        | May queue at busy times                                  | Start immediately                            |
| **Default address**               | `<capsule-name>.<free-domain>`                           | Your cluster's standard capsule address      |
| **HTTPS, SPA routing, caching**   | Included                                                 | Included                                     |
| **Custom domains**                | Included                                                 | Included                                     |
| **Environment variables**         | Included                                                 | Included                                     |
| **Auto-deploy on push**           | Included                                                 | Included                                     |

The **Plan** step shows the limits and price that apply to your cluster. The Paid price is shown there and on the upgrade button.

## Free plan limits

### Number of capsules

Each user can have up to 5 Free static capsules across all their Teams and Spaces. Deleted capsules don't count toward this limit. When you've used them all, the **Plan** step shows **Free** as unavailable. To create another, delete a Free capsule or choose **Paid**.

### Build output size

Each build can produce up to 30 MB of files. If a build produces more than this, the build fails and your current deploy keeps serving. To fix this, reduce the size of your build output (for example, compress images or remove source maps) or [upgrade to Paid](#upgrade-to-paid).

### Monthly traffic

Free capsules can serve 50 GB of traffic each calendar month. Traffic is the size of the files sent to visitors and includes requests to your [custom domains](/products/frontend-capsule/custom-domains/). Usage is updated once a day, so the meter on the **Details** tab can be up to a day behind.

When a site reaches its traffic allowance:

- Visitors see a placeholder page that says the site is over its traffic allowance.
- Your files, settings, and address are kept.
- The site starts serving again at the start of the next calendar month, or as soon as you upgrade it to Paid.

### Request rate

Free capsules accept an average of 50 requests per second from each visitor's IP address, with short bursts of up to 100. This is well above what normal browsing needs. Visitors who exceed it get an error for the extra requests until their request rate drops.

### Builds

Builds for Free capsules share a queue. At busy times, your build can wait a short time before it starts.

## Upgrade to Paid

You can upgrade a Free static capsule to Paid at any time:

1. Open the capsule and go to the **Scale** tab.
2. Click **Upgrade to Paid**. The button shows the monthly price.

The upgrade happens straight away:

- Your capsule keeps its address and content. There's no rebuild and no downtime.
- The build size, traffic, and request rate limits are removed.
- If your site was showing the traffic placeholder page, it starts serving again.
- Billing starts from the day you upgrade.

You can't move a Paid capsule back to Free. To use the Free plan again, create a new Free capsule.

## Related

- [Deploy with Static hosting](/products/frontend-capsule/static/deploy/)
- [Container hosting](/products/frontend-capsule/container/deploy/): if you want runtime logs, metrics, or scaling
- [How pricing works](/platform/billing/how-does-the-pricing-work/)
