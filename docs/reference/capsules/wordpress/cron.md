---
slug: "/reference/capsules/wordpress/cron"
diataxis: reference
title: "WordPress Cron Configuration"
description: "Recommended WP-Cron configuration for Code Capsules, how to allow public cron access, and the related environment variables."
sidebar_label: "Cron"
---

# WordPress Cron Configuration

Settings for WordPress cron on Code Capsules. To understand why the platform replaces the HTTP-triggered cron and what it does by default, see [How WordPress cron works](/explanation/capsules/wordpress/cron/).

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

## Allowing Public Cron Access

If you have a specific reason to allow external HTTP access to `wp-cron.php` (for example, a third-party cron trigger service), you can enable it:

```
DISABLE_PUBLIC_WP_CRON=false
```

Even when public access is enabled, the endpoint is still rate-limited to protect against abuse.

:::caution
If you enable public cron access and also have a separate cron trigger, cron may run more frequently than intended. Monitor WordPress cron logs to confirm expected behaviour.
:::

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `DISABLE_PUBLIC_WP_CRON` | `true` | Restrict `/wp-cron.php` to internal access only |

Also set via `WORDPRESS_CONFIG_EXTRA`:

```php
define('DISABLE_WP_CRON', true);  // Tell WordPress not to trigger cron on page load
```
