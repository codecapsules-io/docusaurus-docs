---
slug: "/products/wordpress-capsule/cron"
description: "How WordPress scheduled tasks work on Code Capsules and how to configure reliable cron execution."
---

# Cron

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

## Recommended Configuration

Tell WordPress not to fire cron on page load by adding this to `WORDPRESS_CONFIG_EXTRA`:

```php
define('DISABLE_WP_CRON', true);
```

This is the correct setup for all production sites. Without it, WordPress may still attempt to trigger cron on page loads even though the platform is already handling it.

Full recommended configuration:

```
DISABLE_PUBLIC_WP_CRON=true
WORDPRESS_CONFIG_EXTRA=define('DISABLE_WP_CRON', true);
```

---

## Plugin Cron Jobs

Most plugins that use WP-Cron work correctly with this setup. The 5-minute trigger interval means:

- Scheduled posts publish within 5 minutes of their scheduled time.
- WooCommerce emails send within 5 minutes of an order.
- Plugin cleanup and maintenance tasks run on their configured schedule.

Some plugins allow configuring a custom cron interval. The minimum reliable interval on Code Capsules is **5 minutes**.

---

## Allowing Public Cron Access

If you have a specific reason to allow external HTTP access to `wp-cron.php` (for example, a third-party cron trigger service), you can enable it:

```
DISABLE_PUBLIC_WP_CRON=false
```

Even when public access is enabled, the endpoint is still rate-limited to protect against abuse.

:::caution
If you enable public cron access and also have a separate cron trigger, cron may run more frequently than intended. Monitor WordPress cron logs to confirm expected behaviour.
:::

---

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `DISABLE_PUBLIC_WP_CRON` | `true` | Restrict `/wp-cron.php` to internal access only |

Also set via `WORDPRESS_CONFIG_EXTRA`:

```php
define('DISABLE_WP_CRON', true);  // Tell WordPress not to trigger cron on page load
```
