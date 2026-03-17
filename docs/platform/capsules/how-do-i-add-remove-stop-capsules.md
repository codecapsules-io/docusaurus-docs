---
slug: "/platform/capsules/how-do-i-add-remove-stop-capsules"
---

# Add, Remove, and Turn Off Capsules

## Add a Capsule

To add a new Capsule, click the yellow **+** button in the bottom-left corner of the dashboard and select **New Capsule**.

![Create a Capsule](/gitbook-assets/platform/add-capsule.png)

Choose the **Capsule Type**, **Team**, and **Space**. Click **Next** to confirm.

![Enter Capsule Details](/gitbook-assets/platform/platform/capsules/capsule-details.png)

### Configure the Plan

Configure the Capsule's resources by choosing a plan. To customize resources to suit your needs, select **Custom** and move the sliders to increase or decrease **CPU**, **RAM**, and **Replica Scale**. Click **Next**.

![Choose Capsule Plan](/gitbook-assets/platform/platform/billing/capsule-plan-1.png)

### Connect to a Repo

Code Capsules connects to your version control provider to deploy applications from your repositories. You need to give Code Capsules permission to access the repository you want to use.

To connect a Capsule to your repository:

1. Select the repository from the dropdown. If you haven't yet linked your Code Capsules account to a version control provider, click **Configure Git for Code Capsules** and follow the prompts.
2. Select the branch to deploy from.
3. Select the folder the Capsule will build from, or leave this field blank to build from the root of the branch.

![Connect a Repository](/gitbook-assets/platform/platform/capsules/connect-a-repo.png)

### Configure the Capsule

Capsule-specific settings depend on the type of Capsule you're creating. For example, if you're adding a Frontend Capsule, you'll specify a build command, the path to the project's static files, and a name.

Click **Create Capsule** to complete the setup.

![Capsule-Specific Settings](/gitbook-assets/platform/platform/capsules/capsule-specific-settings.png)

## Remove a Capsule

To delete a Capsule, navigate to the **Capsule Details** page, scroll to the end, and click **Remove Capsule**.

![Delete Capsule](/gitbook-assets/platform/delete-capsule.png)

In the confirmation dialog, enter the Capsule's name and click **Delete**.


:::danger

You cannot reverse this action. The Capsule cannot be recovered once deleted.

:::


## Turn Off a Capsule

To turn off a Capsule, toggle the switch at the top-right corner of the **Capsule Details** page.

![Turn Off a Capsule](/gitbook-assets/platform/capsule-toggle-button.png)

Turning a Capsule off is useful when adding or updating environment variables. You’ll need to restart the Capsule after a few seconds for the changes to take effect.

You can also turn off a Capsule during periods of inactivity to reduce costs.
