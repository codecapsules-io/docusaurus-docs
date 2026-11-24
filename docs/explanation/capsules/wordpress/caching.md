---
slug: "/explanation/capsules/wordpress/caching"
diataxis: explanation
title: "How WordPress Caching Works"
description: "What the built-in WordPress page cache stores, when it is bypassed, how it treats WooCommerce, and how cache keys are built."
sidebar_label: "Caching"
---

# How WordPress Caching Works

WordPress Capsules include a built-in **FastCGI full-page cache** that stores rendered HTML responses and serves them to subsequent anonymous visitors without hitting PHP or the database. This dramatically reduces response times and allows your site to handle traffic spikes that would otherwise overwhelm the PHP worker pool.

To turn the cache on, see the [WordPress cache reference](/reference/capsules/wordpress/caching/).

---

## How It Works

When an anonymous visitor requests a page:

1. Nginx checks the cache for a stored response matching that URL.
2. **Cache HIT** — the stored HTML is returned immediately. PHP and the database are not involved.
3. **Cache MISS** — nginx passes the request to PHP-FPM, WordPress renders the page, and the result is stored in the cache for subsequent requests.

The cache is automatically **bypassed** for:
- Logged-in users (any `wordpress_logged_in` cookie)
- WooCommerce sessions (cart, checkout, account pages)
- Easy Digital Downloads sessions (`edd_items_in_cart`)
- Password-protected posts
- Comment authors (they see their own comment immediately)
- All POST, PUT, PATCH, DELETE requests
- wp-admin, wp-login.php, xmlrpc.php, wp-cron.php
- The WordPress REST API (`/wp-json/` and `/wc-api/`)
- Cart and checkout paths (`/cart/`, `/checkout/`, `/my-account/`, `/account/`)
- Search results (`?s=`)
- Live preview and page builder previews

This means your admin experience, checkout flow, and all authenticated sessions always go directly to PHP — the cache only affects anonymous public traffic.

---

## WooCommerce

WooCommerce is fully supported. The cache is automatically bypassed for:

- The cart page
- The checkout page
- The account page
- Any visitor with an active WooCommerce session cookie (`woocommerce_items_in_cart`, `woocommerce_cart_hash`, `wp_woocommerce_session`)

Product listing and product detail pages **are** cached for anonymous visitors, which is correct — stock levels and prices displayed there update within the cache TTL. For sites where stock accuracy within seconds is critical (flash sales, limited edition drops), leave `CACHE_TTL_SECONDS` unset or use a very low value like `CACHE_TTL_SECONDS=10`.

---

## How the Cache Key Works

The cache key is constructed from the request scheme, method, host, and full URI:

```
scheme | method | host | full URI
```

This means `https://example.com/page/` and `http://example.com/page/` are stored separately. Query strings are part of the key, so `/?page=1` and `/?page=2` are separate entries.
