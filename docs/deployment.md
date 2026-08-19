# Deployment Guide

## TV SALES & HOME — Hostinger Deployment

---

## Overview

Deployment uses GitHub Actions to build the Next.js application, transfer it to Hostinger via SSH + rsync, and restart it using PM2.

```
GitHub Actions
    │
    ├── npm run build
    ├── tar artifacts
    │
    └── SSH → Hostinger
              ├── rsync files
              ├── npm install --production
              └── pm2 restart <app-name>
                    │
                    └── Health check: GET /api/health
                          → { "status": "ok" }
```

---

## Environments

| Environment | Branch | PM2 App Name | Secret: Deploy Path |
|---|---|---|---|
| Development | `develop` | `tv-sales-dev` | `HOSTINGER_DEPLOY_PATH_DEV` |
| Staging | `staging` | `tv-sales-staging` | `HOSTINGER_DEPLOY_PATH_STAGING` |
| Production | `main` | `tv-sales-prod` | `HOSTINGER_DEPLOY_PATH_PROD` |

---

## Hostinger Configuration Checklist

Before enabling live deployment, confirm:

```
[ ] Hostinger plan type (VPS / Cloud / Shared)
[ ] SSH access enabled
[ ] SSH host / IP address
[ ] SSH port (default 22)
[ ] SSH username
[ ] SSH key pair generated
[ ] Node.js version available (requires 18+)
[ ] PM2 installed globally: npm install -g pm2
[ ] Deployment directories created (dev, staging, production paths)
[ ] Domain / subdomain configured for each environment
[ ] SSL certificates configured (Let's Encrypt via hPanel)
[ ] Firewall rules allow application ports
```

---

## Initial Hostinger Setup

### 1. Generate SSH key pair (on your local machine)

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/tv_sales_deploy
```

This creates:
- `~/.ssh/tv_sales_deploy` (private key — goes into GitHub Secrets)
- `~/.ssh/tv_sales_deploy.pub` (public key — goes onto Hostinger)

### 2. Add public key to Hostinger

In Hostinger hPanel:
```
SSH Access → SSH Keys → Add SSH Key
Paste contents of: ~/.ssh/tv_sales_deploy.pub
```

Or via SSH to the server:
```bash
ssh username@your-hostinger-host
mkdir -p ~/.ssh
echo "paste-public-key-here" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Install Node.js and PM2 on Hostinger

```bash
# Check if Node.js is available
node --version

# If not, install via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Install PM2 globally
npm install -g pm2

# Configure PM2 to start on server reboot
pm2 startup
# Follow the output instructions
pm2 save
```

### 4. Create deployment directories

```bash
mkdir -p /home/username/apps/tv-sales-dev
mkdir -p /home/username/apps/tv-sales-staging
mkdir -p /home/username/apps/tv-sales-prod
```

### 5. Add GitHub Repository Secrets

In GitHub: `Settings > Secrets and variables > Actions > New repository secret`

| Secret Name | Value |
|---|---|
| `HOSTINGER_HOST` | Your Hostinger server IP or hostname |
| `HOSTINGER_USERNAME` | SSH username (e.g., `root` or `u123456789`) |
| `HOSTINGER_PORT` | SSH port (usually `22`) |
| `HOSTINGER_SSH_KEY` | Full contents of `~/.ssh/tv_sales_deploy` (private key) |
| `HOSTINGER_DEPLOY_PATH_DEV` | `/home/username/apps/tv-sales-dev` |
| `HOSTINGER_DEPLOY_PATH_STAGING` | `/home/username/apps/tv-sales-staging` |
| `HOSTINGER_DEPLOY_PATH_PROD` | `/home/username/apps/tv-sales-prod` |
| `APP_URL_DEV` | `https://dev.yourdomain.com` |
| `APP_URL_STAGING` | `https://staging.yourdomain.com` |
| `APP_URL_PROD` | `https://yourdomain.com` |

---

## First Deployment (Manual Bootstrap)

For the very first deployment, bootstrap the app manually:

```bash
# SSH into Hostinger
ssh username@your-hostinger-host

# Go to deploy directory
cd /home/username/apps/tv-sales-prod

# Clone or copy initial files
# (After first GitHub Actions deploy, this is automatic)

# Start the app for the first time
npm install --production
pm2 start npm --name tv-sales-prod -- start
pm2 save
```

After this, all subsequent deployments are handled automatically by GitHub Actions.

---

## Health Check

Every deployment verifies the app is running by calling:

```
GET /api/health
```

Expected response (HTTP 200):

```json
{
  "status": "ok",
  "version": "abc1234",
  "environment": "production",
  "timestamp": "2026-08-08T10:00:00.000Z",
  "uptime": 123.456
}
```

If health check returns anything other than HTTP 200, the workflow fails.

---

## Rollback Procedure

### Quick rollback (previous build artifact)

1. Go to GitHub Actions → find the last successful production deployment
2. Download the `build-prod-<sha>` artifact (kept for 30 days)
3. SSH into Hostinger:

```bash
ssh username@your-hostinger-host

cd /home/username/apps/tv-sales-prod

# Stop current app
pm2 stop tv-sales-prod

# Replace with previous build
# (upload/extract the previous artifact)
tar -xzf build-prod-previous.tar.gz

npm install --production
pm2 restart tv-sales-prod

# Verify
curl https://yourdomain.com/api/health
```

### Git rollback (revert commit)

```bash
# On local machine
git checkout main
git log --oneline -10   # Find the last good commit SHA

git revert <bad-commit-sha>
git push origin main
# GitHub Actions will redeploy automatically
```

---

## PM2 Management Commands (on Hostinger)

```bash
# View running apps
pm2 list

# View logs
pm2 logs tv-sales-prod
pm2 logs tv-sales-staging

# Restart an app
pm2 restart tv-sales-prod

# Stop an app
pm2 stop tv-sales-prod

# Delete an app (use carefully)
pm2 delete tv-sales-prod

# Save state after changes
pm2 save

# Monitor real-time
pm2 monit
```

---

## GitHub Free Plan Limitations

> **Environment protection rules and environment secrets are not available for private repositories on GitHub Free.**

**What this means:**
- We cannot use GitHub's built-in environment approval gate for production deployments
- We cannot use environment-scoped secrets

**Our solution:**
- All secrets are stored as repository-level secrets
- The production gate is enforced via the PR process: `staging → main` requires a PR, which triggers CI before merging
- The `cd-production.yml` workflow includes a 4-job sequential gate: CI → Security → Build → Deploy

**When TV Sales upgrades to GitHub Team:**
- Move secrets to environment-scoped secrets (`development`, `staging`, `production`)
- Add environment protection rules (required reviewers, deployment gates)
- No changes needed to the deployment architecture itself

---

*See also: [secrets.md](secrets.md) | [ci-cd.md](ci-cd.md) | [environments.md](environments.md)*
