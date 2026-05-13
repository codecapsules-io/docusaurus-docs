---
slug: "/products/wordpress-capsule/performance"
description: "Tune PHP, OPcache, and PHP-FPM workers to get the best performance from your WordPress Capsule."
---

# Performance

WordPress Capsules are pre-configured with sensible performance defaults. This guide explains how to tune them for your specific site size and traffic pattern.

---

## How Requests Are Processed

Understanding the request path helps you know where bottlenecks occur:

```
Browser → HTTPS → Platform load balancer (Traefik) → Nginx → PHP-FPM → WordPress → MySQL
```

- **Nginx** serves static files (CSS, JS, images) directly without involving PHP.
- **Nginx page cache** serves cached HTML to anonymous visitors without involving PHP or MySQL.
- **PHP-FPM** processes PHP requests using a pool of worker processes.
- **OPcache** caches compiled PHP bytecode in memory so PHP files do not need to be parsed on every request.

For most sites, the bottleneck is either **PHP worker count** (FPM pool exhausted) or **database queries** (slow or too many queries per page load).

---

## OPcache

OPcache is enabled by default. It compiles PHP files to bytecode once and stores them in memory, eliminating the file parsing overhead on subsequent requests. This typically reduces PHP processing time by 30–50% for WordPress.

### Default settings

| Setting | Default | Description |
|---|---|---|
| `opcache.memory_consumption` | `256` | Memory allocated for OPcache in MB |
| `opcache.max_accelerated_files` | `20000` | Maximum number of PHP files cached |
| `opcache.interned_strings_buffer` | `16` | Memory for interned strings in MB |
| `opcache.validate_timestamps` | `1` | Check for file changes on every request |
| `opcache.revalidate_freq` | `60` | How often (in seconds) to check for file changes |

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

### Worker configuration

| Variable | Description |
|---|---|
| `WORDPRESS_FPM_CONF` | PHP-FPM pool overrides in ini format |

**Recommended configuration by capsule size:**

```ini
# 512MB RAM — minimal
[www]
pm = dynamic
pm.max_children = 3
pm.start_servers = 1
pm.min_spare_servers = 1
pm.max_spare_servers = 2
```

```ini
# 1GB RAM — small site
[www]
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 2
pm.max_spare_servers = 3
```

```ini
# 2GB RAM — medium site
[www]
pm = static
pm.max_children = 8
pm.max_requests = 500
request_terminate_timeout = 60s
```

```ini
# 4GB RAM — large site / WooCommerce
[www]
pm = static
pm.max_children = 16
pm.max_requests = 500
request_terminate_timeout = 120s
```

### `static` vs `dynamic` process manager

- **`pm = static`**: All workers are pre-allocated. No spawning overhead under load. Best for 2GB+ capsules with consistent traffic.
- **`pm = dynamic`**: Workers are spawned and killed based on demand. More memory-efficient for low-traffic or bursty sites.

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

## Static File Performance

Nginx serves static files (CSS, JS, fonts, images) directly without involving PHP. Static files are cached in the visitor's browser for 30 days with an `immutable` cache directive — after the first load, they are never re-requested until the filename changes.

This means **plugin and theme updates automatically bust the browser cache** because WordPress appends a version query string (e.g. `?ver=6.4.2`) to enqueued files.

XML and text files (sitemaps, `robots.txt`) are cached for 1 hour to allow frequent regeneration by SEO plugins.

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

Database query results can be cached in memory using a Redis object cache. See [Configure](/products/wordpress-capsule/configure/) for setup instructions.

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
