---
title: "Migrate a WordPress Site to Code Capsules with Minimal Downtime"
slug: "/tutorials/migrate-wordpress-to-code-capsules-zero-downtime"
description: "Migrate an existing WordPress site — from shared hosting, managed hosting, or a self-hosted server — to Code Capsules, verifying on a default URL before cutting over DNS."
sidebar_label: "Migrate to Code Capsules"
---

# Migrate a WordPress Site to Code Capsules with Minimal Downtime

The approach that minimizes downtime is the same regardless of where you're migrating from: build and verify the new site on its default Code Capsules URL first, and make the DNS change the very last step, after everything else is confirmed working.

## Prerequisites

- A Code Capsules account
- Admin access to your current WordPress site (for exporting the database and media) or its files, if self-hosted
- Access to your domain's DNS settings for the final cutover

## 1. Deploy the new WordPress Capsule

Follow the [WordPress Capsule deployment guide](/products/wordpress-capsule/deploy/) to create:

- A WordPress Capsule (**Default** deployment type, unless your plugins/themes are already in a Git repository, in which case use **Git Managed**)
- A MySQL Database Capsule
- A Persistent Storage Capsule

You'll get a default URL like `your-wordpress-slug.ccdns.co` — don't touch your domain's DNS yet.

## 2. Import your database

Export your existing WordPress database (most hosts provide a phpMyAdmin export, or use `mysqldump` if you have direct database access) and import it into the new MySQL Database Capsule.

## 3. Import your media, plugins, and themes

Copy your existing `wp-content/uploads/` directory into the new Persistent Storage Capsule. If you're not using Git Managed deployment, copy `wp-content/plugins/` and `wp-content/themes/` there as well.

## 4. Update the site URL

WordPress stores its own URL in the database in multiple places. Once the new Capsule is live on its default URL, update `APP_URL` in the **Config** tab to your real domain, then run a search-replace to fix stored URLs:

```bash
cc wp search-replace 'https://old-domain.com' 'https://new-domain.com' --all-tables
```

## 5. Verify before cutting over

Visit the new Capsule's default `*.ccdns.co` URL (or a temporary hosts-file override pointed at it, if you need the real domain to render correctly for testing) and check:

- Pages, posts, and media render correctly
- Plugins and forms work as expected
- Theme customizations carried over

Don't move on until this is confirmed — DNS propagation isn't instant, so any issue found after cutover is harder to walk back quickly.

## 6. Cut over DNS

In the Capsule's **Domains** tab, add your real domain and follow the provided CNAME/ALIAS instructions with your DNS provider. Traffic moves over as DNS propagates — the old host can stay up as a fallback until propagation completes.

## 7. Decommission the old host

Once you've confirmed traffic and content are fully on the new Capsule, cancel or decommission the old hosting.

## Migrating to a multi-brand setup instead of a single site?

If this migration is the first of several branded sites that will share one governed codebase going forward, treat this migrated site's repository as the shared content library and follow [Deploy a Multi-Brand WordPress Content Library](/tutorials/deploy-multi-brand-wordpress-content-library/) for the rest.

## Next steps

- [Configure](/products/wordpress-capsule/configure/) — the full environment variable reference, including `APP_URL` and domain routing
- [Migration guide](https://www.codecapsules.io/migrating-enterprise-wordpress-to-code-capsules/) — the decision-level overview, including the Migrate-tab path for staging-to-production moves already inside Code Capsules
