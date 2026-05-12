---
slug: "/products/wordpress-capsule/configure"
description: "Complete reference for configuring a WordPress Capsule — database connections, PHP settings, FPM workers, and all environment variables."
---

# Configure

WordPress Capsules are configured through environment variables in the **Config** tab of your Capsule's page. All configuration is applied at container start — changes take effect on the next deploy or restart.

---

## Database Connection

Your WordPress Capsule requires a MySQL Data Capsule. In the **Config** tab, click **Edit** in the **WordPress Config** section to select a MySQL Capsule from your Space.

The following database environment variables are injected automatically:

| Variable | Description |
|---|---|
| `WORDPRESS_DB_HOST` | MySQL host (set by the platform) |
| `WORDPRESS_DB_NAME` | Database name (default: `app`) |
| `WORDPRESS_DB_USER` | Database username |
| `WORDPRESS_DB_PASSWORD` | Database password |

You can change the database name by editing `WORDPRESS_DB_NAME` in the **WordPress Config** section.

---

## Storage

Your WordPress Capsule requires a Persistent Storage Capsule for uploaded media, plugin files, and theme files. Select one in the **WordPress Config** section.

The storage volume is mounted at `/var/www/html/wp-content/uploads`. Without it, uploaded files are lost on every deploy.

---

## Site URL

The public URL of your site is injected as `APP_URL`. WordPress uses this to generate links, enqueue scripts, and handle redirects.

If you change your domain, update `APP_URL` and run a search-replace on the database to update stored URLs:

```bash
cc wp search-replace 'https://old-domain.com' 'https://new-domain.com' --all-tables
```

See [Routing](/products/wordpress-capsule/routing/) for more on domain configuration.

---

## PHP Settings (`WORDPRESS_CUSTOM_INI`)

Override PHP configuration values using the `WORDPRESS_CUSTOM_INI` environment variable. Values are written to a `.ini` file loaded by PHP-FPM on startup.

```ini
WORDPRESS_CUSTOM_INI=memory_limit = 512M
upload_max_filesize = 128M
post_max_size = 128M
max_execution_time = 120
```

Multiple settings are separated by newlines.

### Common PHP settings

| Setting | Default | Description |
|---|---|---|
| `memory_limit` | `256M` | Max memory per PHP request |
| `upload_max_filesize` | from `MAX_UPLOAD_SIZE` | Max size of a single uploaded file |
| `post_max_size` | from `MAX_UPLOAD_SIZE` | Max total POST body size |
| `max_execution_time` | `60` | Max seconds a PHP request may run |
| `max_input_vars` | `3000` | Max number of input variables (increase for complex ACF layouts) |
| `opcache.validate_timestamps` | `1` | Set to `0` on production to skip file-change checks |
| `opcache.jit` | off | Set to `tracing` to enable PHP 8 JIT |
| `opcache.jit_buffer_size` | — | Set to `64M` when enabling JIT |

See [Performance](/products/wordpress-capsule/performance/) for a full tuning guide.

---

## Upload Size (`MAX_UPLOAD_SIZE`)

Set a single variable to configure the upload limit consistently across both nginx and PHP:

```
MAX_UPLOAD_SIZE=128M
```

This sets:
- Nginx `client_max_body_size`
- PHP `upload_max_filesize`
- PHP `post_max_size`

Accepted suffixes: `M` (megabytes), `G` (gigabytes). Default is `64M`.

If you also set `upload_max_filesize` or `post_max_size` via `WORDPRESS_CUSTOM_INI`, those values override `MAX_UPLOAD_SIZE` for PHP only.

---

## WordPress Config (`WORDPRESS_CONFIG_EXTRA`)

Inject PHP constants directly into `wp-config.php` using `WORDPRESS_CONFIG_EXTRA`. This is the correct way to set WordPress configuration constants without editing files.

```php
WORDPRESS_CONFIG_EXTRA=define('DISABLE_WP_CRON', true);
define('WP_POST_REVISIONS', 5);
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
```

### Common constants

| Constant | Recommended value | Description |
|---|---|---|
| `DISABLE_WP_CRON` | `true` | Disable WP-Cron on page load (platform handles cron) |
| `WP_POST_REVISIONS` | `5` | Limit stored post revisions to reduce database bloat |
| `WP_DEBUG` | `false` | Disable debug mode in production |
| `WP_MEMORY_LIMIT` | `256M` | WordPress memory limit (separate from PHP `memory_limit`) |
| `WP_MAX_MEMORY_LIMIT` | `512M` | Memory limit for admin operations |
| `FORCE_SSL_ADMIN` | `true` | Force wp-admin over HTTPS |
| `DISALLOW_FILE_EDIT` | `true` | Disable the plugin/theme file editor in wp-admin |
| `DISALLOW_FILE_MODS` | `true` | Prevent plugin/theme installs from wp-admin (use for hardened sites) |
| `FS_METHOD` | `'direct'` | Bypass FTP prompt for plugin updates (set when using persistent storage) |

---

## PHP-FPM Pool (`WORDPRESS_FPM_CONF`)

