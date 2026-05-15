---
slug: "/products/wordpress-capsule/security"
description: "Built-in security features of the WordPress Capsule and how to configure them."
---

# Security

WordPress Capsules include a layered security configuration that protects sites against common WordPress attacks without requiring any plugin installation. This page explains what is enabled by default and which settings you can tune.

---

## HTTPS and Secure Headers

All Code Capsules deployments terminate TLS at the platform load balancer. Traffic between the internet and your site is always HTTPS.

The following HTTP security headers are sent with every response:

| Header | Value | Purpose |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Tells browsers to always use HTTPS for this domain |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents your site from being embedded in iframes on other domains |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information sent to third-party sites |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Disables browser features that WordPress does not need |
| `X-Permitted-Cross-Domain-Policies` | `none` | Blocks Adobe cross-domain access |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection for older browsers |

### Content Security Policy

A Content Security Policy (CSP) header is included by default with a permissive policy that works with most WordPress themes and plugins:

```
default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; frame-ancestors 'self';
```

This default allows inline scripts and styles (required by most page builders) while preventing your site from being framed by external domains.

To set a stricter or custom CSP:

```
CSP_HEADER=default-src 'self' https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; frame-ancestors 'none';
```

To disable the CSP header entirely (not recommended):

```
CSP_HEADER=
```

---

## Blocked Files and Paths

The following paths are blocked at the web server level and return a `403 Forbidden` response regardless of whether the files exist:

| Blocked path | Reason |
|---|---|
| `/wp-config.php` | Contains database credentials |
| `/wp-config-sample.php` | Reveals database config structure |
| `/wp-content/debug.log` | Can contain credentials and stack traces |
| `/.env`, `/.git`, `/.svn` | Source control and environment files |
| `/readme.html`, `/license.txt` | Reveals WordPress version |
| `composer.json`, `package.json`, `yarn.lock` | Reveals dependency versions |
| `/.htaccess`, `/.htpasswd`, `/.user.ini` | Apache config files left from migrations |
| `/wp-includes/*.php` | WordPress core files not intended for direct HTTP access |
| `/wp-content/uploads/*.php` | Prevents PHP execution in the uploads directory |
| `/wp-content/cache/*.php` | Prevents PHP execution in cache directories |
| `/wp-content/upgrade/*.php` | Prevents PHP execution in the upgrade directory |
| `/wp-content/plugins/*/readme.txt` | Plugin readme files expose exact version numbers |
| `/wp-content/themes/*/readme.txt` | Theme readme files expose exact version numbers |

These rules are applied before any WordPress code runs, so they protect even misconfigured sites.

---

## Rate Limiting

All incoming requests are rate-limited by client IP address to protect against brute-force attacks and abusive bots.

Three zones are enforced with configurable limits:

| Zone | Default | Applies to |
|---|---|---|
| `normal_routes` | 120 req/min | All public pages |
| `protected_routes` | 30 req/min | `wp-login.php`, `wp-admin/`, `xmlrpc.php`, `wp-cron.php` |
| `api_routes` | 60 req/min | `/wp-json/` REST API |

When a limit is exceeded the response is `429 Too Many Requests`.

Customize the limits with environment variables:

| Variable | Default | Description |
|---|---|---|
| `RATE_LIMIT_NORMAL_ROUTES_RPM` | `120` | Requests per minute for public routes |
| `RATE_LIMIT_PROTECTED_ROUTES_RPM` | `30` | Requests per minute for admin and login routes |
| `RATE_LIMIT_API_ROUTES_RPM` | `60` | Requests per minute for the REST API |
| `RATE_LIMIT_MAX_CONN_PER_IP` | `30` | Maximum concurrent connections per IP address |

:::tip When to adjust rate limits
- **Increase `RATE_LIMIT_NORMAL_ROUTES_RPM`** if you receive legitimate high-frequency requests from a single IP (e.g. an aggregator, API client, or monitoring service).
- **Decrease `RATE_LIMIT_PROTECTED_ROUTES_RPM`** further (e.g. `10`) for an extra layer of brute-force protection on login.
- **Increase `RATE_LIMIT_API_ROUTES_RPM`** if a headless WordPress frontend or mobile app makes frequent REST API calls.
:::

---

## Login Page (`wp-login.php`)

