---
slug: "/products/docker-capsule/alerting"
description: >-
  Manage notification preferences to stay informed about the health and
  performance of your Docker Capsules.
---

# Notifications

Configure alerts to stay informed about the health and performance of your Docker Capsules.

![Notification Settings](/gitbook-assets/products/alert-settings.png)

## In-app notifications

Configure which alerts you receive within the Code Capsules platform. Toggle individual notification types on or off based on your monitoring needs.

## Email notifications

Set up email alerts to receive notifications outside the platform. You can enable or disable email notifications for the same events as in-app notifications.

## Notification types

Available notification types include:

* **Capsule Not Running:** When a capsule crashes or stops running.
* **Killed by OOM:** When a capsule runs out of memory.
* **High CPU Usage:** When CPU usage exceeds 80%.
* **High Memory Usage:** When memory usage exceeds 80%.
* **High Data Usage:** When data usage exceeds 80%.
* **CPU Throttle:** When CPU is being throttled.

Use the **Enable All** or **Disable All** buttons to quickly configure all notifications.

Click **Save Preferences** to apply your changes.

## Responding to alerts

When you receive an alert, check [Logs](/products/docker-capsule/logs/) and [Metrics](/products/docker-capsule/monitor/). Adjust resources in [Scale](/products/docker-capsule/scale/) if needed, or roll back to a previous build via [Builds](/products/docker-capsule/builds/).
