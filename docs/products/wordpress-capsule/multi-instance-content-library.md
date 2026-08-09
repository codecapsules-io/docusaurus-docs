---
slug: "/products/wordpress-capsule/multi-instance-content-library"
description: >-
  Govern a shared WordPress plugin/theme codebase centrally and deploy it
  to many branded WordPress instances via Git — one content library, many
  sites, each with its own database and configuration.
title: "Multi-Instance Content Library: One Codebase, Many Branded Sites"
sidebar_label: "Multi-Instance Content Library"
---

# One Codebase, Many Branded Sites

If you run WordPress for several brands, regional sites, or franchise locations, you can govern the shared theme and plugin codebase from one Git repository while letting each site deploy and run independently. Marketing HQ controls what's in the library; each branded instance deploys its own copy from Git and manages its own content locally.

This is an architecture pattern built from existing WordPress Capsule primitives — no separate product is required.

## The pattern

- **One Git repository is the content library.** It holds the theme, custom blocks, governed plugin set, and any brand components marketing HQ wants every site to share.
- **Each branded site is its own WordPress Capsule**, with its own MySQL Data Capsule and Persistent Storage Capsule (see [Deploy](/products/wordpress-capsule/deploy/)). Content, media, and the database are isolated per brand — a local marketing team manages their site's content without touching the shared codebase or another brand's data.
- **Every Capsule deploys "Git Managed" from the same repository.** Point every instance at the shared trunk branch to keep them identical, or give a site its own branch when it needs to diverge (a local promotion, a region-specific plugin) while still descending from the shared library.
- **Local differences are expressed through Capsule configuration, not forked code.** Set `APP_URL` per instance (see [Configure](/products/wordpress-capsule/configure/)), and drive any brand-specific behaviour in the shared theme/plugins off an environment variable or a `WORDPRESS_CONFIG_EXTRA` constant, so the same commit renders correctly on every site.
- **Rollouts and rollbacks happen per instance.** Merge a change into the shared branch, then trigger each Capsule's deploy on whatever schedule suits you — all at once, or staged brand by brand. Rolling back one site is a `git revert` and redeploy of that Capsule only; it doesn't touch the others.

## Setting it up

1. Put the shared theme, plugins, and any governed configuration in one Git repository.
2. Create a WordPress Capsule per branded site, each with its own MySQL Data Capsule and Persistent Storage Capsule.
3. Deploy each Capsule as **Git Managed**, pointed at the shared repository — same branch for identical sites, or a brand-specific branch where one site needs to diverge.
4. In each Capsule's **Config** tab, set `APP_URL` and any brand-selection variable your shared theme reads.
5. Push to the shared branch to roll a change out to every brand; push to a brand branch to change just one.

## Why Git-only deploy is the security control

Because every instance's plugins and themes come from a Git commit rather than a live wp-admin upload, no branded site can drift from what's in the repository, and no local admin can introduce an unreviewed plugin into production. See [How Git-Based WordPress Deployment Works](https://www.codecapsules.io/how-git-based-wordpress-works/) for the full attack-surface comparison against a traditional, file-editable WordPress install.

## How this differs from native WordPress Multisite

WordPress's built-in Multisite feature is a single install and a single database serving multiple subsites, typically under one super-admin login. This pattern is different: **separate Capsules, separate databases, separate logins — one shared Git codebase.** You get independent scaling, isolated data, and independent local administration per brand, at the cost of not having one login or one set of users across every site.

If you need a single admin login and shared user base across all sites, native Multisite (or a shared database) is the better fit, not this pattern.
