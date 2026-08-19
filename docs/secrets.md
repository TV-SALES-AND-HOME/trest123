# Secrets Management

## TV SALES & HOME — GitHub Repository Secrets

---

## Overview

All secrets are stored in GitHub Repository Secrets (not in code, not in `.env` files).

Location in GitHub: `Settings > Secrets and variables > Actions`

---

## Required Secrets

### Hostinger SSH Access

| Secret Name | Description | Example |
|---|---|---|
| `HOSTINGER_HOST` | Server hostname or IP | `srv123.hostinger.com` |
| `HOSTINGER_USERNAME` | SSH username | `root` or `u123456789` |
| `HOSTINGER_PORT` | SSH port | `22` |
| `HOSTINGER_SSH_KEY` | Full private key contents | `-----BEGIN OPENSSH...` |

### Deployment Paths (per environment)

| Secret Name | Description | Example |
|---|---|---|
| `HOSTINGER_DEPLOY_PATH_DEV` | Dev deployment directory | `/home/user/apps/tv-sales-dev` |
| `HOSTINGER_DEPLOY_PATH_STAGING` | Staging deployment directory | `/home/user/apps/tv-sales-staging` |
| `HOSTINGER_DEPLOY_PATH_PROD` | Production deployment directory | `/home/user/apps/tv-sales-prod` |

### Application URLs (per environment)

| Secret Name | Description | Example |
|---|---|---|
| `APP_URL_DEV` | Development URL | `https://dev.tvshopandfurniture.co.za` |
| `APP_URL_STAGING` | Staging URL | `https://staging.tvshopandfurniture.co.za` |
| `APP_URL_PROD` | Production URL | `https://tvshopandfurniture.co.za` |

---

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings**
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the secret name (exactly as shown above)
6. Paste the secret value
7. Click **Add secret**

---

## Generating the SSH Key

```bash
# Generate a dedicated deploy key (Ed25519 is recommended)
ssh-keygen -t ed25519 -C "github-actions-tv-sales-deploy" -f ~/.ssh/tv_sales_deploy

# Private key (add to HOSTINGER_SSH_KEY secret):
cat ~/.ssh/tv_sales_deploy

# Public key (add to Hostinger authorized_keys):
cat ~/.ssh/tv_sales_deploy.pub
```

Paste the **entire** private key content into the `HOSTINGER_SSH_KEY` secret, including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines.

---

## GitHub Free Plan Note

> Environment-scoped secrets are **not available for private repositories on GitHub Free**.

All secrets are stored as **repository-level secrets** and are accessible to all workflows in the repository.

### Current secret scope

```
Repository Level (GitHub Free)
└── All secrets are available to all workflows
    ├── ci.yml
    ├── security.yml
    ├── cd-development.yml
    ├── cd-staging.yml
    └── cd-production.yml
```

### Future: GitHub Team environment scoping

When TV Sales upgrades to GitHub Team:

```
Environment: development
└── APP_URL_DEV
└── HOSTINGER_DEPLOY_PATH_DEV

Environment: staging
└── APP_URL_STAGING
└── HOSTINGER_DEPLOY_PATH_STAGING

Environment: production
└── APP_URL_PROD
└── HOSTINGER_DEPLOY_PATH_PROD
└── (Optional) Require approval before deployment
```

---

## Secret Rotation

Rotate secrets when:
- A team member with access leaves the company
- A credential is accidentally exposed (git commit, log file, etc.)
- The Hostinger server is migrated
- On a scheduled security review (quarterly recommended)

Rotation process:
1. Generate new SSH key pair
2. Add public key to Hostinger
3. Update `HOSTINGER_SSH_KEY` in GitHub Secrets
4. Remove old public key from Hostinger
5. Verify next deployment succeeds

---

## What NOT to Do

```bash
# NEVER commit any of these
.env
.env.local
.env.production
.env.staging

# NEVER hardcode secrets in workflow files
env:
  API_KEY: actual-api-key-value  # WRONG

# ALWAYS use secrets
env:
  API_KEY: ${{ secrets.API_KEY }}  # CORRECT
```
