---
slug: "/products/wordpress-capsule/routing"
description: "How HTTP requests are routed through a WordPress Capsule and how to customise nginx routing."
---

# Routing

This page explains how HTTP traffic flows through a WordPress Capsule and how to customise routing for advanced use cases.

---

## Request Flow

Every HTTP request to your WordPress site follows this path:

```
Visitor → HTTPS → Code Capsules load balancer
  → Nginx (port 80, inside capsule)
    → Static file served directly, OR
    → Nginx page cache (HTML returned without PHP), OR
    → PHP-FPM → WordPress → MySQL
```

Code Capsules ingress controller handles:
- TLS termination (HTTPS → HTTP inside the capsule)
- Custom domain routing
- Real client IP forwarding via the `X-Forwarded-For` header

**Nginx** handles:
- Static file serving (CSS, JS, images, fonts, PDFs)
- Full-page caching
- Rate limiting
- Security header injection
- Path-based routing to PHP-FPM

**PHP-FPM** handles:
- All `.php` file execution
- WordPress routing (the `index.php` catch-all)

---

## WordPress URL Routing

WordPress uses a catch-all rewrite rule: any URL that does not match a real file or directory on disk is routed to `index.php`, which WordPress uses to dispatch the request to the appropriate template.

This is configured in nginx as:

```nginx
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

No special configuration is needed for WordPress permalinks, custom post types, or plugin-defined routes — they all work through this mechanism.

---

## Static Files

Nginx serves files with these extensions directly without involving PHP:

```
css js mjs map jpg jpeg gif png webp avif svg ico woff woff2 ttf eot otf
mp4 webm ogg pdf zip webmanifest wasm
```

Static files are served with a 30-day browser cache (`Cache-Control: public, max-age=2592000, immutable`).

XML and text files (`sitemap.xml`, `robots.txt`) are served with a 1-hour cache to allow frequent regeneration by SEO plugins.

---

## Domain and Subdomain Routing

WordPress Capsules support custom domains and subdomains. To configure a custom domain, see [How to Add a Custom Domain](/platform/capsules/how-to-add-a-custom-domain/).

WordPress must be told its own URL. This is configured automatically via the `APP_URL` environment variable, which is injected by the platform. You can verify the current value in the **Config** tab.

If you change your domain, update `APP_URL` and run a search-replace on the database:

```
wp search-replace 'https://old-domain.com' 'https://new-domain.com' --all-tables
```

---

## Real Client IP

Because all traffic passes through Traefik before reaching nginx, the raw TCP source address inside the capsule is the Traefik IP, not the visitor's IP. Nginx resolves the real client IP automatically from the `X-Forwarded-For` header before passing the request to PHP.

### What PHP and WordPress receive

The real visitor IP is available in PHP via:

```php
$_SERVER['REMOTE_ADDR']       // real visitor IP — use this
$_SERVER['HTTP_X_REAL_IP']    // same real IP, explicitly set by nginx
$_SERVER['HTTP_X_FORWARDED_FOR'] // full proxy chain (may include intermediate proxies)
```

`REMOTE_ADDR` is the correct variable to use in WordPress and PHP code. Nginx resolves `X-Forwarded-For` and writes the result into `REMOTE_ADDR` before the request reaches PHP — so you do not need to parse `X-Forwarded-For` yourself.

### Using client IP in WordPress

Most WordPress plugins and functions that rely on client IP work without any configuration:

```php
// WordPress core — returns real visitor IP
$ip = $_SERVER['REMOTE_ADDR'];

// WooCommerce
$ip = WC_Geolocation::get_ip_address();

// Any security plugin using REMOTE_ADDR will work correctly
```

### IP-based features that work out of the box

- **WooCommerce geolocation** — uses `REMOTE_ADDR` to detect country for shipping and tax
- **Security plugins** (Wordfence, iThemes Security) — see real IPs for lockout and alerting
- **Rate limiting** — the built-in nginx rate limiting zones use the real client IP
- **Geo-restriction plugins** — receive the correct visitor country

### If you are behind an additional proxy or CDN

If you add an external CDN (Cloudflare, Fastly) in front of the capsule, the CDN's IP will be in `X-Forwarded-For` rather than the visitor's IP. In this case, configure the CDN to set a trusted IP header (e.g. `CF-Connecting-IP` for Cloudflare) and read it in WordPress:

```php
// For Cloudflare — add to wp-config.php via WORDPRESS_CONFIG_EXTRA
if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER['HTTP_CF_CONNECTING_IP'];
}
```

Many CDN providers also offer a WordPress plugin that handles this automatically.

---

## REST API

The WordPress REST API is available at `/wp-json/` and is always accessible. It is rate-limited at 60 req/min per IP by default (configurable via `RATE_LIMIT_API_ROUTES_RPM`).

REST API responses are excluded from the full-page cache, so they always reflect live data.

---

## Custom Nginx Routing

For advanced use cases, inject custom nginx `location` blocks using the `NGINX_EXTRA_CONF` environment variable. The content is placed inside the `server {}` block before the PHP handler.

| Variable | Default | Description |
|---|---|---|
| `NGINX_EXTRA_CONF` | — | Raw nginx config injected into the server block |

### Example — proxy a path to an internal service

Route `/api/` to an internal microservice running on a separate Capsule:

```nginx
NGINX_EXTRA_CONF=location /api/ {
    proxy_pass http://my-api-capsule.internal:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### Example — headless WordPress frontend

Route all non-WordPress paths to a Next.js frontend Capsule while keeping `/wp-admin/` and `/wp-json/` on WordPress:

```nginx
NGINX_EXTRA_CONF=location / {
    proxy_pass http://my-nextjs-capsule.internal:3000;
    proxy_set_header Host $host;
}
```

### Example — custom redirect

```nginx
NGINX_EXTRA_CONF=location = /old-page/ {
    return 301 /new-page/;
}
```

:::caution
`NGINX_EXTRA_CONF` is injected before the PHP handler. A `location /` block in `NGINX_EXTRA_CONF` will override the default WordPress routing. Make sure any custom `location /` block includes a fallback to `index.php` if you still want WordPress to handle routes:

```nginx
location / {
    try_files $uri $uri/ /index.php?$args;
}
```
:::

---

## Health Check

The capsule exposes a health check endpoint at `/healthz` that returns `200 OK` when nginx is running. This is used by the platform to determine if the capsule is healthy and ready to receive traffic.

The endpoint does not execute PHP — it is handled entirely by nginx.

---

## wp-admin and Protected Routes

WordPress admin routes (`/wp-admin/`, `/wp-login.php`) are handled separately:

- The full-page cache is always bypassed for all admin routes.
- Rate limiting is applied at the stricter `protected_routes` level (30 req/min).
- Admin PHP files are passed directly to PHP-FPM with no cache layer.

See [Security](/products/wordpress-capsule/security/) for configuring IP restrictions on wp-admin.
