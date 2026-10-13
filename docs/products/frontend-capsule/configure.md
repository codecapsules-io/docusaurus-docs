---
slug: "/products/frontend-capsule/configure"
description: "To configure your Frontend Capsule, navigate to the \"Config\" tab."
title: "How to Configure a Frontend App"
sidebar_label: "Configure"
---

# Configure Your Frontend App

To configure your Frontend Capsule, navigate to the "Config" tab.

![Configure Frontend Capsule](/gitbook-assets/products/frontend-capsule/config/frontend-config.png)

## Set Capsule Parameters

Frontend settings are in the **Build** part of the **Capsule Parameters** section. To change them:

1. Click **Edit** next to **Build**.
2. Update the settings.
3. Click **Save**, then confirm.

Saving starts a new build.

### Project Path

The **Project Path** is where your HTML files are located. The default is `/`, which works for most projects.

### Build Command

The **Build command** runs your build. The default is `Auto`, which automatically detects and runs your build process.

### Build Output Directory

The **Build Output Directory** is where your built files end up. Leave it as `/` if you're not using a build process.

## Environment Variables

Frontend Capsules automatically get these environment variables:
- `APP_URL` - Your capsule's public URL

To view variable values, click "show" in the "Environment Variables" section.

To add custom variables:

1. Click "Key/Val Editor" or "Text Editor" in the "Environment Variables" section
2. Edit the variable "Name" and "Value"
3. Click "Save"