Override PHP-FPM process manager settings using `WORDPRESS_FPM_CONF`. Values are appended to the `[www]` pool configuration.

```ini
WORDPRESS_FPM_CONF=[www]
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 2
pm.max_spare_servers = 3
```

### Choosing the right worker count

A typical WordPress page uses 30–80 MB of memory per worker. WooCommerce pages may use 100–150 MB. Estimate:

```
max_children ≈ available_memory ÷ average_worker_memory
```

**Recommended settings by capsule size:**

| Capsule RAM | `pm` | `max_children` | Notes |
|---|---|---|---|
| 512 MB | `dynamic` | 3 | Minimal |
| 1 GB | `dynamic` | 5 | Small blog or portfolio |
| 2 GB | `static` | 8 | Medium site with consistent traffic |
| 4 GB | `static` | 16 | WooCommerce or high-traffic content |

See [Performance](/products/wordpress-capsule/performance/) for the full scaling guide.

---

## Security Configuration

| Variable | Default | Description |
|---|---|---|
| `SESSION_COOKIE_SECURE` | `1` | HTTPS-only session cookies. Set to `0` for local development. |
| `CSP_HEADER` | permissive default | `Content-Security-Policy` header value. Empty string to disable. |
| `XMLRPC_ENABLED` | `false` | Enable XML-RPC endpoint (required for Jetpack and the WordPress mobile app) |
| `NGINX_EXTRA_CONF` | — | Raw nginx directives injected into the server block |

See [Security](/products/wordpress-capsule/security/) for the full security reference.

---

## Caching Configuration

| Variable | Default | Description |
|---|---|---|
| `CACHE_STRATEGY` | `standard` | Preset: `standard` (60s), `aggressive` (600s), `off` |
| `CACHE_TTL_SECONDS` | from strategy | Override cache TTL in seconds |
| `CACHE_ENABLED` | `true` | Set to `false` to disable the nginx page cache |
| `DEBUG_HEADERS` | `false` | Expose `X-Cache` header for cache diagnostics |

See [Caching](/products/wordpress-capsule/caching/) for the full caching reference.

---

## Cron Configuration

| Variable | Default | Description |
|---|---|---|
| `DISABLE_PUBLIC_WP_CRON` | `true` | Restrict `wp-cron.php` to internal platform calls only |

Also set in `WORDPRESS_CONFIG_EXTRA`:

```php
define('DISABLE_WP_CRON', true);
```

See [Cron](/products/wordpress-capsule/cron/) for the full cron reference.

---

## Rate Limiting

| Variable | Default | Description |
|---|---|---|
| `RATE_LIMIT_NORMAL_ROUTES_RPM` | `120` | Requests per minute for public pages |
| `RATE_LIMIT_PROTECTED_ROUTES_RPM` | `30` | Requests per minute for wp-admin and wp-login.php |
| `RATE_LIMIT_API_ROUTES_RPM` | `60` | Requests per minute for the REST API |
| `RATE_LIMIT_MAX_CONN_PER_IP` | `30` | Max concurrent connections per IP address |

---

## All Environment Variables

| Variable | Default | Description |
|---|---|---|
| `WORDPRESS_DB_HOST` | injected | MySQL host |
| `WORDPRESS_DB_NAME` | `app` | Database name |
| `WORDPRESS_DB_USER` | injected | Database username |
| `WORDPRESS_DB_PASSWORD` | injected | Database password |
| `APP_URL` | injected | Site public URL |
| `MAX_UPLOAD_SIZE` | `64M` | Upload limit for nginx and PHP |
| `WORDPRESS_CUSTOM_INI` | — | PHP ini overrides (newline-separated) |
| `WORDPRESS_FPM_CONF` | — | PHP-FPM pool overrides (ini format) |
| `WORDPRESS_CONFIG_EXTRA` | — | PHP constants injected into wp-config.php |
| `CACHE_STRATEGY` | `standard` | Page cache preset |
| `CACHE_TTL_SECONDS` | from strategy | Page cache TTL override |
| `CACHE_ENABLED` | `true` | Enable/disable page cache |
| `DEBUG_HEADERS` | `false` | Expose X-Cache response header |
| `DISABLE_PUBLIC_WP_CRON` | `true` | Restrict wp-cron.php to internal access |
| `XMLRPC_ENABLED` | `false` | Enable XML-RPC endpoint |
| `CSP_HEADER` | permissive | Content-Security-Policy header value |
| `SESSION_COOKIE_SECURE` | `1` | HTTPS-only session cookies |
| `RATE_LIMIT_NORMAL_ROUTES_RPM` | `120` | Rate limit for public routes |
| `RATE_LIMIT_PROTECTED_ROUTES_RPM` | `30` | Rate limit for admin routes |
| `RATE_LIMIT_API_ROUTES_RPM` | `60` | Rate limit for REST API |
| `RATE_LIMIT_MAX_CONN_PER_IP` | `30` | Max concurrent connections per IP |
| `NGINX_EXTRA_CONF` | — | Custom nginx directives in the server block |
