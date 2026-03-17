---
slug: "/products/agent-capsule/configure"
---

# Configure

Configure an Agent Capsule in the **Config** tab.

<figure><img src="/gitbook-assets/products/agentconfigpage-edited.png" alt="" /><figcaption><p>Agent Config Tab</p></figcaption></figure>

## Set Capsule Parameters

Click **Edit** in the **Capsule Parameters** section to set the Capsule's project path, network port, and run command.

### Project Path

The **Project Path** specifies the path to your code. The default is `/`, which works for most projects.

### Network Port

The **Network Port** is the port your app runs on. Your app must be configured to listen on this port. The default is `3000`.

### Run Command

Use the **Run Command** field to specify how to start your app. Leave this field empty to use the default command for the Capsule type, or enter a custom command:

* Python: `python app.py`
* Node.js: `npm start`


:::info

If using a [Code Capsules Agent Template](/products/agent-capsule/templates), the production ready command is `npm run start:prod` by default.

:::


## Set Agent Config

Click E**dit** in the **Agent Config** section to set the Capsule's provider, model, and API key.

### Provider

The **Provider** specifies the public AI provider to use for the capsule. This will expose a `PROVIDER_NAME` environment variable in the runtime of the capsule. Among a few pre-defined options, there is also the ability to set a **Custom** provider name, which your altered codebase will need to cater for.

### Model

The **Model** specifies the AI model to be used during the agent runtime. This will expose a `PROVIDER_MODEL` environment variable in the runtime of the capsule. Among a few pre-defined options per provider, there is also the ability to set a **Custom** model name, which your altered codebase will need to cater for.

### API Key

The **API Key** specified the key as provided by the AI **Provider**. This is issued outside of Code Capsules but are necessary for the agent to work, and will expose a `PROVIDER_API_KEY` environment variable in the runtime of the capsule.

## Set Environment Variables

Each Agent Capsule is automatically assigned an `APP_URL` environment variable that stores its public URL.

To view environment variable values, click **show** in the top-right corner of the table.

To add or edit custom variables:

1. Click **Key/Val Editor** or **Text Editor** in the top-right corner.
2. Enter or update the variable’s **Name** and **Value**.
3. Click **Save** to apply your changes.

## Connect Data Capsules

### Connect a Database Capsule

In the **Data capsules** section, click the **View** button next to a Database Capsule to see its connection details.

Click **+** next to the `Connection string` variable to create a `DATABASE_URL` environment variable in your Agent Capsule. Your application will use this variable to connect to and use the services provided by the Database Capsule.

### Connect a Persistent Storage Capsule

Click **Bind** next to the **Persistent Storage Capsule** to attach it to your Agent Capsule.

During the bind process, Code Capsules creates a `PERSISTENT_STORAGE_DIR` environment variable that tells your Agent Capsule where to access the Persistent Storage Capsule.
