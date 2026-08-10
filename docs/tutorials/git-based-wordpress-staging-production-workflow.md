---
title: "Git-Based WordPress Staging → Production Workflow"
slug: "/tutorials/git-based-wordpress-staging-production-workflow"
description: "Set up a branch-based staging-to-production promotion workflow for a Git Managed WordPress Capsule, so every plugin and theme change is reviewed before it ships."
sidebar_label: "Staging → Production Workflow"
---

# Git-Based WordPress Staging → Production Workflow

This tutorial sets up two WordPress Capsules — staging and production — that deploy from the **same Git repository** but different branches, so a plugin or theme change has to be reviewed and merged before it reaches production.

This is a different workflow from Code Capsules' built-in [Migrate tab](/tutorials/how-to-simply-host-a-production-wordpress-blog/#migrating-content-from-staging-to-production-with-code-capsules) (which copies database and media between two existing Capsules). This one is about **code** promotion via Git branches, for teams already using Git Managed deployment.

## Prerequisites

- A Git repository with your WordPress theme and plugin set
- Two branches: a working branch (e.g. `staging`) and your production branch (e.g. `main`)

## 1. Deploy the staging Capsule

Create a WordPress Capsule, attach its own MySQL Database Capsule and Persistent Storage Capsule, and deploy it **Git Managed** from your repository — select the `staging` branch.

Set `APP_URL` in its **Config** tab to a staging subdomain, for example `staging.yourdomain.com`.

## 2. Deploy the production Capsule

Create a second WordPress Capsule, with its own separate MySQL Database Capsule and Persistent Storage Capsule, deployed **Git Managed** from the same repository — select the `main` branch this time.

Set `APP_URL` to your production domain.

Staging and production now have fully independent databases and storage; only the shared repository connects them.

## 3. Make a change

Push a plugin or theme change to the `staging` branch. The staging Capsule picks it up and redeploys automatically. Verify the change on your staging domain.

## 4. Promote to production

Open a pull request from `staging` into `main` (or whatever branch your production Capsule tracks). Once it's reviewed and merged, the production Capsule redeploys with the same, already-reviewed change.

## 5. Roll back

If something in production needs to be undone, `git revert` the merge commit on `main` and push — the production Capsule redeploys the previous, known-good state. Staging is untouched.

## What this workflow does and doesn't cover

- **Covers:** code changes — theme files, plugin files, any configuration checked into the repository. Every change to what runs in production is a reviewed pull request, not a direct wp-admin edit.
- **Doesn't cover:** content and database changes. WordPress content (posts, pages, settings) lives in the database, not in Git, so this workflow doesn't sync content between staging and production. If you need that, use the [Migrate tab](/tutorials/how-to-simply-host-a-production-wordpress-blog/#migrating-content-from-staging-to-production-with-code-capsules) to copy database and media from staging to production directly, on top of this code-promotion workflow.

## Next steps

- [Multi-Instance Content Library](/products/wordpress-capsule/multi-instance-content-library/) — extend this same branch-based model to multiple branded sites, not just staging/production
- [Security](/products/wordpress-capsule/security/) — the defaults protecting both Capsules
