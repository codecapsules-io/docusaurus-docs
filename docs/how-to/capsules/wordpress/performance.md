---
slug: "/how-to/capsules/wordpress/performance"
diataxis: how-to
description: "Tune PHP, OPcache, and PHP-FPM workers to get the best performance from your WordPress Capsule."
title: "How to Maximize WordPress Performance"
sidebar_label: "Performance"
---

# Make Your WordPress Site Fast

WordPress Capsules are pre-configured with sensible performance defaults. This guide explains how to tune them for your specific site size and traffic pattern.

For the default settings and recommended worker configurations, see the [WordPress PHP settings reference](/reference/capsules/wordpress/performance/). To understand the request path and how workers and static files are handled, see [How WordPress requests are processed](/explanation/capsules/wordpress/performance/).

---

## OPcache

OPcache is enabled by default. It compiles PHP files to bytecode once and stores them in memory, eliminating the file parsing overhead on subsequent requests. This typically reduces PHP processing time by 30–50% for WordPress.

The default OPcache settings are in the [reference](/reference/capsules/wordpress/performance/#default-settings).

### Production optimisation — disable timestamp validation

On production sites where code only changes via a new deploy, disable timestamp validation for a meaningful throughput improvement:

```ini
WORDPRESS_CUSTOM_INI=opcache.validate_timestamps = 0
```

With this setting, OPcache never checks whether files have changed. WordPress runs faster because every file read is skipped. The trade-off is that file changes (plugin updates, theme edits) only take effect after the container restarts — which happens automatically on each deploy.

### Enable JIT (PHP 8.x)

PHP 8's JIT compiler can improve throughput for CPU-intensive operations (image generation, complex calculations, WooCommerce pricing rules):

```ini
WORDPRESS_CUSTOM_INI=opcache.jit = tracing
opcache.jit_buffer_size = 64M
```

JIT provides the most benefit on sites with heavy PHP computation. For typical content sites with mostly database-driven pages, the gain is modest (0–10%).

---

## PHP-FPM Worker Pool

PHP-FPM maintains a pool of worker processes that handle incoming PHP requests. If all workers are busy, new requests queue up. If the queue is full, requests are rejected.

The right number of workers depends on your capsule's RAM:

```
max_children ≈ available_memory_for_php ÷ average_worker_memory
```

A typical WordPress page uses 30–80MB per worker. A WooCommerce page with many plugins may use 100–150MB.

For the worker variable and recommended configurations by capsule size, see [Worker configuration](/reference/capsules/wordpress/performance/#worker-configuration). To choose between `static` and `dynamic`, see [`static` vs `dynamic` process manager](/explanation/capsules/wordpress/performance/#static-vs-dynamic-process-manager).

### Detecting worker exhaustion

Signs that you need more workers:
- Response times spike under moderate traffic
- The Prometheus metric `phpfpm_listen_queue` is greater than 0
- The metric `phpfpm_max_children_reached_total` is increasing
- CPU usage is low but response times are high (workers are waiting on I/O, not CPU)

If worker exhaustion is the bottleneck, **scale your capsule RAM first**, then increase `pm.max_children` proportionally.

---

## Memory Limit

PHP's `memory_limit` controls how much memory a single PHP request can use. The default is `256M`, which is sufficient for most WordPress sites.

Increase it for:
- Page builders (Elementor, Divi, Beaver Builder) with complex layouts
- WooCommerce stores with large product catalogues
- Membership plugins with complex access rules
- Large WXR import/export operations

```ini
WORDPRESS_CUSTOM_INI=memory_limit = 512M
```

:::caution
`memory_limit` applies per PHP worker. A capsule with 8 workers and a 512MB limit could theoretically consume 4GB of RAM at peak. Set `memory_limit` conservatively relative to your capsule size and `pm.max_children`.
:::

---

## Execution Time

The default `max_execution_time = 60` seconds is sufficient for most requests. Increase it for long-running operations:

```ini
WORDPRESS_CUSTOM_INI=max_execution_time = 300
```

Common reasons to increase it:
- WooCommerce order exports
- WXR file imports
- Plugin update operations
- Large image regeneration batches

---

## Database Performance

WordPress makes many small database queries per page. Common performance issues:

### Autoloaded options bloat

WordPress loads a set of "autoloaded" options on every single request. Poorly coded plugins add large data sets to this table. The platform Prometheus metric `wordpress_autoloaded_options_bytes` shows the total size. If it exceeds 1MB, investigate which plugins are contributing.

You can identify the largest autoloaded options with this SQL query (run via the platform database tool):

```sql
SELECT option_name, LENGTH(option_value) AS size
FROM wp_options
WHERE autoload = 'yes'
ORDER BY size DESC
LIMIT 20;
```

### Post revisions

WordPress stores unlimited post revisions by default. Limit them to reduce table size:

```php
WORDPRESS_CONFIG_EXTRA=define('WP_POST_REVISIONS', 5);
```

### Object cache

Database query results can be cached in memory using a Redis object cache. See [Configure](/reference/capsules/wordpress/configure/) for setup instructions.

---

## Checklist — Performance by Site Type

### Blog / Brochure site
- `CACHE_TTL_SECONDS=60` — protects against traffic spikes, content stays fresh ✓
- `opcache.validate_timestamps = 0` for production ✓
- Default FPM pool is sufficient

### WooCommerce store
- `CACHE_TTL_SECONDS=60` — cart/checkout are automatically bypassed ✓
- Increase `pm.max_children` (WooCommerce uses more memory per worker)
- Enable Redis object cache for product/category query caching
- Set `max_execution_time = 120` for import/export operations

### High-traffic content site
- `CACHE_TTL_SECONDS=600` — 10-minute TTL for mostly-static content
- `pm = static` with max workers for your RAM
- `opcache.validate_timestamps = 0`
- Consider an external CDN in front of the capsule

### Membership / LMS site
- Leave `CACHE_TTL_SECONDS` unset — member content must not be cached
- Increase `memory_limit` (membership plugins are memory-heavy)
- Enable Redis object cache to compensate for no page cache
