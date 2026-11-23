---
slug: "/explanation/capsules/wordpress/performance"
diataxis: explanation
title: "How WordPress Requests Are Processed"
description: "How a request travels through a WordPress Capsule, how PHP-FPM workers are managed, and how static files are cached."
sidebar_label: "Performance"
---

# How WordPress Requests Are Processed

WordPress Capsules are pre-configured with sensible performance defaults. This guide explains how to tune them for your specific site size and traffic pattern.

To tune these settings, see [How to maximize WordPress performance](/how-to/capsules/wordpress/performance/).

---

## How Requests Are Processed

Understanding the request path helps you know where bottlenecks occur:

```
Browser → HTTPS → Platform load balancer → Nginx → PHP-FPM → WordPress → MySQL
```

- **Nginx** serves static files (CSS, JS, images) directly without involving PHP.
- **Nginx page cache** serves cached HTML to anonymous visitors without involving PHP or MySQL.
- **PHP-FPM** processes PHP requests using a pool of worker processes.
- **OPcache** caches compiled PHP bytecode in memory so PHP files do not need to be parsed on every request.

For most sites, the bottleneck is either **PHP worker count** (FPM pool exhausted) or **database queries** (slow or too many queries per page load).

---

## `static` vs `dynamic` process manager

- **`pm = static`**: All workers are pre-allocated. No spawning overhead under load. Best for 2GB+ capsules with consistent traffic.
- **`pm = dynamic`**: Workers are spawned and killed based on demand. More memory-efficient for low-traffic or bursty sites.

---

## Static File Performance

Nginx serves static files (CSS, JS, fonts, images) directly without involving PHP. Static files are cached in the visitor's browser for 30 days with an `immutable` cache directive — after the first load, they are never re-requested until the filename changes.

This means **plugin and theme updates automatically bust the browser cache** because WordPress appends a version query string (e.g. `?ver=6.4.2`) to enqueued files.

XML and text files (sitemaps, `robots.txt`) are cached for 1 hour to allow frequent regeneration by SEO plugins.
