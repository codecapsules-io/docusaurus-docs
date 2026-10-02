---
slug: "/products/docker-capsule/configure"
description: "Configure a Docker Capsule on Code Capsules: set the network port your container listens on, add environment variables, and bind database and storage capsules."
title: "How to Configure a Docker Container"
sidebar_label: "Configure"
---

# Configure Your Docker Container

Configure a Docker Capsule in the **Config** tab. Settings here control how traffic reaches your application and how the capsule connects to other services in your Space. They apply whether you deploy from Git or from an existing image.

The capsule source and deployment strategy are managed in the **Deploy** tab — see [Deployments](/products/docker-capsule/deployments/).

## Capsule parameters

Click **Edit** in the **Capsule Parameters** section to update the network port.

![Docker Capsule Config tab Capsule Parameters section](/gitbook-assets/products/docker-capsule/config/docker-config.png)

For capsules deployed from Git, this section also contains the **Docker File** and **Docker Build Context** — see [Dockerfile path and build context](/products/docker-capsule/git/builds/#dockerfile-path-and-build-context).

### Network port

The **Network port** is the port your application listens on. Code Capsules routes HTTPS traffic to this port and configures ingress accordingly. The default is `3000`.

Your application must listen on this port when the capsule runs. If you deploy an image that always listens on a fixed port, set the network port to match — see [Images that use a fixed port](/products/docker-capsule/container-requirements/#images-that-use-a-fixed-port). Code Capsules also injects a `PORT` environment variable set to this value, so your app can read the port at runtime. See [Container requirements](/products/docker-capsule/container-requirements/#use-the-port-environment-variable) for how to use `PORT` in your application.

Changing the network port restarts the capsule. It does not trigger a new build.

## Environment variables

Each Docker Capsule receives platform-injected variables automatically:

| Variable  | Description                                |
| --------- | ------------------------------------------ |
| `PORT`    | The network port your app should listen on |
| `APP_URL` | The public URL of your capsule             |

To add custom environment variables:

1. Open the **Config** tab.
2. Click **Key/Val Editor** or **Text Editor** in the environment variables section.
3. Enter the variable **Name** and **Value**.
4. Click **Save**.

Saving environment variables restarts the capsule with the new values. A new build is not required.

To view sensitive values, click **show** in the top-right corner of the variables table.

## Connect data capsules

### Database Capsule

See the [Database Capsule](/products/database-capsule/) documentation for creating and managing database instances.

In the **Data capsules** section of the **Config** tab, click **View** next to a Database Capsule to see its connection details.

![Docker Capsule Config tab Data capsules section with View and Bind actions](/gitbook-assets/products/docker-capsule/config/docker-config-bind-database.png)

Click **+** next to the connection string to create a `DATABASE_URL` environment variable in your Docker Capsule. Your application can use this variable to connect to the database.

### Storage Capsule

A [Storage Capsule](/products/storage-capsule/deploy/) provides persistent file storage that survives capsule restarts and redeploys.

In the **Data capsules** section, click **Bind** next to your Storage Capsule. Both capsules must be running to bind.

During the bind process, Code Capsules creates a `PERSISTENT_STORAGE_DIR` environment variable and restarts your Docker Capsule. Reference this path in your application to read and write files that persist across capsule restarts and redeploys.
