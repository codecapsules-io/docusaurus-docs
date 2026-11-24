---
slug: "/how-to/capsules/wordpress/routing"
diataxis: how-to
description: "How HTTP requests are routed through a WordPress Capsule and how to customise nginx routing."
title: "How to Configure WordPress Routing"
sidebar_label: "Routing"
---

# Configure Your WordPress Routing

Use custom nginx routes for advanced cases, such as proxying a path to an internal service, running a headless frontend, or adding redirects. For how traffic flows through a WordPress Capsule, see [How WordPress routing works](/explanation/capsules/wordpress/routing/).

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
