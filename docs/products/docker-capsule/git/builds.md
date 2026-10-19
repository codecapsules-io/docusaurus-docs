---
slug: "/products/docker-capsule/git/builds"
description: "Build a Docker Capsule from Git on Code Capsules: manual builds, auto-deploy on push, Dockerfile path and build context, and fixing failed builds."
title: "How to Build Docker Images From Git"
sidebar_label: "Builds & Auto-deploy"
---

# Build and Auto-Deploy Your Dockerfile From Git

When your Docker Capsule is [deployed from Git](/products/docker-capsule/git/deploy/), Code Capsules builds a new image from your repository each time a build starts, then deploys it. This page covers how builds are triggered and configured.

For build history, logs, and rollback, see [Deployments](/products/docker-capsule/deployments/).

## How builds work

When a build starts, Code Capsules:

1. Clones your linked Git repository at the configured branch
2. Runs `docker build` using your **Docker File** path and **Docker Build Context** — see [Dockerfile path and build context](#dockerfile-path-and-build-context)
3. Stores the completed build
4. Automatically runs your capsule on success

A Git repository must be linked before you can build. Private repositories are supported when your version control account has been connected to Code Capsules.

## Trigger a build

### Initial build on creation

When a Docker Capsule is created with a linked repository, Code Capsules automatically starts a fresh first build. No manual action is required.

### Manual build

1. Open the **Deploy** tab on your Docker Capsule.
2. Click **Build & Deploy**, then confirm.
3. Open the **Builds** tab to follow the build log.

Manual builds work regardless of the **auto-deploy** setting.

### Auto-deploy

**Auto-deploy** controls whether Code Capsules automatically rebuilds your capsule when you push commits to the linked Git branch. It is **enabled by default**.

| Setting          | Behavior                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| **On** (default) | Each push to the linked branch triggers a new build                     |
| **Off**          | Git pushes are ignored; trigger builds manually with **Build & Deploy** |

Toggle auto-deploy with the switch in the **Auto Build & Deploy** section of the **Deploy** tab.

## Repository and branch

The **Capsule Source** section on the **Deploy** tab shows the linked **Repo** and **Branch**. Click **Edit** to change the repository or branch. Saving a new repository or branch starts a new build.

To deploy an existing image instead, create a new Docker Capsule with **Container image** as the source. You can't change the source of an existing capsule.

## Dockerfile path and build context

Set the **Docker File** path and **Docker Build Context** in the **Build** part of the **Capsule Parameters** section in the **Config** tab. Changing either one starts a new build. See [Docker File](/products/docker-capsule/configure/#docker-file) and [Docker Build Context](/products/docker-capsule/configure/#docker-build-context) for examples, including monorepo layouts.

## Troubleshooting builds

### Build fails immediately

- Confirm a repository is linked to the capsule.
- Check that the linked branch exists and contains your Dockerfile.

### Docker build errors

- Read the full build log in the **Builds** tab.
- Verify the [Docker File](/products/docker-capsule/configure/#docker-file) path and [Docker Build Context](/products/docker-capsule/configure/#docker-build-context) in the **Config** tab.
- Test locally: `docker build -f <dockerfile-path> <context-path>`

### Missing files in build context

If your Dockerfile references files outside the configured build context, the build fails. Check the [Docker Build Context](/products/docker-capsule/configure/#docker-build-context) in the **Config** tab, or move the files inside the context.

### Auto-deploy not triggering

- Verify [auto-deploy](#auto-deploy) has not been turned off.
- Confirm you pushed to the branch linked to the capsule, not a different branch.
- Check that no other build is already running.

If the build succeeds but your application does not work at runtime, see [Logs](/products/docker-capsule/logs/) and [Container requirements](/products/docker-capsule/container-requirements/).
