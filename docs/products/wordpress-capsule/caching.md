---
slug: "/products/wordpress-capsule/caching"
description: "Understand and configure the built-in WordPress page cache to improve performance and handle traffic spikes."
---

# Caching

WordPress Capsules include a built-in **FastCGI full-page cache** that stores rendered HTML responses and serves them to subsequent anonymous visitors without hitting PHP or the database. This dramatically reduces response times and allows your site to handle traffic spikes that would otherwise overwhelm the PHP worker pool.

---

## How It Works

When an anonymous visitor requests a page:

1. Nginx checks the cache for a stored response matching that URL.
2. **Cache HIT** — the stored HTML is returned immediately. PHP and the database are not involved.
3. **Cache MISS** — nginx passes the request to PHP-FPM, WordPress renders the page, and the result is stored in the cache for subsequent requests.

The cache is automatically **bypassed** for:
- Logged-in users (any `wordpress_logged_in` cookie)
- WooCommerce sessions (cart, checkout, account pages)
- Password-protected posts
- Comment authors (they see their own comment immediately)
- All POST, PUT, PATCH, DELETE requests
- wp-admin, wp-login.php, xmlrpc.php, wp-cron.php
- The WordPress REST API (`/wp-json/`)
- Search results (`?s=`)
- Live preview and page builder previews

This means your admin experience, checkout flow, and all authenticated sessions always go directly to PHP — the cache only affects anonymous public traffic.

---

## Cache Strategy

The simplest way to configure caching is with the `CACHE_STRATEGY` preset.

| Variable | Default | Description |
|---|---|---|
| `CACHE_STRATEGY` | `standard` | Preset for the cache TTL. See table below. |

| Value | TTL | Best for |
|---|---|---|
| `standard` | 60 seconds | **Most sites.** Blogs, portfolios, brochure sites. New comments appear within 60 seconds. |
| `aggressive` | 600 seconds | High-traffic sites where content changes infrequently (archives, docs, landing pages). |
| `off` | disabled | WooCommerce stores with live stock, BuddyPress, membership/LMS sites, or when using a WordPress caching plugin. |

```
CACHE_STRATEGY=standard
```

:::tip Which strategy should I use?
- **`standard`** works for most WordPress sites. It protects against traffic spikes while keeping content fresh — a new comment, post, or product update is visible within 60 seconds.
- **`aggressive`** suits mostly-static sites (news archives, documentation, landing pages) where you're optimising for maximum throughput and accept slightly stale content.
- **`off`** is for dynamic sites where every page must be live, such as WooCommerce stores tracking real stock levels or membership sites with per-user content. When using `off`, consider installing a WordPress caching plugin (WP Rocket, W3 Total Cache) that handles its own static HTML generation with proper cache invalidation.
:::

---

## Custom TTL

Override the TTL directly in seconds if the presets don't fit your needs.

| Variable | Default | Description |
|---|---|---|
| `CACHE_TTL_SECONDS` | derived from `CACHE_STRATEGY` | Cache TTL in seconds. Overrides `CACHE_STRATEGY`. |

```
CACHE_TTL_SECONDS=30
```

A 30-second TTL still provides strong thundering-herd protection while keeping content near-real-time.

---

## Disabling the Cache

To disable caching entirely:

```
CACHE_ENABLED=false
```

or equivalently:

```
CACHE_STRATEGY=off
```

Use this when:
- You are using a WordPress caching plugin (WP Rocket, W3 Total Cache, WP Super Cache) that generates its own static files. These plugins have smarter per-URL invalidation than the nginx cache.
- Your site is behind an external CDN that handles full-page caching (e.g. Cloudflare with APO).
- You are debugging a rendering issue and need to rule out stale cache.

---

## WooCommerce

WooCommerce is fully supported. The cache is automatically bypassed for:

- The cart page
- The checkout page
- The account page
- Any visitor with an active WooCommerce session cookie (`woocommerce_items_in_cart`, `woocommerce_cart_hash`, `wp_woocommerce_session`)

Product listing and product detail pages **are** cached for anonymous visitors, which is correct — stock levels and prices displayed there update within the cache TTL. For sites where stock accuracy within seconds is critical (flash sales, limited edition drops), use `CACHE_STRATEGY=off` or `CACHE_TTL_SECONDS=10`.

---

## Caching Plugins

If you install a caching plugin (WP Rocket, W3 Total Cache, WP Super Cache), set `CACHE_ENABLED=false` and let the plugin manage caching. Running both the built-in nginx cache and a WordPress caching plugin simultaneously can cause unexpected interactions.

```
CACHE_ENABLED=false
```

The plugin's own cache files (stored in `wp-content/cache/`) are preserved on the persistent storage volume between deployments.

---

## Cache Diagnostics

Enable the `X-Cache` response header to inspect whether a response was served from cache:

```
DEBUG_HEADERS=true
```

With this enabled, every response includes:

| Header value | Meaning |
|---|---|
| `HIT` | Served from cache — PHP was not involved |
| `MISS` | Not in cache — PHP rendered the page and it was stored |
| `BYPASS` | Cache bypassed for this request (logged in, cart, POST, etc.) |
| `EXPIRED` | Cached entry existed but has expired |

:::caution
`DEBUG_HEADERS=true` reveals your caching infrastructure to anyone who can inspect response headers. Only enable it temporarily for debugging. Disable it (`DEBUG_HEADERS=false`) in production.
:::

---

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `CACHE_STRATEGY` | `standard` | Preset: `standard` (60s), `aggressive` (600s), `off` |
| `CACHE_TTL_SECONDS` | from strategy | Cache TTL in seconds. Overrides `CACHE_STRATEGY`. |
| `CACHE_ENABLED` | `true` | Set to `false` to disable caching entirely |
| `DEBUG_HEADERS` | `false` | Expose `X-Cache` header for cache debugging |
