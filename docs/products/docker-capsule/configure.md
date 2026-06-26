---
slug: '/products/docker-capsule/configure'
description: >-
  Configure a Docker Capsule's Docker File path, build context, network port,
  and environment variables.
---

# Configure

Configure a Docker Capsule in the **Config** tab. Settings here control how your capsule is built, how traffic reaches your application, and how the capsule connects to other services in your Space.

Build triggers, auto-deploy, and deployment strategy are managed in the **Deploy** tab — see [Deploy](/products/docker-capsule/deploy/) and [Builds](/products/docker-capsule/builds/).

## Capsule parameters

Click **Edit** in the **Capsule Parameters** section to update build and runtime settings.

### Docker File

The **Docker File** field is the path to your Dockerfile from the repository root. The default is `/Dockerfile`.

Examples:

| Repository layout         | Docker File        | Docker Build Context        |
| ------------------------- | ------------------ | --------------------------- |
| `Dockerfile` at root      | `/Dockerfile`      | `/` _(or leave empty)_      |
| `api/Dockerfile`          | `/api/Dockerfile`  | `/api`                      |
| `services/web/Dockerfile` | `/services/web/Dockerfile` | `/services/web`     |

Changing the Docker File path triggers a new build.

### Docker Build Context

The **Docker Build Context** is the directory passed to `docker build` as the build context. The default is the repository root (`/`).

Set a subdirectory when your Dockerfile and application code live in a nested folder. The build context can also be a URL to a **public** Git repository — in that case, the repository is downloaded and used as the build context.

Changing the build context triggers a new build.

:::tip

For monorepos, point the build context at the service directory and set the Docker File path accordingly. This keeps the build focused and avoids sending the entire repository to the Docker daemon.

:::

### Network port

The **Network port** is the port your application listens on. Code Capsules routes HTTPS traffic to this port and configures ingress accordingly. The default is `3000`.

Your application must listen on this port when the capsule runs. Code Capsules also injects a `PORT` environment variable set to this value, so your app can read the port at runtime. See [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/) for how to use `PORT` in your application.

Changing the network port restarts the capsule. It does not trigger a rebuild.

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

Saving environment variables restarts the capsule with the new values. A rebuild is not required.

To view sensitive values, click **show** in the top-right corner of the variables table.

## Connect data capsules

### Database Capsule

See the [Database Capsule](/products/database-capsule/) documentation for creating and managing database instances.

In the **Data capsules** section of the **Config** tab, click **View** next to a Database Capsule to see its connection details.

Click **+** next to the connection string to create a `DATABASE_URL` environment variable in your Docker Capsule. Your application can use this variable to connect to the database.

### Storage Capsule

A [Storage Capsule](/products/storage-capsule/deploy/) provides persistent file storage that survives capsule restarts and rebuilds.

In the **Data capsules** section, click **Bind** next to your Storage Capsule. Both capsules must be running to bind.

During the bind process, Code Capsules creates a `PERSISTENT_STORAGE_DIR` environment variable and restarts your Docker Capsule. Reference this path in your application to read and write files that persist across capsule restarts and rebuilds.
