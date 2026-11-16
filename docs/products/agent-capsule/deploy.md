---
slug: "/products/agent-capsule/deploy"
description: "Deploy a configurable Agent Capsule on Code Capsules to run AI agents in production. Set environment variables, connect a repo, and ship in minutes."
title: "How to Deploy an AI Agent"
sidebar_label: "Deploy"
---

# Deploy Your AI Agent

Deploy a configurable Agent Capsule on Code Capsules.

## Set up

To follow this guide, you'll need:

- A [Code Capsules](https://www.codecapsules.io/) account with a Team and a Space. See [Teams](/platform/teams/what-is-a-team/) and [Spaces](/platform/spaces/what-is-a-space/) to learn how to create them.
- A [GitHub or GitLab account linked](/platform/account/connect-version-control/) to Code Capsules.
- A Git repository for your agent. If you're starting from a Code Capsules template, create your own copy of it first. See [Creating a New Agent](/products/agent-capsule/templates/#creating-a-new-agent).
- An API key from an AI provider, such as Google Gemini or Anthropic. Keep it ready, because you'll need to enter it during setup.

## Create the Capsule

1. Log in to Code Capsules. On the dashboard, click the yellow `+` in the bottom-left corner and click **New Capsule**. You can also click **Deploy Now** on the **AI Agent** card on the **Quick Start** page.

   ![Create a Capsule](/gitbook-assets/products/add-capsule.png)

2. Under **Choose a Capsule**, select **AI Agent**. Select your **Team** and your **Space**, then click **Next**.

   ![Create Agent Capsule](/gitbook-assets/products/createagentcapsule-edited.png)

3. On **Configure Plan**, choose a plan and click **Next**. Agent Capsules offer **Basic**, **Standard** and **Premium** plans. There is no custom plan option. You can [change the plan later](/products/agent-capsule/scale/).

   ![Choose Plan](/gitbook-assets/products/createagentscale-edited.png)

4. On **Connect a Git Repository**:
   1. Select your agent repository from the **Git Repository** list. Type part of the name to search. If the repository isn't listed, click **Configure Git for Code Capsules** and give Code Capsules access to it. If you created the repository after opening this page, reload the page so it appears.
   2. The **Branch** is filled in with your repository's default branch. Change it if you want to deploy from another branch.
   3. Leave **Repo subpath** empty unless your agent is in a subfolder of the repository.
   4. Click **Next**.

   :::note

   When you select a repository, Code Capsules shows "Repo will be automatically shared with your team", so everyone on the Team can use that repo for their own capsules. To change this later, see [Share a Repo with a Team](/platform/teams/share-a-repo-with-a-team/).

   :::

5. On **Template Setup**, keep **I am using a Code Capsules Agent template** switched on if your repository was created from one of the [agent templates](/products/agent-capsule/templates/). Then:
   1. Select a **Provider**, for example **Google GenAI**.
   2. Select a **Model**, or choose **Custom** and type the model name.
   3. Paste your provider **API Key**.
   4. Click **Next**.

   These values are saved as environment variables on the capsule, so you don't need to set them yourself. Learn how the templates use them in [Templates](/products/agent-capsule/templates/).

   ![Template Setup](/gitbook-assets/products/createagentconfig-edited.png)

6. On **Deploy**, check the **Run Command** and **Capsule Name**, then click **Create Capsule**.
   - **Run Command** is the command that starts your agent. It is pre-filled, for example `npm run start:prod` for the Base Agent template.
   - **Capsule Name** can be changed later from the **Details** tab.

Creating the capsule starts billing for the plan you chose.

## Monitor Deployment

Code Capsules automatically builds and deploys your Agent Capsule as soon as it's created.

1. On the capsule page, click the **Builds** tab.
2. The latest build is listed on the left with its status, for example **Building**. Click a build to view its log on the right.

   ![Build Logs](/gitbook-assets/products/agentbuildlogs-edited.png)

3. When the build's status changes to **Succeeded**, the agent is running.

## Chat With Your Agent

Once the build is complete, click the **Chat** tab and send your agent a message.

![Chat Tab](/gitbook-assets/products/agentchatpage-edited.png)

If you started from a template, the agent is usually limited to a specific purpose. Read the template's `README.md` to see what it can do. To make your own agent work with the Chat tab, see [Add a Chat Interface](/products/agent-capsule/chat/).
