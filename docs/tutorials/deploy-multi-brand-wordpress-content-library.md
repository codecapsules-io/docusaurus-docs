---
title: "Deploy a Multi-Brand WordPress Content Library"
slug: "/tutorials/deploy-multi-brand-wordpress-content-library"
description: "Step-by-step: govern a shared WordPress theme and plugin codebase from one Git repository, deployed to several independent, branded WordPress Capsules."
sidebar_label: "Multi-Brand Content Library"
---

# Deploy a Multi-Brand WordPress Content Library

This tutorial builds the [Multi-Instance Content Library](/products/wordpress-capsule/multi-instance-content-library/) pattern end to end: one governed Git repository as the shared theme/plugin codebase, and one isolated WordPress Capsule per branded site, each deploying from that same repository.

By the end, pushing a change to the shared branch rolls it out to every brand, while each brand's content and database stay fully isolated.

## Prerequisites

- A Code Capsules account with a Team and Space set up
- A Git repository (GitHub) containing your shared WordPress theme and governed plugin set under `wp-content/themes/` and `wp-content/plugins/`

## 1. Create the shared repository

If you don't already have one, create a Git repository containing:

- `wp-content/themes/your-shared-theme/`
- `wp-content/plugins/` — the plugin set every brand should run
- Any brand-selection logic your theme/plugins need, driven by an environment variable (see step 4)

This repository is the content library every branded Capsule will deploy from.

## 2. Create a WordPress Capsule for the first brand

On your Code Capsules dashboard, click the **+** icon and select **New Capsule**, then choose **WordPress** as the Capsule type.

Attach a MySQL Database Capsule and a Persistent Storage Capsule to it — create new ones or select existing instances from the dropdowns, then click **Create Capsule**.

## 3. Deploy it Git Managed, pointed at the shared repository

Select **Git Managed** as the deployment type, choose your shared repository, and select the branch every brand should track (for example, `main`). Click **Next**.

Code Capsules builds and deploys the WordPress application from that repository and branch. Watch progress in the **Logs** tab.

## 4. Configure the brand

In the Capsule's **Config** tab:

- Set `APP_URL` to this brand's domain
- Set any brand-selection environment variable your shared theme/plugins read to decide which brand's content/behavior to render

See [Configure](/products/wordpress-capsule/configure/) for the full environment variable reference.

## 5. Repeat for each additional brand

For every additional branded site:

1. Create a new WordPress Capsule with its own MySQL Database Capsule and Persistent Storage Capsule
2. Deploy it **Git Managed**, pointed at the **same shared repository and branch**
3. Set that brand's `APP_URL` and brand-selection variable in its **Config** tab

Each brand now has isolated data and storage, but all of them build from the same governed codebase.

:::tip One brand needs to diverge?
Give that Capsule its own branch that descends from the shared branch, add whatever it needs there, and deploy that Capsule from its own branch instead. It still inherits every update merged below its divergence point.
:::

## 6. Roll out a change to every brand

To ship a plugin or theme update everywhere at once:

1. Merge the change into the shared branch
2. Trigger a redeploy on each brand's Capsule — all at once, or staged one brand at a time if you want to catch issues before they reach every site

## 7. Roll back one brand without touching the others

`git revert` the problematic commit on the branch that brand's Capsule watches, then redeploy just that Capsule. The other brands, watching the shared branch, are unaffected.

## Why this holds up at scale

Every brand's plugins and themes come from a Git commit, not a live wp-admin upload — no branded site can drift from what's in the repository, and no local admin on one brand's site can introduce an unreviewed plugin into production. See [How Git-Based WordPress Deployment Works](https://www.codecapsules.io/how-git-based-wordpress-works/) for the full security comparison.

## Next steps

- [Multi-Instance Content Library](/products/wordpress-capsule/multi-instance-content-library/) — the architecture reference this tutorial implements
- [Multi-Brand WordPress Content Library guide](https://www.codecapsules.io/multi-brand-wordpress-content-library/) — the pattern explained for a non-technical stakeholder
- [Git-Based WordPress Staging → Production Workflow](/tutorials/git-based-wordpress-staging-production-workflow/) — branch-based promotion for a single brand
