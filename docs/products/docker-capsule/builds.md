---
slug: '/products/docker-capsule/builds'
description: >-
  Manage Docker Capsule builds, auto-deploy from Git, and roll back to previous
  builds.
---

# Builds

Docker Capsules are built from your Git repository using your configured Dockerfile. Code Capsules manages the build pipeline and automatically runs the capsule when a build succeeds.

## How builds work

When a build starts, Code Capsules:

1. Clones your linked Git repository at the configured branch
2. Runs `docker build` using your **Docker File** path and **Docker Build Context** — see [Configure](/products/docker-capsule/configure/)
3. Stores the completed build
4. Automatically runs your capsule on success

Code Capsules retains a limited number of successful builds per capsule. The **Deploy** tab shows how many successful builds are stored (for example, `3 / 5 successful builds`).

A Git repository must be linked before you can build. Private repositories are supported when your GitHub account has been connected to Code Capsules.

## Trigger a build

### Initial build on creation

When a Docker Capsule is created with a linked repository, Code Capsules automatically starts a fresh first build. No manual action is required.

### Manual build

1. Open the **Deploy** tab on your Docker Capsule.
2. Click **Build & Deploy**.
3. Open the **Builds** tab to follow the build log.

Manual builds work regardless of the **auto-deploy** setting.

### Auto-deploy from Git

**Auto-deploy** is enabled by default on the **Deploy** tab. Push a commit to the linked branch to trigger a build automatically, then monitor progress in the **Builds** tab.

To disable or re-enable auto-deploy, use the **Auto Build & Deploy** switch on the [Deploy](/products/docker-capsule/deploy/#auto-deploy) tab.

:::info

Only one build can run per capsule at a time. If a build is already in progress, a new build request waits or returns an error until the current build completes.

:::

## Build lifecycle

| Status        | Description                                           |
| ------------- | ----------------------------------------------------- |
| **Starting**  | Build queued and initializing                         |
| **Building**  | Capsule is being built                                |
| **Succeeded** | Build completed and capsule running automatically     |
| **Failed**    | Build encountered an error — check the build log      |
| **Cancelled** | Build was stopped before completion                   |
| **Timed out** | Build exceeded the allowed duration                   |

## View build logs

Open the **Builds** tab to view build history and logs:

- Select a build from the list on the left
- Read the full build log on the right

From the **Deploy** tab, click **View Logs** on a recent build to jump to the same view.

## Build history and rollback

The **Deploy** tab lists recent builds with status and timestamps. The **Builds** tab provides the full history and detailed logs.

To roll back to a previous build:

1. Open the **Deploy** tab.
2. Find a successful build that is not currently deployed.
3. Click **Deploy**.

Rolling back uses an existing build — it does not trigger a new build. Successful deployments use your configured [deployment strategy](/products/docker-capsule/deploy/#deployment-strategy).

## Troubleshooting builds

### Build fails immediately

- Confirm a repository is linked to the capsule.
- Check that the linked branch exists and contains your Dockerfile.

### Docker build errors

- Read the full build log in the **Builds** tab.
- Verify the **Docker File** path and **Docker Build Context** in the [Config](/products/docker-capsule/configure/) tab.
- Test locally: `docker build -f <dockerfile-path> <context-path>`

### Auto-deploy not triggering

- Verify **auto-deploy** has not been turned off on the [Deploy](/products/docker-capsule/deploy/#auto-deploy) tab.
- Confirm you pushed to the branch linked to the capsule, not a different branch.
- Check that no other build is already running.

### Cannot start a new build

- Wait for the current build to finish or cancel it.

If the build succeeds but your application does not work at runtime, see [Logs](/products/docker-capsule/logs/) and [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/).
