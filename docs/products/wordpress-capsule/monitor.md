---
slug: "/products/wordpress-capsule/monitor"
description: "Monitor your WordPress Capsule using built-in Prometheus metrics for nginx, PHP-FPM, and WordPress application health."
---

# Monitor

WordPress Capsules expose metrics for Prometheus via built-in exporters running inside the container. The platform scrapes these automatically and makes them available in the **Metrics** tab of your Capsule's page.

![Monitor Capsule Metrics](/gitbook-assets/products/wordpress-capsule/monitor/wordpress-capsule-metrics.png)

---

## Metrics Overview

Three groups of metrics are exposed:

| Source | Port | What it covers |
|---|---|---|
| nginx exporter | `:9113` | Request throughput, active connections, nginx worker state |
| PHP-FPM exporter | `:9253` | Worker pool utilisation, queue depth, request rate |
| WordPress metrics | internal | Application-level metrics (content counts, autoloaded options) |

All exporters are bound internally and scraped by the platform — they are not exposed to public traffic.

---

## Nginx Metrics (`:9113`)

Provided by the [nginx Prometheus exporter](https://github.com/nginx/nginx-prometheus-exporter).

| Metric | Description |
|---|---|
| `nginx_connections_active` | Currently active client connections |
| `nginx_connections_accepted_total` | Total accepted connections since start |
| `nginx_connections_handled_total` | Total handled connections (dropped = accepted − handled) |
| `nginx_connections_reading` | Connections where nginx is reading the request header |
| `nginx_connections_writing` | Connections where nginx is writing a response |
| `nginx_connections_waiting` | Idle keep-alive connections |
| `nginx_http_requests_total` | Total HTTP requests served |

### Key signals

- `nginx_connections_active` sustained near your configured limit → scale up or increase `RATE_LIMIT_MAX_CONN_PER_IP`
- `nginx_connections_handled_total` < `nginx_connections_accepted_total` → connections are being dropped

---

## PHP-FPM Metrics (`:9253`)

Provided by [php-fpm_exporter](https://github.com/hipages/php-fpm_exporter).

| Metric | Description |
|---|---|
| `phpfpm_accepted_connections_total` | Total requests handled by FPM workers |
| `phpfpm_active_processes` | Workers currently handling a request |
| `phpfpm_idle_processes` | Workers waiting for a request |
| `phpfpm_total_processes` | Total workers (active + idle) |
| `phpfpm_max_active_processes` | Peak concurrent workers since start |
| `phpfpm_max_children_reached_total` | Times the worker limit was hit |
| `phpfpm_listen_queue` | Requests waiting because all workers are busy |
| `phpfpm_listen_queue_len` | Max listen queue length |
| `phpfpm_slow_requests_total` | Requests that exceeded `request_slowlog_timeout` |

### Key signals

**Worker pool exhaustion** — the most common WordPress performance problem:

- `phpfpm_listen_queue` > 0 → requests are queuing; increase `pm.max_children`
- `phpfpm_max_children_reached_total` is increasing → worker pool is regularly saturated
- `phpfpm_active_processes` == `phpfpm_total_processes` consistently → no spare capacity

**Worker memory sizing:**

- Monitor `phpfpm_active_processes` vs `phpfpm_total_processes` over time to calibrate your pool size
- If `phpfpm_idle_processes` is always high, reduce `pm.max_children` to free RAM

See [Performance](/products/wordpress-capsule/performance/) for worker pool sizing guidance.

---

## WordPress Application Metrics

WordPress-level metrics are collected by a lightweight PHP endpoint running inside the container. They are scraped by the platform from inside the pod network.

| Metric | Description |
|---|---|
| `wordpress_published_posts_total` | Number of published posts |
| `wordpress_published_pages_total` | Number of published pages |
| `wordpress_approved_comments_total` | Number of approved comments |
| `wordpress_users_total` | Number of registered users |
| `wordpress_autoloaded_options_total` | Number of autoloaded option rows in `wp_options` |
| `wordpress_autoloaded_options_bytes` | Total byte size of all autoloaded options |

### Key signals

- `wordpress_autoloaded_options_bytes` > 5,000,000 (5 MB) → autoloaded options bloat; investigate which plugins are contributing
- `wordpress_autoloaded_options_total` > 1,000 rows → high option count, likely from multiple poorly coded plugins

To identify the largest autoloaded options:

```sql
SELECT option_name, LENGTH(option_value) AS size
FROM wp_options
WHERE autoload = 'yes'
ORDER BY size DESC
LIMIT 20;
```

---

## Recommended Alerts

| Alert | Condition | Severity |
|---|---|---|
| FPM queue building | `phpfpm_listen_queue > 0` for 2 minutes | Warning |
| FPM workers exhausted | rate of `phpfpm_max_children_reached_total` > 0 | Warning |
| No idle FPM workers | `phpfpm_idle_processes == 0` for 5 minutes | Critical |
| Autoloaded options bloat | `wordpress_autoloaded_options_bytes > 5000000` | Warning |
| High connection count | `nginx_connections_active > 200` | Warning |

Example Prometheus alert rules:

```yaml
- alert: FPMWorkersExhausted
  expr: phpfpm_listen_queue > 0
  for: 1m

- alert: FPMMaxChildrenHit
  expr: increase(phpfpm_max_children_reached_total[5m]) > 0

- alert: FPMNoIdleWorkers
  expr: phpfpm_idle_processes == 0
  for: 2m

- alert: WordPressAutoloadBloat
  expr: wordpress_autoloaded_options_bytes > 5e6
```

Configure alerts in the **Alerting** tab of your Capsule. See [Alerting](/products/wordpress-capsule/alerting/) for setup instructions.

---

## Cache Performance

When `DEBUG_HEADERS=true` is set, nginx adds an `X-Cache` header to each response (`HIT`, `MISS`, `BYPASS`, `EXPIRED`). Use this during debugging to verify cache behaviour.

For ongoing cache performance monitoring, track the ratio of PHP requests to total nginx requests:

- If `phpfpm_accepted_connections_total` is close to `nginx_http_requests_total`, the cache hit rate is low. Review your `CACHE_TTL_SECONDS` setting.
- If there is a large gap (nginx serves many more requests than FPM handles), the cache is working effectively.

See [Caching](/products/wordpress-capsule/caching/) for cache configuration options.

---

## Viewing Metrics

Open the **Metrics** tab on your Capsule's page to view graphs for CPU, memory, and request throughput. The platform pre-configures dashboards for the WordPress-specific metrics listed above.

For custom Prometheus queries or Grafana dashboards, contact support for access to the platform's Prometheus instance.