WordPress login is rate-limited at 30 req/min (via the `protected_routes` zone, burst of 5). The full-page cache is always bypassed for the login page — it never serves a cached response.

WordPress Capsules do not enforce IP restrictions on `wp-login.php` by default. If you want to restrict admin access to specific IP addresses, add an allowlist using `NGINX_EXTRA_CONF`:

```nginx
NGINX_EXTRA_CONF=location = /wp-login.php {
    allow 196.25.1.0/24;
    deny all;
}
```

---

## XML-RPC

XML-RPC (`xmlrpc.php`) is **disabled by default**. It returns `403 Forbidden` for all requests.

XML-RPC is required for:
- The **WordPress mobile app** (iOS/Android)
- **Jetpack** plugin features that use the XML-RPC connection
- External publishing tools

To enable it:

```
XMLRPC_ENABLED=true
```

When enabled, XML-RPC is still rate-limited at 30 req/min (burst of 3) to protect against XML-RPC amplification attacks.

:::caution
Only enable XML-RPC if you have a specific need for it. Most modern WordPress workflows use the REST API instead, which is always available at `/wp-json/`.
:::

---

## WordPress Cron

By default, `wp-cron.php` is **restricted to internal access only** (127.0.0.1). External requests to `/wp-cron.php` receive a `403 Forbidden` response.

This prevents external parties from triggering unexpected cron jobs and spiking your PHP worker usage.

Cron is instead triggered by a platform-level scheduled job that calls the cron endpoint internally every 5 minutes. We recommend adding the following to `WORDPRESS_CONFIG_EXTRA` to tell WordPress to rely on this external trigger:

```php
define('DISABLE_WP_CRON', true);
```

To allow public access to `wp-cron.php` (not recommended):

```
DISABLE_PUBLIC_WP_CRON=false
```

See the [Cron guide](/products/wordpress-capsule/cron/) for the full setup.

---

## PHP Security Settings

The following PHP settings are applied by default for security:

| Setting | Value | Effect |
|---|---|---|
| `expose_php` | `Off` | PHP version is not included in response headers |
| `cgi.fix_pathinfo` | `0` | Prevents path info injection attacks |
| `display_errors` | `Off` | Errors are logged, not shown to visitors |
| `allow_url_include` | `Off` | Prevents remote file inclusion |
| `session.cookie_httponly` | `1` | Session cookies cannot be read by JavaScript |
| `session.cookie_samesite` | `Lax` | Protects against CSRF |
| `session.cookie_secure` | `1` | Session cookies are HTTPS-only |

These defaults follow OWASP recommendations. You can override any of them via `WORDPRESS_CUSTOM_INI` if a specific plugin requires a different value, though changing security settings is generally not recommended.

---

## Custom Nginx Config

For advanced security rules (IP allowlists, custom deny paths, bot blocks), inject raw nginx config using:

```
NGINX_EXTRA_CONF=<nginx location or directive block>
```

**Example — block a specific bot user-agent:**
```nginx
NGINX_EXTRA_CONF=if ($http_user_agent ~* "BadBot|EvilScraper") { return 403; }
```

**Example — restrict wp-admin to your office IP:**
```nginx
NGINX_EXTRA_CONF=location /wp-admin/ {
    allow 196.25.1.0/24;
    deny all;
    try_files $uri $uri/ /index.php?$args;
}
```

---

## Environment Variables Reference

| Variable | Default | Description |
|---|---|---|
| `CSP_HEADER` | permissive default | `Content-Security-Policy` header value. Empty string to disable. |
| `XMLRPC_ENABLED` | `false` | Enable XML-RPC endpoint |
| `DISABLE_PUBLIC_WP_CRON` | `true` | Restrict `wp-cron.php` to internal calls only |
| `SESSION_COOKIE_SECURE` | `1` | HTTPS-only session cookies (`0` for local dev) |
| `RATE_LIMIT_NORMAL_ROUTES_RPM` | `120` | Req/min for public routes |
| `RATE_LIMIT_PROTECTED_ROUTES_RPM` | `30` | Req/min for admin/login routes |
| `RATE_LIMIT_API_ROUTES_RPM` | `60` | Req/min for REST API |
| `RATE_LIMIT_MAX_CONN_PER_IP` | `30` | Max concurrent connections per IP |
| `NGINX_EXTRA_CONF` | — | Raw nginx config injected into the server block |
