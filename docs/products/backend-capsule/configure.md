---
slug: "/products/backend-capsule/configure"
description: "Configure a Backend Capsule in the Config tab."
title: "How to Configure a Backend Application"
sidebar_label: "Configure"
---

# Configure Your Backend Application

Configure a Backend Capsule in the **Config** tab.

![Configure Backend Capsule](/gitbook-assets/products/backend-capsule/config/backend-config.png)

## Set Capsule Parameters

The **Capsule Parameters** section is split into **Build** and **Runtime**, each with its own **Edit** link:

| Section     | Settings                         | When you save                                  |
| ----------- | -------------------------------- | ---------------------------------------------- |
| **Build**   | Project Path, Run Command        | Rebuilds and deploys the capsule               |
| **Runtime** | Network Port, Health Check       | Restarts the capsule, without a new build      |

To change a setting:

1. Click **Edit** next to **Build** or **Runtime**.
2. Update the settings.
3. Click **Save**, then confirm.

You can edit one section at a time.

### Build settings

:::warning[Changing build settings starts a new build]

When you save a change in **Build**, Code Capsules rebuilds your code with the new settings and deploys the result. A build can take a few minutes.

:::

#### Project Path

The **Project Path** specifies the path to your code. The default is `/`, which works for most projects.

#### Run Command

Use the **Run Command** field to specify how to start your app. Leave this field empty to use the default command for the Capsule type, or enter a custom command:

- Python: `python app.py`
- Node.js: `npm start`
- Ruby: `ruby app.rb`

### Runtime settings

:::warning[Changing runtime settings restarts the capsule]

When you save a change in **Runtime**, Code Capsules restarts the capsule with the new settings. It does not start a new build.

:::

#### Network Port

The **Network Port** is the port your app runs on. Your app must be configured to listen on this port. The default is `3000`.

#### Health Check

A health check tells Code Capsules when your app is ready for traffic, and restarts replicas that stop responding. To set one:

1. In the **Capsule Parameters** section, click **Edit** next to **Runtime**.
2. Set **Health Check** to **Automatic** or **Manual**.
3. Enter the **Endpoint** your app responds to, for example `/health`. With **Manual**, also set **Timeout (seconds)** and **Time to First Check (seconds)**.
4. Click **Save**, then confirm.

See [Health checks](/platform/capsules/health-checks/) for each setting, how failing replicas are handled, and how to write a good endpoint.

## Set Environment Variables

Each Backend Capsule is automatically assigned an `APP_URL` environment variable that stores its public URL.

To view environment variable values, click **show** in the top-right corner of the table.

To add or edit custom variables:

1. Click **Key/Val Editor** or **Text Editor** in the top-right corner.
2. Enter or update the variable’s **Name** and **Value**.
3. Click **Save** to apply your changes.

## Connect Data Capsules

### Connect a Database Capsule

In the **Data capsules** section, click the **View** button next to a Database Capsule to see its connection details.

Click **+** next to the `Connection string` variable to create a `DATABASE_URL` environment variable in your Backend Capsule. Your application will use this variable to connect to and use the services provided by the Database Capsule.

### Connect a Persistent Storage Capsule

Click **Bind** next to the **Persistent Storage Capsule** to attach it to your Backend Capsule. 

During the bind process, Code Capsules creates a `PERSISTENT_STORAGE_DIR` environment variable that tells your Backend Capsule where to access the Persistent Storage Capsule.

