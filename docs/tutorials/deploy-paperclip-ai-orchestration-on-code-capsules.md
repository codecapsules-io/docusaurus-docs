---
slug: "/tutorials/deploy-paperclip-ai-orchestration-on-code-capsules"
description: >-
  Deploy Paperclip — the open-source AI agent orchestration platform — on Code
  Capsules using a Docker Capsule, PostgreSQL Database Capsule, and Persistent
  Storage Capsule.
---

# Deploy Paperclip AI Orchestration on Code Capsules

[Paperclip](https://paperclip.ing) is an open-source orchestration platform for AI agents. It gives you a company structure — org charts, goals, budgets, and scheduled heartbeats — for running agents like Claude, Codex, and Gemini autonomously. Think of it as the control plane that turns individual AI agents into a coordinated team.

In this tutorial we'll fork Paperclip, apply fixes required for cloud deployment, and deploy it on Code Capsules using three capsules: a Docker Capsule for the app, a PostgreSQL Database Capsule for persistence, and a Persistent Storage Capsule for configuration and file uploads.

## Prerequisites

* A [Code Capsules](https://codecapsules.io) account
* A GitHub account
* An Anthropic API key (if you plan to use Claude as an agent)

## Step 1 — Fork the Paperclip Repository

Navigate to [https://github.com/paperclipai/paperclip](https://github.com/paperclipai/paperclip) and fork it into your GitHub account. Clone your fork locally:

```bash
git clone https://github.com/your-username/paperclip.git
cd paperclip
```

## Step 2 — Fix the Dockerfile

The upstream Dockerfile includes a hardcoded SHA256 checksum for the GitHub CLI GPG key. This checksum goes stale whenever GitHub rotates the key, causing cloud builds to fail with an error like:

```
sha256sum: WARNING: 1 computed checksum did NOT match
error building image: exit status 1
```

The fix is to remove the checksum line. The download is already secured by HTTPS, and the GPG key itself verifies every package installed from the GitHub CLI apt repository — so removing the redundant checksum check doesn't weaken security.

Open `Dockerfile` and remove this line from the `base` stage:

```dockerfile
# Remove this line:
&& echo "20e0125d6f6e077a9ad46f03371bc26d90b04939fb95170f5a1905099cc6bcc0  /etc/apt/keyrings/githubcli-archive-keyring.gpg" | sha256sum -c - \
```

The relevant section should look like this afterwards:

```dockerfile
&& wget -nv -O/etc/apt/keyrings/githubcli-archive-keyring.gpg https://cli.github.com/packages/githubcli-archive-keyring.gpg \
&& chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
```

## Step 3 — Update the Entrypoint Script

Paperclip's normal setup flow uses an interactive `onboard` CLI command which can't run in a cloud environment. We need to update `scripts/docker-entrypoint.sh` to handle three things automatically on startup:

1. Create a valid `config.json` from environment variables if one doesn't exist yet
2. Fix directory ownership so the `node` user can write logs and data
3. Run the bootstrap command to generate the first admin invite URL, which will appear in the capsule logs

Replace the contents of `scripts/docker-entrypoint.sh` with the following:

```sh
#!/bin/sh
set -e

# Capture runtime UID/GID from environment variables, defaulting to 1000
PUID=${USER_UID:-1000}
PGID=${USER_GID:-1000}

# Adjust the node user's UID/GID if they differ from the runtime request
changed=0

if [ "$(id -u node)" -ne "$PUID" ]; then
    echo "Updating node UID to $PUID"
    usermod -o -u "$PUID" node
    changed=1
fi

if [ "$(id -g node)" -ne "$PGID" ]; then
    echo "Updating node GID to $PGID"
    groupmod -o -g "$PGID" node
    usermod -g "$PGID" node
    changed=1
fi

if [ "$changed" = "1" ]; then
    chown -R node:node /paperclip
fi

# Create minimal config.json from environment variables if it doesn't exist yet.
# This replaces the interactive `paperclipai onboard` step for cloud deployments.
CONFIG_PATH="${PAPERCLIP_CONFIG:-/paperclip/instances/default/config.json}"
if [ ! -f "$CONFIG_PATH" ]; then
  echo "--- Creating Paperclip config at $CONFIG_PATH ---"
  mkdir -p "$(dirname "$CONFIG_PATH")"
  cat > "$CONFIG_PATH" <<EOF
{
  "\$meta": {
    "version": 1,
    "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "source": "onboard"
  },
  "database": {
    "mode": "postgres",
    "connectionString": "${DATABASE_URL}"
  },
  "logging": {
    "mode": "file"
  },
  "server": {
    "deploymentMode": "authenticated",
    "exposure": "private"
  },
  "auth": {},
  "telemetry": {},
  "storage": {},
  "secrets": {}
}
EOF
  chown -R node:node "${PAPERCLIP_HOME:-/paperclip}"
fi

# Generate first admin invite URL if no admin exists yet.
# Safe to run on every boot — skips silently once an admin account has been created.
# The invite URL will appear in logs on first boot.
echo "--- Paperclip bootstrap starting ---"
gosu node node --import ./server/node_modules/tsx/dist/loader.mjs cli/src/index.js auth bootstrap-ceo 2>&1 || true
echo "--- Paperclip bootstrap complete ---"

exec gosu node "$@"
```

Commit both changes:

```bash
git add Dockerfile scripts/docker-entrypoint.sh
git commit -m "fix: cloud deployment fixes for Code Capsules"
git push
```

## Step 4 — Generate a Better Auth Secret

Paperclip uses [Better Auth](https://better-auth.com) — an open-source authentication library — to secure its admin UI. You don't need to sign up for anything. Better Auth runs entirely inside your container and only needs a secret string to sign session tokens.

Generate one now:

```bash
openssl rand -base64 32
```

Copy the output. You'll use it as the `BETTER_AUTH_SECRET` environment variable in the next steps.

## Step 5 — Create a PostgreSQL Database Capsule

Log in to Code Capsules, navigate to your Space, and click the yellow **+** button. Select **New Capsule** and choose **Database Capsule**, then select **PostgreSQL**.

Create the capsule. Code Capsules will automatically inject a `DATABASE_URL` environment variable into any capsule you bind it to.

## Step 6 — Create a Persistent Storage Capsule

Click **+** again and create a **Persistent Storage** capsule. This will store Paperclip's configuration files and local file uploads between deployments.

## Step 7 — Create the Docker Capsule

Click **+** and create a **Backend Capsule**. When prompted for the source, select your forked Paperclip repository and the `main` branch.

Leave the **Run Command** blank — the Dockerfile already defines the `ENTRYPOINT` and `CMD`.

Add the following environment variables before the first deploy:

| Variable | Value |
|---|---|
| `BETTER_AUTH_SECRET` | The string you generated in Step 4 |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `PAPERCLIP_PUBLIC_URL` | Your capsule URL (e.g. `https://paperclip-eopf.aws-eu-1.ccdns.co`) |

Then bind your capsules:

1. **Bind the Database Capsule** — Code Capsules injects `DATABASE_URL` automatically.
2. **Bind the Persistent Storage Capsule** — Code Capsules injects `PERSISTENT_STORAGE_DIR` automatically.

## Step 8 — Set the Allowed Hostname

Once the capsule builds and starts, Paperclip will block requests from unrecognised hostnames with an error like:

```
Hostname 'paperclip-eopf.aws-eu-1.ccdns.co' is not allowed for this Paperclip instance.
```

Code Capsules has no SSH or console access, so set this via environment variable:

| Variable | Value |
|---|---|
| `PAPERCLIP_ALLOWED_HOSTNAMES` | Your capsule hostname (e.g. `paperclip-eopf.aws-eu-1.ccdns.co`) |

Save and restart the capsule. No rebuild is required — environment variable changes trigger a restart automatically.

If you add a custom domain later, add it to the same variable as a comma-separated list:

```
paperclip-eopf.aws-eu-1.ccdns.co,paperclip.yourdomain.com
```

## Step 9 — Get the First Admin Invite URL from Logs

Because there is no interactive console on Code Capsules, the entrypoint script automatically runs the bootstrap command on every startup and prints the invite URL to the logs.

Open the **Logs** tab in your capsule dashboard and search for `Invite URL:`. You'll see something like:

```
--- Paperclip bootstrap starting ---
✔ Created bootstrap CEO invite.
  Invite URL: https://paperclip-eopf.aws-eu-1.ccdns.co/invite/pcp_bootstrap_abc123...
  Expires: 2026-04-19T13:00:00.000Z
--- Paperclip bootstrap complete ---
```

Open the invite URL in your browser to create your first admin account. The invite expires after 72 hours. On subsequent restarts, the bootstrap step will log `Instance already has an admin user` and skip silently.

## Step 10 — Access Your Paperclip Instance

Once logged in, you'll land on the Paperclip dashboard where you can:

* Create a **Company** with goals and an org structure
* Add **Employees** (AI agents) using adapters for Claude, Codex, Gemini, and others
* Set up **Heartbeats** to run agents on a schedule
* Track task history, token budgets, and audit logs

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | Random secret for signing user sessions. Generate with `openssl rand -base64 32`. |
| `ANTHROPIC_API_KEY` | If using Claude | API key for the Claude/Claude Code adapter. |
| `PAPERCLIP_PUBLIC_URL` | Yes | Full public URL of your capsule. Used to construct the admin invite URL. |
| `PAPERCLIP_ALLOWED_HOSTNAMES` | Yes | Comma-separated list of hostnames allowed to access this instance. |
| `DATABASE_URL` | Auto-injected | Injected by Code Capsules when the PostgreSQL Database Capsule is bound. |
| `PERSISTENT_STORAGE_DIR` | Auto-injected | Injected by Code Capsules when the Persistent Storage Capsule is bound. |

## What's Running

The Paperclip Docker image is a multi-stage build that:

1. Installs system dependencies including the GitHub CLI (`gh`) and Python
2. Installs all workspace packages via pnpm
3. Builds the React UI, plugin SDK, and Express server
4. Installs Claude Code, Codex, and OpenCode globally so agent adapters can invoke them
5. Creates `config.json` from environment variables on first boot
6. Runs the bootstrap command to generate an admin invite URL (visible in logs)
7. Starts the server on port 3100, serving both the API and UI from the same process

The server runs in `authenticated` mode, meaning all access requires a logged-in account.
