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
| WordPress metrics | internal | Application-level metrics (autoloaded options, active plugins, cron queue) |

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

WordPress-level metrics are collected by a lightweight PHP endpoint running inside the container. They are scraped alongside the FPM exporter.

| Metric | Description |
|---|---|
| `wordpress_autoloaded_options_bytes` | Total size of autoloaded wp_options entries |
| `wordpress_autoloaded_options_count` | Number of autoloaded options |
| `wordpress_active_plugins_total` | Number of active plugins |
| `wordpress_scheduled_events_total` | Number of pending WP-Cron events |
| `wordpress_db_queries_total` | Database queries made during the metrics collection (proxy for DB health) |
| `wordpress_info` | WordPress version and PHP version as labels |

### Key signals

- `wordpress_autoloaded_options_bytes` > 1,000,000 (1 MB) → autoloaded options bloat; investigate which plugins are contributing
- `wordpress_scheduled_events_total` growing without bound → cron jobs are not running or are failing
- `wordpress_active_plugins_total` unusually high → audit plugins for redundancy

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
| FPM workers exhausted | `phpfpm_max_children_reached_total` rate > 0 | Warning |
| No idle FPM workers | `phpfpm_idle_processes == 0` for 5 minutes | Critical |
| Autoloaded options bloat | `wordpress_autoloaded_options_bytes > 1000000` | Warning |
| Cron queue growing | `wordpress_scheduled_events_total > 50` | Warning |
| High connection count | `nginx_connections_active > 80% of limit` | Warning |

Configure alerts in the **Alerting** tab of your Capsule. See [Alerting](/products/wordpress-capsule/alerting/) for setup instructions.

---

## Cache Performance

When `DEBUG_HEADERS=true` is set, nginx adds an `X-Cache` header to each response (`HIT`, `MISS`, `BYPASS`, `EXPIRED`). Use this during debugging to verify cache behaviour.

For ongoing cache performance monitoring, track the ratio of PHP requests to total nginx requests using the FPM and nginx metrics together:

- High `phpfpm_accepted_connections_total` relative to `nginx_http_requests_total` → low cache hit rate; review your `CACHE_STRATEGY` setting

See [Caching](/products/wordpress-capsule/caching/) for cache configuration options.

---

## Viewing Metrics

Open the **Metrics** tab on your Capsule's page to view graphs for CPU, memory, and request throughput. The platform pre-configures dashboards for the WordPress-specific metrics listed above.

For custom Prometheus queries or Grafana dashboards, contact support for access to the platform's Prometheus instance.
