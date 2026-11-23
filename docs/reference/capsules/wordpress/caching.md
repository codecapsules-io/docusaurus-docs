---
slug: "/reference/capsules/wordpress/caching"
diataxis: reference
title: "WordPress Cache Reference"
description: "Environment variables and X-Cache header values for the built-in WordPress page cache."
sidebar_label: "Caching"
---

# WordPress Cache Reference

Settings and values for the built-in WordPress page cache. To turn it on or off, see [How to enable WordPress caching](/how-to/capsules/wordpress/caching/). To understand how it works, see [How WordPress caching works](/explanation/capsules/wordpress/caching/).

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `CACHE_TTL_SECONDS` | unset (disabled) | Cache TTL in seconds. Must be a positive integer. Unset to disable caching. |
| `DEBUG_HEADERS` | `false` | Expose `X-Cache` header for cache debugging |

## X-Cache header values

With this enabled, every response includes:

| Header value | Meaning |
|---|---|
| `HIT` | Served from cache — PHP was not involved |
| `MISS` | Not in cache — PHP rendered the page and it was stored |
| `BYPASS` | Cache bypassed for this request (logged in, cart, POST, etc.) |
| `EXPIRED` | Cached entry existed but has expired |
