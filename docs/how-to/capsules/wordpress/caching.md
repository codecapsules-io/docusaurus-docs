---
slug: "/how-to/capsules/wordpress/caching"
diataxis: how-to
description: "Understand and configure the built-in WordPress page cache to improve performance and handle traffic spikes."
title: "How to Enable WordPress Caching"
sidebar_label: "Caching"
---

# Speed Up WordPress With Caching

WordPress Capsules include a built-in **FastCGI full-page cache** that stores rendered HTML responses and serves them to subsequent anonymous visitors without hitting PHP or the database. This dramatically reduces response times and allows your site to handle traffic spikes that would otherwise overwhelm the PHP worker pool.

The cache is **disabled by default**. Enable it by setting `CACHE_TTL_SECONDS`.

To understand what the cache stores and bypasses, see [How WordPress caching works](/explanation/capsules/wordpress/caching/). For every variable and the `X-Cache` header values, see the [WordPress cache reference](/reference/capsules/wordpress/caching/).

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

:::caution[Which TTL should I use?]
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

## Caching Plugins

If you install a caching plugin (WP Rocket, W3 Total Cache, WP Super Cache), leave `CACHE_TTL_SECONDS` unset and let the plugin manage caching. Running both the built-in nginx cache and a WordPress caching plugin simultaneously can cause unexpected interactions.

The plugin's own cache files (stored in `wp-content/cache/`) are preserved on the persistent storage volume between deployments.

---

## Cache Diagnostics

Enable the `X-Cache` response header to inspect whether a response was served from cache:

```
DEBUG_HEADERS=true
```


For what each header value means, see [X-Cache header values](/reference/capsules/wordpress/caching/#x-cache-header-values).

:::caution
`DEBUG_HEADERS=true` reveals your caching infrastructure to anyone who can inspect response headers. Only enable it temporarily for debugging. Disable it (`DEBUG_HEADERS=false`) in production.
:::
