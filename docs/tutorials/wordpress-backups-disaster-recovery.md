---
title: "Configure WordPress Backups and a Restore Runbook"
slug: "/tutorials/wordpress-backups-disaster-recovery"
description: "Set up automatic backup schedules for a WordPress Capsule's database and storage, test restoration, and document a restore runbook for your team."
sidebar_label: "Backups & Restore"
---

# Configure WordPress Backups and a Restore Runbook

WordPress splits its data across two places — the MySQL database (posts, users, settings) and file storage (themes, plugins, media) — so a complete backup strategy has to cover both. This tutorial configures automatic backups for each, then walks through a test restore so you know it actually works before you need it.

## 1. Enable automatic database backups

Open your WordPress Capsule's Database Capsule and go to its **Backups** section. Toggle on the schedule that fits your content velocity:

- **Daily** — recommended if your site publishes or updates content frequently
- **Weekly** — sufficient for low-change sites
- **Monthly** — minimum viable, only for near-static sites

Code Capsules retains backups on your selected schedule and automatically removes older ones as new backups are created. Backup storage costs $0.50/GB.

## 2. Enable automatic storage backups

Repeat the same on the Persistent Storage Capsule attached to your WordPress Capsule — this covers uploaded media, and plugin/theme files if you're not deploying Git Managed.

## 3. Take a manual backup before risky changes

Before a major plugin update, theme change, or core upgrade, click **Backup** in the **Manual Backup** section on both the Database and Storage Capsule. This gives you an immediate restore point independent of the scheduled backups.

## 4. Test a restore

Backups you haven't restored from are unverified. On a non-production Capsule (or a staging Capsule if you have one — see [Git-Based Staging → Production Workflow](/tutorials/git-based-wordpress-staging-production-workflow/)):

1. Open the **Backups** panel on the Database Capsule and restore a recent backup
2. Open the **Backups** panel on the Storage Capsule and restore its matching backup
3. Confirm the site renders correctly with the restored content and media

Do this quarterly at minimum — a backup schedule you've never tested is a guess, not a plan.

## 5. Document a restore runbook

Write down, somewhere your team can find it under pressure:

- Which Capsules (Database, Storage) need to be restored together for this site
- Who has access to trigger a restore
- The last time a restore was actually tested, and by whom

For a multi-brand deployment, this runbook should cover every brand's Database and Storage Capsule pair — restoring one brand shouldn't require guessing which backup belongs to which site.

## What this does and doesn't cover

- **Covers:** point-in-time recovery for database and file data, on the schedule you configure.
- **Doesn't cover:** automatic failover or multi-region redundancy. If your enterprise requirements go beyond scheduled backup and manual restore, talk to sales about your specific continuity requirements.

## Next steps

- [Security checklist](https://www.codecapsules.io/resources/enterprise-wordpress-security-checklist/) — backups are one section of the broader checklist
- [Scale and Cache WordPress for High-Traffic Sites](/tutorials/scale-wordpress-caching-autoscaling/)
