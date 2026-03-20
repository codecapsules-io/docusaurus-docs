---
slug: "/backend/python/python-discord-bot"
description: A guide to deploying a Python Discord Bot from GitHub.
---

# Python Discord Bot

Deploy a Python Discord Bot and learn how to host backend code on Code Capsules.

## Setup

Code Capsules connects to GitHub repositories to deploy applications. To follow this guide, you'll need a [Code Capsules](https://codecapsules.io/) account and a [GitHub](https://github.com/) account.

To demonstrate how to deploy a Python Discord Bot with Code Capsules, we've provided an example bot, which you can find on the [Code Capsules GitHub repository](https://github.com/codecapsules-io/python-discord-echobot).

Sign in to GitHub, and fork the example bot repository by clicking **Fork** at the top-right of your screen and selecting your GitHub account as the destination.

## Register the Bot

You'll need a Discord user account before you can create a Discord bot. Head over to Discord and create an account if you don't already have one.

When you've signed in to Discord, follow the steps below:

1.  Click on the **+** icon in the left toolbar to create a server to contain your channels.

    ![](/gitbook-assets/get-started/plus-icon.png)
2. Navigate to the [Application Page](https://discord.com/developers/applications).
3. Click on the **New Application** button.
4. Give the application a name and click **Create**.
5.  Go to the **Bot** tab and click **Add Bot**.

    ![](/gitbook-assets/get-started/add-bot.png)
6.  Scroll down to **Privileged Gateway Intents** and enable **Message Content Intent**. Click **Save Changes**.

7.  Click **Reset Token**, confirm the reset, then click **Copy** to copy your bot's token.

    ![](/gitbook-assets/get-started/token.png)
8.  Go to the **OAuth2/URL Generator** tab and select the **bot** option under the **Scopes** section.

    ![](/gitbook-assets/get-started/bot-option.png)
9.  Select all the text permission options under the **Bot Permissions** section.

    ![](/gitbook-assets/get-started/text-permissions.png)
10.  Click the **Copy** button under the **Generated URL** section.

    ![](/gitbook-assets/get-started/url.png)
11. Paste the URL you copied in the previous step in another browser tab and add the bot to the server you created in the first step. Click **Continue** to confirm your changes.

After actioning these steps, your bot will now have access to all the channels in the server you added it to.

## Create a Space for Your App

Log in to your Code Capsules account and navigate to the **Spaces** tab. Once there, click the yellow `+` icon on the bottom left of the screen to add a new Space.

Follow the prompts, choosing your region and giving your Space a name, then click **Create Space**.

![Create a Space](/gitbook-assets/get-started/space-name-1.png)

## Create the Capsule

A [Capsule](/platform/capsules/what-is-a-capsule) provides the server for hosting an application on Code Capsules.

To create a new Capsule for your Space, follow the instructions below:

1. Choose **Backend Capsule**, your Team, and Space.
2. Choose your payment plan.
3. Click the GitHub button and give access to the repository you forked at the start of the tutorial.
4. Choose the GitHub repository you forked.
5. Press **Next**.
6. Leave **Run Command** blank.
7. Click **Create Capsule**.

Code Capsules will automatically build your application when you've finished creating the Capsule.

Once your application is live, you can view the build log by selecting the **Deploy** tab and clicking the **View build log** link in the **Builds** section.

![Build Logs](/gitbook-assets/get-started/backend-capsule-build-logs-1.png)

## Add a `TOKEN` Environment Variable

Once the build is complete, you have to add a `TOKEN` environment variable on the **Config** tab under the **Environment Variables** section. Assign it the value of the token you copied in step 7 of the [Register the Bot](/backend/python/python-discord-bot#register-the-bot) section above.

![Token Environment Variable](/gitbook-assets/get-started/token-env-variable-1.png)

Confirm your changes by clicking on **Save**, then restart your Capsule by toggling the radio button in the top right off and on again.

## Chat with the Bot

The bot will be able to respond to messages after Code Capsules finishes building it. When this is done, you can send a message to any channel in the server you added it to, and the bot will echo it back.

If you'd like to deploy another application in a different language or framework, take a look at our other [deployment guides](/).
