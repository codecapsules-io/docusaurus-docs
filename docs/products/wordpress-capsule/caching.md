---
slug: "/products/wordpress-capsule/caching"
description: "Understand and configure the built-in WordPress page cache to improve performance and handle traffic spikes."
---

# Caching

WordPress Capsules include a built-in **FastCGI full-page cache** that stores rendered HTML responses and serves them to subsequent anonymous visitors without hitting PHP or the database. This dramatically reduces response times and allows your site to handle traffic spikes that would otherwise overwhelm the PHP worker pool.

The cache is **disabled by default**. Enable it by setting `CACHE_TTL_SECONDS`.

---

## How It Works

When an anonymous visitor requests a page:

1. Nginx checks the cache for a stored response matching that URL.
2. **Cache HIT** — the stored HTML is returned immediately. PHP and the database are not involved.
3. **Cache MISS** — nginx passes the request to PHP-FPM, WordPress renders the page, and the result is stored in the cache for subsequent requests.

The cache is automatically **bypassed** for:
- Logged-in users (any `wordpress_logged_in` cookie)
- WooCommerce sessions (cart, checkout, account pages)
- Easy Digital Downloads sessions (`edd_items_in_cart`)
- Password-protected posts
- Comment authors (they see their own comment immediately)
- All POST, PUT, PATCH, DELETE requests
- wp-admin, wp-login.php, xmlrpc.php, wp-cron.php
- The WordPress REST API (`/wp-json/` and `/wc-api/`)
- Cart and checkout paths (`/cart/`, `/checkout/`, `/my-account/`, `/account/`)
- Search results (`?s=`)
- Live preview and page builder previews

This means your admin experience, checkout flow, and all authenticated sessions always go directly to PHP — the cache only affects anonymous public traffic.

---

## Enabling the Cache

Set `CACHE_TTL_SECONDS` to a positive integer to enable caching:

```
CACHE_TTL_SECONDS=60
```

Without this variable, caching is disabled and every request goes to PHP.

### Choosing a TTL

| Value | Best for |
|---|---|
| `60` | **Most sites.** Blogs, portfolios, brochure sites. New comments and content updates appear within 60 seconds. |
| `600` | High-traffic sites where content changes infrequently (archives, documentation, landing pages). |
| unset (default) | WooCommerce stores with live stock, BuddyPress, membership/LMS sites, or when using a WordPress caching plugin. |

:::caution Which TTL should I use?
- Start with `CACHE_TTL_SECONDS=60` for most WordPress sites. It protects against traffic spikes while keeping content fresh — a new comment, post, or product update is visible within 60 seconds.
- Use a higher value like `CACHE_TTL_SECONDS=600` for mostly-static sites (news archives, documentation, landing pages) where you accept slightly stale content in exchange for maximum throughput.
- Leave `CACHE_TTL_SECONDS` unset for dynamic sites where every page must be live: WooCommerce stores tracking real stock, membership sites with per-user content, or any site using a WordPress caching plugin.
:::

---

## Disabling the Cache

Leave `CACHE_TTL_SECONDS` unset (the default), or remove it from your environment variables.

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

Product listing and product detail pages **are** cached for anonymous visitors, which is correct — stock levels and prices displayed there update within the cache TTL. For sites where stock accuracy within seconds is critical (flash sales, limited edition drops), leave `CACHE_TTL_SECONDS` unset or use a very low value like `CACHE_TTL_SECONDS=10`.

---

## Caching Plugins

If you install a caching plugin (WP Rocket, W3 Total Cache, WP Super Cache), leave `CACHE_TTL_SECONDS` unset and let the plugin manage caching. Running both the built-in nginx cache and a WordPress caching plugin simultaneously can cause unexpected interactions.

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

## How the Cache Key Works

The cache key is constructed from the request scheme, method, host, and full URI:

```
scheme | method | host | full URI
```

This means `https://example.com/page/` and `http://example.com/page/` are stored separately. Query strings are part of the key, so `/?page=1` and `/?page=2` are separate entries.

---

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `CACHE_TTL_SECONDS` | unset (disabled) | Cache TTL in seconds. Must be a positive integer. Unset to disable caching. |
| `DEBUG_HEADERS` | `false` | Expose `X-Cache` header for cache debugging |
