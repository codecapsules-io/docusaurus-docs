---
title: "Scale and Cache WordPress for High-Traffic Sites"
slug: "/tutorials/scale-wordpress-caching-autoscaling"
description: "Handle enterprise WordPress traffic spikes with caching, vertical scaling, and horizontal scaling — what each one actually protects against."
sidebar_label: "Scale & Cache"
---

# Scale and Cache WordPress for High-Traffic Sites

Three controls handle WordPress traffic at scale: caching, which reduces the load each request generates; vertical scaling, more CPU/RAM per Capsule; and horizontal scaling, more instances rather than a bigger one. None of these trigger automatically off a live traffic metric — Code Capsules does not currently autoscale a Capsule in response to traffic, so plan capacity ahead of expected spikes rather than relying on it to self-adjust. See [Is WordPress Scalable?](https://www.codecapsules.io/is-wordpress-scalable/) for how these fit together at the architecture level.

## 1. Enable the full-page cache

In the WordPress Capsule's **Config** tab, set:

```
CACHE_TTL_SECONDS=60
```

This turns on the built-in FastCGI full-page cache. Anonymous visitors get served a cached HTML response directly from nginx — PHP and the database aren't involved — which is what actually protects you during a traffic spike, since it removes load from the PHP worker pool for the majority of anonymous page views.

The cache automatically bypasses logged-in users, WooCommerce/EDD sessions, all non-GET requests, wp-admin, and the REST API, so authenticated and dynamic traffic is unaffected.

### Choosing a TTL

| Value | Best for |
|---|---|
| `60` | Most sites — content updates appear within a minute |
| `600` | Mostly-static sites (archives, docs, landing pages) trading freshness for throughput |
| unset | WooCommerce stores with live stock, membership sites, or sites using a WordPress caching plugin instead |

If you're running multiple branded sites from the [Multi-Instance Content Library](/products/wordpress-capsule/multi-instance-content-library/) pattern, set `CACHE_TTL_SECONDS` per-brand in each Capsule's own Config tab — it isn't shared across instances.

## 2. Verify the cache is working

Temporarily set `DEBUG_HEADERS=true` and inspect the `X-Cache` response header on a few page loads: `HIT` means nginx served it without touching PHP, `MISS` means PHP rendered it and it's now cached, `BYPASS` means the request correctly skipped caching (e.g. you were logged in). Set `DEBUG_HEADERS=false` again once confirmed — it exposes your caching setup to anyone inspecting response headers.

## 3. Right-size PHP-FPM workers for your traffic

Before a known traffic event (a campaign launch, a sale), check your `WORDPRESS_FPM_CONF` worker count against your Capsule's allocated memory. A typical WordPress page uses 30–80 MB per worker; WooCommerce pages can use 100–150 MB.

| Capsule RAM | Recommended `max_children` |
|---|---|
| 512 MB | 3 |
| 1 GB | 5 |
| 2 GB | 8 |
| 4 GB | 16 |

See [Configure](/products/wordpress-capsule/configure/) for the full tuning table and syntax.

## 4. Scale the Capsule vertically ahead of a known spike

If caching and worker tuning aren't enough headroom, open the WordPress Capsule's **Scale** tab, click **Edit**, and increase the allocated CPU/memory with the sliders. This takes effect without downtime, but it is a manual step you trigger — do it *before* an expected spike (a campaign, a press mention), not during one.

## 5. Scale horizontally instead of just vertically

Vertical scaling has a ceiling — at some point a bigger instance isn't the right lever. Two horizontal options:

- **Replica Scale** — set at Capsule creation/configuration, alongside CPU and RAM, this runs more than one instance of the same Capsule's deployment. It's a platform-wide mechanism, not WordPress-specific tooling, so validate session handling for your specific plugin/theme set before relying on it for a stateful WordPress site.
- **One Capsule per brand or region** — the horizontal-scaling lever most enterprise WordPress deployments on Code Capsules actually use. Instead of one WordPress install absorbing traffic for every brand, each brand runs its own independently-scaled Capsule from the [Multi-Instance Content Library](/products/wordpress-capsule/multi-instance-content-library/) pattern — see [Deploy a WordPress DXP: Multi-Brand Enterprise CMS](/tutorials/deploy-multi-brand-wordpress-content-library/). Adding a brand doesn't add load to any existing one.

## What actually protects you during an unexpected spike

In order of what takes effect immediately versus what requires you to act:

1. **The full-page cache** (if enabled) — absorbs anonymous traffic automatically, no action needed once configured
2. **Rate limiting** (on by default) — protects `wp-login.php`/`wp-admin` and the REST API from being overwhelmed, but also applies to legitimate high-frequency clients; raise `RATE_LIMIT_NORMAL_ROUTES_RPM` if you expect a legitimate burst
3. **Vertical and horizontal scaling** — both require you to notice and act; plan for known events rather than counting on same-minute response to an unexpected one. Running multiple brands as separate Capsules already limits how far an unexpected spike on one brand can spread.

## Next steps

- [Caching reference](/products/wordpress-capsule/caching/) — full behavior, WooCommerce specifics, cache key details
- [Scale reference](/products/wordpress-capsule/scale/)
- [Technical spec sheet](https://www.codecapsules.io/resources/wordpress-capsule-technical-spec-sheet/) — every default in one table
