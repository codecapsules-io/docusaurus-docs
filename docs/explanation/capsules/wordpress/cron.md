---
slug: "/explanation/capsules/wordpress/cron"
diataxis: explanation
title: "How WordPress Cron Works"
description: "Why WP-Cron needs replacing on a PaaS, what Code Capsules does by default, and how plugin cron jobs behave."
sidebar_label: "Cron"
---

# How WordPress Cron Works

WordPress uses a built-in scheduler (WP-Cron) to run scheduled tasks: publishing scheduled posts, sending emails, running plugin maintenance, checking for updates, and more.

By default, WP-Cron fires when a visitor loads a page. This has two problems on a production PaaS:

- **Low-traffic sites**: If nobody visits for hours, scheduled tasks don't run.
- **High-traffic sites**: Every page load attempts to run pending cron jobs, wasting PHP worker time.

Code Capsules solves both by **disabling the HTTP-triggered cron and replacing it with a platform-level scheduled job** that calls cron every 5 minutes regardless of traffic.

---

## Default Behaviour

By default, WordPress Capsules:

1. **Restrict public access to `wp-cron.php`** — external HTTP requests to `/wp-cron.php` return `403 Forbidden`. This prevents external parties from triggering cron unexpectedly.
2. **The platform calls `wp-cron.php` internally every 5 minutes** — a scheduled job inside the platform network triggers cron via the internal network.

This means scheduled tasks (publishing posts, sending WooCommerce emails, running plugin maintenance) run reliably every 5 minutes without visitor traffic.

---

## Plugin Cron Jobs

Most plugins that use WP-Cron work correctly with this setup. The 5-minute trigger interval means:

- Scheduled posts publish within 5 minutes of their scheduled time.
- WooCommerce emails send within 5 minutes of an order.
- Plugin cleanup and maintenance tasks run on their configured schedule.

Some plugins allow configuring a custom cron interval. The minimum reliable interval on Code Capsules is **5 minutes**.

To configure cron, see [WordPress cron configuration](/reference/capsules/wordpress/cron/).
