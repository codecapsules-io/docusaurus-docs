---
slug: "/tutorials/how-to-simply-host-a-production-wordpress-blog"
cover: /gitbook-assets/tutorials/wordpress-hosting-cover-v2.jpg
---

# How to (Simply) Host a Production WordPress Blog


The Amazon Web Services (AWS) WordPress reference architecture has become a meme in DevOps circles. The 2018 [best practices whitepaper](https://aws.amazon.com/blogs/architecture/wordpress-best-practices-on-aws/) recommends you use 11 services costing $500 to $1,500 monthly, and assumes you have dedicated DevOps staff. The alternative is to use a single Amazon Lightsail instance, where you handle operating system (OS) updates, security hardening, and MySQL tuning yourself.

![WordPress hosting complexity versus simplicity](https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2Fgit-blob-304d5fa2432c84923f263aae924c5c55d201a14b%2Fwordpress-complexity-vs-simplicity.png?alt=media)

WordPress production sites need infrastructure that is reliable enough to handle traffic spikes and hardware failures, yet simple enough to manage without a DevOps team.

This guide demonstrates how to run a production WordPress site with:

* Separate application, database, and storage layers
* One-click migration between staging and production environments
* Automatic scaling for traffic spikes
* Infrastructure-level backups

You'll learn how to deploy WordPress infrastructure, configure a content review workflow, and set up production operations for backing up, scaling, and monitoring your data.

## The WordPress Production Problem

In a development team, the workflow for releasing changes usually looks like this:

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2Fgit-blob-bfe7d36e717a2191901fae5f260d63de8de2e998%2Fdeveloper-workflow.png?alt=media" alt="" /><figcaption></figcaption></figure>

Your developers write code locally, commit to GitHub, run automated tests, and deploy changes to staging for review. Only after stakeholder approval does anything touch production. Every change is tracked, every deployment is reversible, and nothing reaches your live site without multiple checkpoints.

WordPress doesn't work this way.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2Fgit-blob-4090574bedef5ef5520bdaba60bb2ab6a274b45a%2Fwordpress-workflow.png?alt=media" alt="" /><figcaption></figcaption></figure>

WordPress splits data between files and the database, breaking Git workflows:

* You can commit theme changes to Git, but blog posts aren't in your repository.
* You can deploy code via a continuous integration and continuous delivery (CI/CD) pipeline, but you need to make database changes directly in the production site, via the WordPress admin dashboard.
* You can run tests on your code, but there's no automated testing for scenarios such as when someone installs a plugin that conflicts with your theme.
* You can roll back a bad deployment, but WordPress only rolls back file-system changes; database modifications remain, so you can't recover from bad content changes.

The split between files and the database causes production problems, like in these scenarios:

* Marketing installs a plugin on production. It conflicts with your theme, and the site breaks during business hours.
* A content creator deletes a popular post. You can't recover it because there is no Git history for database content.
* You want to test WordPress core updates on staging, but staging content is days behind production.

Your infrastructure may have version control and staging environments, but WordPress breaks standard workflows. Version control can't track database content, and staging environments drift out of sync with production without custom synchronization tooling.

WordPress migration, backups, and staging workflows each require specific approaches to work reliably in production.

## What You Need To Know

Due to these WordPress limitations, here's what you need to know to host a production WordPress site simply:

* **Separate Your WordPress Layers from the Start:** WordPress, MySQL, and file storage should run independently. When one layer fails or requires scaling, the others continue to operate.
* **Plan for Staging-to-Production Workflows:** WordPress has no built-in mechanism for migrating between environments. Either set up a plugin-based migration (which costs $99 to $299 per year with manual configuration) or use a hosting platform, like Code Capsules, that offers built-in one-click migrations. Without this, you have to recreate approved content manually or risk breaking production with direct edits.
* **Match Infrastructure to Your Team's Capacity:** A self-hosted VPS (starting from $10 per month) requires you to handle security patches, backups, and scaling. Managed WordPress removes operational work but limits flexibility and costs more (an average of $50 per month for basic plans). Always choose based on whether you have DevOps resources.

### Hosting Options For WordPress Sites

WordPress hosting options range from $5 single-server VPS setups to $1,500 AWS enterprise architectures:

* Self-hosted VPS provides complete control but requires Linux administration and manual backup management.
* AWS delivers maximum reliability but needs dedicated DevOps staff to manage 11 separate services.
* Managed WordPress providers remove server management but limit customization, and cost $35 to $100 per month.

For a detailed comparison of hosting costs and trade-offs, see our [WordPress Hosting Cost Comparison](https://github.com/codecapsules-io/codecapsules-docs/blob/main/tutorials/link/README.md).





### Why Code Capsules Works Well for WordPress Hosting

Code Capsules solves the primary challenges of hosting a WordPress production site:

* Separate infrastructure layers prevent single points of failure.
* Built-in migration eliminates $99-$299 annual plugin costs.
* Infrastructure-level backups keep databases and files synchronized.

WordPress production environments require content review workflows. Writers create posts in staging, editors review and approve them, and then the changes migrate to production. WordPress provides no built-in migration mechanism. Plugin-based solutions like WP Synchro incur licensing costs, require API key management, and you still need to manually select which files and database tables to migrate.

Code Capsules provides one-click migration between staging and production WordPress Capsules, automatically handling database synchronization, file transfers, and URL updates.

## Prerequisites

To follow this tutorial, you need:

* A Code Capsules account
* Some knowledge of WordPress configuration, as you will create an admin user

### Create a Space for Hosting Your WordPress Blog on Code Capsules

Spaces organize related Capsules.

On your Code Capsules dashboard, navigate to the **Spaces** tab and click the **+** button to create a new Space.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2Fyrz0nFOE8YRoUtqvsZm6%2Fcreate-space-button.png?alt=media&#x26;token=64a276de-b97c-470f-9c01-08e75db27c89" alt="" /><figcaption></figcaption></figure>

Fill in the Space details and select the region closest to your target users to reduce latency for your visitors.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2F7Tj8QUU0aTvpweQS45qI%2Fspace-details-form.png?alt=media&#x26;token=e7c8c462-3d78-423e-aa05-c52c2ae0b37a" alt="" /><figcaption></figcaption></figure>

## Setting Up the WordPress Staging Site

We'll create two application Capsules in this space: one for the staging site, and one for the production site. Let's begin with staging.

### Create the WordPress Capsule

Next, you need a WordPress Capsule to serve as your staging environment.

Follow the [WordPress Capsule deployment guide](/products/wordpress-capsule/deploy) to set up:

* A WordPress application Capsule running the latest WordPress version
* A MySQL Database Capsule storing posts, users, and settings
* A Storage Capsule handling uploaded media files
* A default URL like `your-wordpress-slug.ccdns.co`

### Configure Your Domain (Optional)

After deploying the WordPress Capsule, you'll see a default URL like `wordpress-slug.ccdns.co`. You can configure a custom domain for cleaner URLs.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FQ4M7G3kd8vGAl6FPwmSc%2Fwordpress-default-url.png?alt=media&#x26;token=fcf08d53-054d-4670-aaaa-acf3e68c6013" alt="" /><figcaption></figcaption></figure>

Navigate to the **Domains** tab and click **+** to add a domain.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FSOsORlLz6LKAbQd6phEC%2Fadd-custom-domain-button.png?alt=media&#x26;token=a8bc13d3-2e54-46ad-83c8-552a38a989ff" alt="" /><figcaption></figcaption></figure>

On the domain configuration page, enter your staging domain, for example, `staging.blog.yourdomain.com`.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FkUuuo0wFnVnp2NcYugea%2Fcustom-domain-entry.png?alt=media&#x26;token=fda311eb-d0cb-4166-ae72-f60c7c0d7e4e" alt="" /><figcaption></figcaption></figure>

Code Capsules provides DNS instructions. Create a CNAME or ALIAS record with your DNS provider pointing to the provided hostname.

### Build the Site Structure in WordPress

After creating the Capsules, you need to install the WordPress staging site. Visit your WordPress URL and select your language.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2F3eoe4I5s0bJPSa8y82ro%2Fwordpress-language-selection.png?alt=media&#x26;token=7bc46ffa-a0f7-450a-9cac-c14750af8771" alt="" /><figcaption></figcaption></figure>

Create your admin account. Use a strong password, since this account has full site access.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FF1LSV4rxAvQsWbniaaLw%2Fwordpress-admin-account-setup.png?alt=media&#x26;token=c9029916-d16f-4da0-9a98-272db8c05411" alt="" /><figcaption></figcaption></figure>

Once WordPress has been installed, you'll receive a success notification.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FWubf45S1db4Q4dCiwkwt%2Fwordpress-installation-success.png?alt=media&#x26;token=5ceff62e-b6ac-4d65-bda1-a54d0bcc744e" alt="" /><figcaption></figcaption></figure>

Click **Log In** to verify the installation and open the WordPress admin dashboard for your staging site.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FPmTFWCyCtIeQrJ2ibtCl%2Fwordpress-admin-dashboard.png?alt=media&#x26;token=1c16943d-870a-4620-b33e-e110bca4d6c8" alt="" /><figcaption></figcaption></figure>

Navigate to the website homepage. The WordPress Capsule sets up a default homepage similar to the following:

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FpVLfKcWMHIjhqiJ86nIM%2Fwordpress-default-homepage.png?alt=media&#x26;token=fe5d14b0-bdcf-4e9a-aa1e-b29ca45e15eb" alt="" /><figcaption></figcaption></figure>

Code Capsules includes three default WordPress themes, Twenty Twenty-Five (active in the screenshot), Twenty Twenty-Four, and Twenty Twenty-Three. These blog-focused templates display posts on the homepage by default.

To change themes, navigate to **Appearance** → **Themes**.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2Fa0UzaMMqXcCQm70Uvmgj%2Fwordpress-themes-page.png?alt=media&#x26;token=da84f9be-3b73-4c07-855a-7f31dac20de6" alt="" /><figcaption></figcaption></figure>

### Create User Accounts

To create user accounts, navigate to **Users** in the WordPress side panel and click **Add User**.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FrCIcH1pDRX03WmLaD1PB%2Fwordpress-add-new-user-button.png?alt=media&#x26;token=c2af0b17-636d-485f-87bb-3c1a5fcc0708" alt="" /><figcaption></figcaption></figure>

Fill the form with the user's information and select a role.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FmwuzoFIJNOYXOAoPDoOK%2Fwordpress-user-role-form.png?alt=media&#x26;token=e16ee0ac-4a08-4af5-a167-efc288436659" alt="" /><figcaption></figcaption></figure>

From the **Role** dropdown, select **Admin**, **Contributor**, **Editor**, or **Author**. These roles determine permissions for content creation and review in your staging-to-production workflow.

Your staging environment is ready. You can install themes, add plugins, and create content for review before pushing to production.

### Create a Sample Post

To demonstrate the content review workflow, create a sample blog post in your staging environment.

Navigate to **Posts** → **Add Post**.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2F845PmyzfMXzER82Zu4qZ%2Fwordpress-add-new-post.png?alt=media&#x26;token=785e1822-11bc-459a-ab6b-1c27231c1e83" alt="" /><figcaption></figcaption></figure>

Enter a post title and content. For this example, create a post titled `Welcome to Our Blog` with sample content about your company or services. Then, click **Publish** to make the post visible on your staging site. Visit your staging site to verify that the post appears.

## Setting Up the WordPress Production Site

Create a second WordPress Capsule for production using the same [WordPress Capsule deployment guide](/products/wordpress-capsule/deploy). Use clear naming to distinguish environments:

* **Capsule name:** `Production WordPress`
* **Database Capsule:** `Production WordPress Database`
* **Storage Capsule:** `Production WordPress Storage`
* **Domain:** `yourblog.com` (or `blog.yourdomain.com`)

This separates production data completely from staging. Changes in staging won't affect production until you explicitly migrate them.

## Migrating Content from Staging to Production with Code Capsules

In your production WordPress Capsule (the target Capsule), navigate to the **Migrate** tab. Select your staging WordPress Capsule as the **Source Capsule**.

Click **Start Migration**. Code Capsules copies your database content, uploaded media files, installed plugins, and theme configurations from staging to production.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FhGtkNPo3sdTPs0kMxT4J%2Fwordpress-migration-source-selection.png?alt=media&#x26;token=d21feb17-7d8c-4c71-9a63-67e926bc618a" alt="" /><figcaption></figcaption></figure>

After migration, the production environment contains the same content as the staging environment.

## Managing WordPress Production Sites with Code Capsules

A WordPress production site requires maintenance. Code Capsules provides features to help you maintain WordPress sites by:

* **Backing Up Site Data Regularly:** Ensure you can recover from hardware failures and other problems.
* **Enabling the Site To Scale as You Grow:** Adjust resources so that the site can handle spikes in user traffic.
* **Monitoring Performance and User Interactions:** Detect errors and resolve issues before they affect users.

### Create Backups

Because WordPress data is separated into database and file storage, you need to back up both simultaneously.

Code Capsules provides infrastructure-level backups using automatic daily snapshots with 30-day retention for your WordPress Database Capsule (containing the posts, users, and settings in the database) and Storage Capsule (containing the themes, plugins, and media in file storage).

Configure and manage your backups with the following guides:

* [**Database Capsule Backups**](/products/database-capsule/backups)**:** Configure retention and restore database snapshots.
* [**Storage Capsule Backups**](/products/storage-capsule/backups)**:** Manage your file storage backup settings.

Test backup restoration quarterly to verify that backups work when needed.

### Scale Your Site

Websites scale either horizontally (by adding more instances) or vertically (by adding more resources per instance). Code Capsules uses vertical scaling.

Code Capsules handles scaling by letting you allocate more resources to your Capsules:

* Open your WordPress Capsule and navigate to the **Scale** tab.
* Click **Edit**, select **Custom**, and use the slider to adjust the Capsule's allocated resources.

You can also set up scaling rules to automatically adjust the site's capacity based on traffic. To learn more, visit our [WordPress scaling documentation](/products/wordpress-capsule/scale).

### Observe and Monitor Your Site

Use the following Code Capsules capabilities to monitor your WordPress site.

* [**Monitoring**](/products/wordpress-capsule/monitor)**:** View real-time metrics for CPU, memory, and traffic. Identify performance trends and resource constraints.
* [**Logs**](/products/wordpress-capsule/logs)**:** Access application logs directly from the dashboard. Filter by severity, search for specific errors, and troubleshoot issues without server access.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FOEFdMBAzclrsFpYL3B1b%2Fwordpress-capsule-logs-interface.png?alt=media&#x26;token=f9691867-e6e6-4ea2-82e0-b0478b6101e8" alt="" /><figcaption></figcaption></figure>

* [**Access Logs**](/products/wordpress-capsule/logs)**:** Track actions performed by WordPress users in the admin interface.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2Fmxm9GS213B1bYb7hCNE9%2Fwordpress-access-logs-view.png?alt=media&#x26;token=7f575b6f-9443-4113-9211-b5634ab2c2b1" alt="" /><figcaption></figcaption></figure>

* [**Alerting**](/products/wordpress-capsule/alerting)**:** Configure alerts for high CPU usage, error rates, and downtime. Receive notifications via email or webhooks before users report problems.
* [**Metrics**](/products/wordpress-capsule/monitor)**:** Check resource usage on the machine.

<figure><img src="https://299067714-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FQxXPZz73XKehWd1HyCQn%2Fuploads%2FmypDJmIiZRUyWAIdFRQd%2Fwordpress-metrics-dashboard.png?alt=media&#x26;token=585ae837-2a3a-460d-870a-9a215d30e90a" alt="" /><figcaption></figcaption></figure>

### Best Practices in WordPress

A WordPress production site requires ongoing maintenance beyond infrastructure management:

* **Security:** Keep the WordPress core, themes, and plugins up to date. Security patches address vulnerabilities that attackers exploit.
* **Update Strategy:** WordPress releases regular updates. Code Capsules supports updates without issues, but always review changelogs before updating. Test updates on staging before applying to production.
* **Password Management:** Use strong, unique passwords for all WordPress accounts. Enable two-factor authentication where possible.
* **Backup Verification:** Test backup restoration quarterly to verify that backups work when needed.
* **Plugin Audits:** Review your installed plugins monthly. Remove unused plugins and update active ones.
* **Schedule Monitoring Tasks:** Review error logs and performance metrics weekly; test the staging-to-production migration workflow monthly; and audit the security and test backup restoration quarterly.

## Conclusion

You now know the three keys to hosting a production WordPress blog without single-server fragility or AWS enterprise complexity:

* Independent application, database, and storage layers
* A reliable staging-to-production workflow
* Scalable site management infrastructure

With separate Capsules for each layer of the site, built-in staging-to-production migration, and automatable scaling options, Code Capsules provides a simple hosting solution, so you can focus on creating content.
