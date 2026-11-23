---
slug: "/reference/capsules/wordpress/performance"
diataxis: reference
title: "WordPress PHP and OPcache Settings"
description: "Default OPcache settings and recommended PHP-FPM worker configurations by capsule size for WordPress Capsules."
sidebar_label: "Performance"
---

# WordPress PHP Settings Reference

Default settings and recommended configurations for tuning PHP on a WordPress Capsule. To apply them, see [How to maximize WordPress performance](/how-to/capsules/wordpress/performance/).

## OPcache

### Default settings

| Setting | Default | Description |
|---|---|---|
| `opcache.memory_consumption` | `256` | Memory allocated for OPcache in MB |
| `opcache.max_accelerated_files` | `20000` | Maximum number of PHP files cached |
| `opcache.interned_strings_buffer` | `16` | Memory for interned strings in MB |
| `opcache.validate_timestamps` | `1` | Check for file changes on every request |
| `opcache.revalidate_freq` | `60` | How often (in seconds) to check for file changes |

## PHP-FPM

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
