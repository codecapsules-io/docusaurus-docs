---
slug: "/platform/git/connect-azure-devops"
title: "Connect Azure DevOps to Code Capsules"
description: "How to install the Code Capsules app for Azure DevOps, connect a repository, and deploy it as a Capsule."
sidebar_label: "Connect Azure DevOps"
---

# Connect Azure DevOps to Code Capsules

To deploy applications from Azure DevOps, install the Code Capsules app on your Azure DevOps organization and connect the repositories you want to deploy.

## Install the Code Capsules App

1. In the dashboard, navigate to **Repos**. Under **Git Providers**, find **Azure DevOps** and click **Install**.

![Install Azure DevOps](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-1.png)

2. Review the details, then click **Install Code Capsules on Azure DevOps**.

![Install Code Capsules on Azure DevOps](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-2.png)

:::info
This feature is only available for Microsoft Entra ID (work/school) accounts. Personal Microsoft accounts (MSA) aren't supported.
:::

## Sign In and Authorize Your Organization

You're redirected to Microsoft to sign in and authorize access to your Azure DevOps organization.

3. Sign into your Microsoft work/school account. If you aren't already signed in with your work/school account, click **Sign-in options**.

![Sign-in options](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-3.png)

4. Select **Sign in to an organisation**.

![Sign in to an organisation](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-4.png)

5. Enter your organization's domain name.
6. Click **Next**, then finish signing in with your Microsoft credentials.

![Find your organisation](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-5.png)

Once you're signed in, authorize Code Capsules to access your Azure DevOps organizations. Code Capsules can only ever access the organizations, projects, and repositories your account already has permission to see.

## Connect a Repository

Once installed, Azure DevOps shows as **Installed** under **Git Providers**, and your repositories appear under **Azure DevOps Repositories**.

7. Click **Connect** next to the repository you want to deploy.

![Connect a repository](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-6.png)

Connecting a repository installs Code Capsules' webhooks on it. This lets Code Capsules automatically redeploy the Capsule whenever you push new commits to the repository. Once connected, you are ready to link your repository to a capsule.

![Connected repository](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-7.png)

## Deploy the Repository

Connected repositories are now available whenever you create a Capsule.

8. When [creating a new Capsule](/platform/capsules/how-do-i-add-remove-stop-capsules/), select your repository from the **Git Repository** dropdown on the **Connect a Git Repository** step, and continue your Capsule creation as normal.

![Select your repository](/gitbook-assets/platform/platform/git/azure-dev-ops/git-azure-dev-ops-8.png)
