# CI/CD Pipeline

## TV SALES & HOME — GitHub Actions Workflows

---

## Overview

All workflows are in `.github/workflows/`. They use minimum permissions, Node.js 20, and `npm ci` for reproducible installs.

```
Push / PR
    │
    ▼
CI Pipeline ─────── All branches
    │
    ▼
Security ─────────── main / staging / develop + daily
    │
    ▼
CD Development ───── push to develop
    │
    ▼
CD Staging ────────── push to staging
    │
    ▼
CD Production ──────── push to main
```

---

## CI Pipeline (`ci.yml`)

**Trigger:** Every push to any branch, every pull request

**Concurrency:** Cancelled for same ref (saves Actions minutes)

### Jobs

| Job | Depends on | Description |
|---|---|---|
| `lint` | — | ESLint (`npm run lint`) |
| `typecheck` | — | TypeScript strict check (`npm run typecheck`) |
| `unit-tests` | — | Vitest unit tests + coverage upload |
| `e2e-tests` | — | Playwright E2E (PRs + develop/staging/main only) |
| `build` | lint, typecheck, unit-tests | Next.js production build |

### Quality Gates

All of the following **must pass** before a PR can merge:

```
✓ Lint (ESLint next/core-web-vitals)
✓ Type Check (TypeScript strict)
✓ Unit Tests (Vitest)
✓ Build (Next.js production)
```

E2E tests run on PRs and on the main branches. They are skipped on feature branch pushes to conserve Actions minutes.

### Actions Minutes Usage

| Trigger | Jobs that run | Approx minutes |
|---|---|---|
| Feature branch push | lint, typecheck, unit-tests, build | ~4 min |
| PR / develop/staging/main push | All 5 jobs | ~8 min |

With 2,000 minutes/month on GitHub Free, this supports approximately 250 feature pushes or 125 full CI runs per month.

---

## Security Workflow (`security.yml`)

**Trigger:**
- Push to `main`, `staging`, `develop`
- All pull requests
- Daily at 06:00 UTC (scheduled)

### Jobs

| Job | Description | Free Plan Note |
|---|---|---|
| `dependency-audit` | `npm audit --audit-level=high` | Always runs — fails on HIGH/CRITICAL |
| `dependency-review` | PR dependency diff review | `continue-on-error: true` on private Free repos |
| `secret-detection` | Gitleaks full history scan | `continue-on-error: true` — SARIF needs GHAS |

---

## CD Development (`cd-development.yml`)

**Trigger:** Push to `develop`, manual dispatch

**Concurrency:** `cancel-in-progress: false` — deployments never compete

**Pipeline:**

```
Push to develop
    │
    ▼
Build Job:
  npm ci
  npm run lint + typecheck + test
  npm run build (NEXT_PUBLIC_ENVIRONMENT=development)
  tar build artifacts
    │
    ▼
Deploy Job:
  Download artifact
  Setup SSH key
  rsync → Hostinger Dev path
  npm install --production
  pm2 restart tv-sales-dev
    │
    ▼
Health Check:
  curl APP_URL_DEV/api/health
  Expect HTTP 200
    │
    ▼
Step Summary posted to GitHub
```

---

## CD Staging (`cd-staging.yml`)

**Trigger:** Push to `staging`, manual dispatch

Same pipeline as Development, targeting the staging Hostinger path.

```
Push to staging
    │
    ▼
Build (NEXT_PUBLIC_ENVIRONMENT=staging)
    │
    ▼
Deploy → Hostinger Staging path
    │
    ▼
Health Check → APP_URL_STAGING/api/health
```

---

## CD Production (`cd-production.yml`)

**Trigger:** Push to `main`, manual dispatch

**Concurrency:** `cancel-in-progress: false` — critical

**Pipeline (4 sequential jobs):**

```
Push to main
    │
    ▼
Job 1: CI Gate
  lint + typecheck + unit tests
    │ (must pass)
    ▼
Job 2: Security Gate
  npm audit --audit-level=high
    │ (must pass)
    ▼
Job 3: Production Build
  npm run build (NEXT_PUBLIC_ENVIRONMENT=production)
  Package artifact (kept 30 days)
    │ (must pass)
    ▼
Job 4: Deploy to Production
  rsync → Hostinger Production path
  pm2 restart tv-sales-prod
  Health check (15s wait) → APP_URL_PROD/api/health
  Step Summary
```

> **GitHub Free note:** Environment protection rules and environment secrets are not available for private repositories on GitHub Free. The production safety gate is enforced by the PR process (`staging → main`) and the sequential job dependencies within the workflow.

---

## Demonstrating CI Failure

To demonstrate the CI failure/fix cycle:

### Step 1: Trigger a failure

Create a branch with a broken test:

```bash
git checkout -b demo/ci-failure develop
```

Add a failing test in `tests/unit/health.test.ts`:

```typescript
it('intentional failure for demo', () => {
  expect(false).toBe(true);
});
```

Push and open a PR. CI will show:
```
❌ Unit Tests — FAILED
```

The PR cannot be merged.

### Step 2: Fix the failure

Remove the intentional failing test:

```bash
git revert HEAD
git push origin demo/ci-failure
```

CI re-runs and shows:
```
✅ Lint — PASSED
✅ Type Check — PASSED
✅ Unit Tests — PASSED
✅ Build — PASSED
```

The PR can now be merged.

---

## Workflow Permissions Reference

| Workflow | Job | Permissions |
|---|---|---|
| CI | lint, typecheck, unit-tests, build | `contents: read` |
| CI | e2e-tests | `contents: read` |
| Security | dependency-audit | `contents: read` |
| Security | dependency-review | `contents: read`, `pull-requests: write` |
| Security | secret-detection | `contents: read` |
| CD * | build | `contents: read` |
| CD * | deploy | `contents: read` |

No workflow uses `write-all` permissions.

---

## GitHub Actions Concurrency Summary

| Workflow | Group | cancel-in-progress |
|---|---|---|
| CI | `ci-CI-<ref>` | `true` (saves minutes) |
| Security | `security-Security-<ref>` | `true` |
| CD Development | `cd-development` | `false` (deployments complete) |
| CD Staging | `cd-staging` | `false` |
| CD Production | `cd-production` | `false` |

---

*See also: [deployment.md](deployment.md) | [security.md](security.md) | [branching.md](branching.md)*
