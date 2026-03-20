---
slug: "/wordpress"
---

# WordPress

Deploy a WordPress application and learn how to host a content management system on Code Capsules.

## Setup

To follow this guide, you'll need a [Code Capsules](https://codecapsules.io/) account. WordPress can be downloaded and deployed automatically, or you can connect your Capsule to WordPress hosted on a GitHub repository.

## Create an Account with Code Capsules

Before creating your WordPress capsule, you'll need a Team and a Space. You can follow these guides to learn how to create [Teams](/platform/teams/what-is-a-team) and [Spaces](/platform/spaces/what-is-a-space).

If you already have a Team and Space set up, log in to your Code Capsules account. On the dashboard, click the yellow `+` on the bottom left of the screen, then click **New Capsule**.

![Create a Capsule](/gitbook-assets/get-started/add-capsule.png)

## Create the Capsule

A [Capsule](/platform/capsules/what-is-a-capsule) provides the server for hosting an application on Code Capsules.

To create a WordPress Capsule, first choose **WordPress** as the Capsule type, as well as your Team, and Space.

![Choose a Capsule Type](/gitbook-assets/get-started/wordpress-capsule-type.png)

Next choose your payment plan, or create a custom plan.

![Choose Plan](/gitbook-assets/get-started/wordpress-choose-plan.png)

A WordPress Capsule requires a connection to a MySQL Database Capsule as well as a Persistent Storage Capsule. Either select a previously created instance of each from the dropdowns, or click the yellow `+` next to each and follow the prompts for creating each Capsule. Click **Create Capsule**.

![Deploy Configuration](/gitbook-assets/get-started/wordpress-configure-capsule.png)

## Choose How to Deploy

### Default Deployment

To automatically download and deploy a WordPress version on Code Capsules:

1. Select the **Default** deployment type from the dropdown
2. Choose your WordPress version
3. Click **Next**

![Choose Wordpress Version](/gitbook-assets/get-started/wordpress-version.png)

### Git Managed

To deploy WordPress from your version control repository:

1. Select the **Git Managed** deployment type
2. Select a repository
3. Select the branch to deploy from
4. Click **Next**

![Choose repo](/gitbook-assets/get-started/wordpress-git-managed.png)

You can read more about connecting your account to a version control provider in [this guide](/platform/account/connect-version-control).

## Monitor Deployment

Code Capsules will automatically build and deploy your WordPress application. You can view the build log by selecting the **Logs** tab to monitor the deployment progress.

![Logs](/gitbook-assets/get-started/wordpress-logs.png)

Once the build is complete, click the URL link in the **Details** tab to access your WordPress site.

![URL](/gitbook-assets/get-started/wordpress-url.png)

## Set Up WordPress

When you first visit your WordPress site, you'll see the installation screen:

1. Enter your site title.
2. Create an admin username.
3. Set a strong password.
4. Provide your email address.
5. Click **Install WordPress**.

![Setup Wordpress Admin Account](/gitbook-assets/get-started/wordpress-setup.png)

After installation, you'll see the WordPress admin dashboard and can begin customizing your site.

![Welcome to Wordpress](/gitbook-assets/get-started/wordpress-welcome.png)

If you’d like to deploy another application in a different language or framework, take a look at our other [deployment guides](/wordpress).
