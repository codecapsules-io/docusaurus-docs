---
slug: '/products/docker-capsule/builds'
description: >-
  Manage Docker Capsule builds, auto-build from Git, and roll back to previous
  builds.
---

# Builds

Docker Capsules are built from your Git repository using your configured Dockerfile. Code Capsules manages the build pipeline and automatically runs the capsule when a build succeeds.

## How builds work

When a build starts, Code Capsules:

1. Clones your linked Git repository at the configured branch
2. Runs `docker build` using your **Dockerfile path** and **Build context** — see [Configure](/products/docker-capsule/configure/)
3. Stores the completed build
4. Automatically runs your capsule on success

Specific older builds can be restored for rollbacks. Code Capsules may only retain a certain number of builds per capsule depending on the region and setup.

A Git repository must be linked before you can build. Private repositories are supported when your GitHub account has been connected to Code Capsules.

## Trigger a build

### Initial build on creation

When a buildable capsule is created with a linked repository, Code Capsules automatically starts a fresh first build. No manual action is required.

### Manual build

1. Open the **Deploy** tab on your Docker Capsule.
2. Click **Build** or **Rebuild**.
3. Click **View build progress** to follow the build log.

Manual builds work regardless of the **auto-build** setting.

### Auto-build from Git

**Auto-build** is enabled by default. Push a commit to the linked branch to trigger a build automatically, then monitor progress in the **Deploy** tab.

To disable or re-enable auto-build, see [Configure](/products/docker-capsule/configure/#auto-build).

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

Build logs are available in the **Deploy** tab:

- **During a build** — click **View build progress**
- **After completion** — open the **Builds** section and click **View build log** on a specific build

![Build Logs](/gitbook-assets/get-started/docker-build.png)

## Build history and rollback

The **Deploy** tab lists your capsule's build history. Each entry shows the build status, timestamp, and whether it was triggered manually or by a Git push.

To roll back, find the build you want to restore and run it on the capsule. Rolling back uses an existing build — it does not trigger a new build.

Successful builds run the capsule automatically using your configured [deployment strategy](/products/docker-capsule/configure/#deployment-strategy).

## Troubleshooting builds

### Build fails immediately

- Confirm a repository is linked to the capsule.
- Check that the linked branch exists and contains your Dockerfile.

### Docker build errors

- Read the full build log for the specific Docker error.
- Verify the **Dockerfile path** and **Build context** in the [Config](/products/docker-capsule/configure/) tab.
- Test locally: `docker build -f <dockerfile-path> <context-path>`

### Auto-build not triggering

- Verify **auto-build** has not been disabled in the [Config](/products/docker-capsule/configure/#auto-build) tab.
- Confirm you pushed to the branch linked to the capsule, not a different branch.
- Check that no other build is already running.

### Cannot start a new build

- Wait for the current build to finish or cancel it.

If the build succeeds but your application does not work at runtime, see [Logs](/products/docker-capsule/logs/) and [Writing a Dockerfile](/products/docker-capsule/writing-a-dockerfile/).
