---
slug: '/products/docker-capsule/configure'
description: >-
  Configure a Docker Capsule's Dockerfile path, build context, network port,
  auto-build, deployment strategy, and environment variables.
---

# Configure

Configure a Docker Capsule in the **Config** tab. Settings here control how your capsule is built, how traffic reaches your application, and how the capsule connects to other services in your Space.

## Capsule parameters

Click **Edit** in the **Capsule Parameters** section to update build and runtime settings.

### Dockerfile path

The **Dockerfile path** is the location of your Dockerfile relative to the build context. The default is `Dockerfile` at the repository root.

Examples:

| Repository layout         | Dockerfile path           | Build context               |
| ------------------------- | ------------------------- | --------------------------- |
| `Dockerfile` at root      | `Dockerfile`              | _(empty — repository root)_ |
| `api/Dockerfile`          | `api/Dockerfile`          | `api`                       |
| `services/web/Dockerfile` | `services/web/Dockerfile` | `services/web`              |

When you change the Dockerfile path, Code Capsules triggers a new build automatically.

### Build context

The **Build context** is the directory passed to `docker build` as the build context. The default is the repository root (leave the field empty).

Set a subdirectory when your Dockerfile and application code live in a nested folder. The Dockerfile path should be relative to this context or include the path from the repository root, depending on your layout.

Changing the build context triggers a new build.

:::tip

For monorepos, point the build context at the service directory and set the Dockerfile path accordingly. This keeps the build focused and avoids sending the entire repository to the Docker daemon.

:::

### Network port

The **Network port** is the port your application listens on. Code Capsules routes HTTPS traffic to this port and configures ingress accordingly. The default is `3000`.

Your application must listen on this port when the capsule runs. Code Capsules also injects a `PORT` environment variable set to this value, so your app can read the port at runtime. See [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/) for how to use `PORT` in your application.

Changing the network port updates the capsule and ingress routing. It does not trigger a rebuild.

### Auto-build

**Auto-build** controls whether Code Capsules automatically rebuilds your capsule when you push commits to the linked Git branch. It is **enabled by default** for all buildable capsules. The first build also starts automatically when the capsule is created.

| Setting               | Behavior                                                                |
| --------------------- | ----------------------------------------------------------------------- |
| **Enabled** (default) | Each push to the linked branch triggers a new build                     |
| **Disabled**          | Git pushes are ignored; trigger builds manually from the **Deploy** tab |

Disable auto-build when you want to control exactly when the capsule is rebuilt, such as during a migration or when testing Dockerfile changes.

### Deployment strategy

The **Deployment strategy** controls how Code Capsules updates the capsule when a new build completes.

| Strategy                     | Behavior                                         | Best for                                         |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **Rolling update** (default) | New replicas start before old ones are removed   | Web applications with zero-downtime requirements |
| **Recreate**                 | All existing replicas stop before new ones start | Apps that cannot run two versions simultaneously |

Changing the deployment strategy updates the capsule without triggering a rebuild.

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

Saving environment variables updates the running capsule with the new values. A rebuild is not required.

To view sensitive values, click **show** in the top-right corner of the variables table.

## Connect Database and Storage Capsules

### Database Capsule

See the [Database Capsule](/products/database-capsule/) documentation for creating and managing database instances.

In the **Config** tab, click **View** next to a Database Capsule to see its connection details.

Click **+** next to the connection string to create a `DATABASE_URL` environment variable in your Docker Capsule. Your application can use this variable to connect to the database.

### Storage Capsule

A [Storage Capsule](/products/storage-capsule/deploy/) provides persistent file storage that survives capsule restarts and rebuilds.

In the **Config** tab, scroll to the **Bind Data Capsule** section and click **Bind** next to your Storage Capsule.

During the bind process, Code Capsules creates a `PERSISTENT_STORAGE_DIR` environment variable. Reference this path in your application to read and write files that persist across capsule restarts and rebuilds.
