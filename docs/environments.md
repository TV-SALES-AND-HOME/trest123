# Environments

## TV SALES & HOME — Environment Configuration

---

## Overview

The application runs in three environments:

| Environment | Branch | Purpose |
|---|---|---|
| Development | `develop` | Active integration and testing |
| Staging | `staging` | Pre-production validation |
| Production | `main` | Live application |

---

## Environment Variables

### How it works

Next.js reads environment variables from:

1. `.env.local` (local development — never committed)
2. GitHub Repository Secrets (injected at build time by GitHub Actions)

### Variable Reference

| Variable | Description | Local dev |
|---|---|---|
| `NODE_ENV` | Node.js environment | `development` |
| `NEXT_PUBLIC_ENVIRONMENT` | Application environment label | `development` |
| `NEXT_PUBLIC_APP_VERSION` | App version (set to git SHA in CI) | `1.0.0` |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `TV SALES & HOME Demo` |
| `NEXT_PUBLIC_APP_URL` | Full application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3000/api` |

> Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in `NEXT_PUBLIC_*` variables.

---

## Local Development Setup

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local — set your local values
# .env.local is listed in .gitignore and will never be committed
```

`.env.local` example:

```env
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_NAME=TV SALES & HOME Demo
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## CI/CD Build-time Injection

GitHub Actions injects environment variables at build time:

```yaml
# From cd-production.yml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_ENVIRONMENT: production
    NEXT_PUBLIC_APP_URL: ${{ secrets.APP_URL_PROD }}
    NEXT_PUBLIC_APP_VERSION: ${{ github.sha }}
```

Each workflow injects the correct `NEXT_PUBLIC_ENVIRONMENT` value:

| Workflow | NEXT_PUBLIC_ENVIRONMENT |
|---|---|
| `cd-development.yml` | `development` |
| `cd-staging.yml` | `staging` |
| `cd-production.yml` | `production` |

---

## Files That Must Never Be Committed

```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.staging
.env.production
```

All of these are listed in `.gitignore`. If you accidentally commit one of these files, treat it as a security incident — rotate all credentials immediately.

---

## Checking the Current Environment

The application exposes the current environment via:

- **UI:** The environment badge in the top-right of the page
- **API:** `GET /api/health` → `{ environment: "production" }`
- **Code:** `getEnvironment()` from `@/lib/environment`

---

## GitHub Free Plan Note

GitHub environment secrets (scoped to `development`, `staging`, `production` environments) are only available for **public repositories on GitHub Free**.

Private repositories on GitHub Free must use **repository-level secrets**.

All deployment secrets (`HOSTINGER_HOST`, `APP_URL_PROD`, etc.) are stored as repository-level secrets. See [secrets.md](secrets.md).

**When TV Sales upgrades to GitHub Team:**
- Move secrets into environment-scoped secrets
- Add environment protection rules
- No changes needed to the codebase or workflow logic
