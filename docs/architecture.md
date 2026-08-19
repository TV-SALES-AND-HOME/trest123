# Architecture

## TV SALES & HOME — System Architecture

---

## Organization Overview

```
TV-SALES-AND-HOME (GitHub Organization)
│
├── template              ← Phase 1 Reference Implementation (Next.js)
├── static-site           ← Reference Implementation (plain HTML/CSS/JS)
├── infrastructure        ← Reusable GitHub Actions workflows
├── documentation         ← Org-wide docs
├── website               (planned — Next.js)
├── customer-portal       (planned — Next.js)
├── admin-portal          (planned — Next.js)
├── api                   (planned — Node.js / Python)
├── crm                   (planned)
└── inventory             (planned)
```

---

## Phase 1 Scope

Phase 1 uses `template` (Next.js) and `static-site` (plain HTML/CSS/JS) as the reference implementations establishing the DevOps standard. All future repositories follow the same pipeline structure, adapted to their specific technology.

---

## Application Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Language | TypeScript | 5.x |
| Runtime | Node.js | 20.x LTS |
| Styling | Vanilla CSS with design tokens | — |
| Unit Tests | Vitest + Testing Library | 2.x |
| E2E Tests | Playwright | 1.x |
| CI/CD | GitHub Actions | — |
| Process Manager | PM2 | — |
| Hosting | Hostinger | — |

---

## Repository Structure

```
template/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  ← CI pipeline (lint/typecheck/test/build/security, calls infrastructure)
│   │   ├── security.yml            ← Security checks on a daily schedule (calls infrastructure)
│   │   ├── cd-development.yml      ← Deploy to dev (calls infrastructure)
│   │   ├── cd-staging.yml          ← Deploy to staging (calls infrastructure)
│   │   └── cd-production.yml       ← Deploy to production (calls infrastructure)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                           ← This directory
│
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← Root layout
│   │   ├── page.tsx                ← Homepage
│   │   ├── globals.css             ← Global styles
│   │   └── api/
│   │       └── health/
│   │           └── route.ts        ← Health check endpoint
│   └── lib/
│       └── environment.ts          ← Environment utilities
│
├── tests/
│   ├── unit/
│   │   ├── setup.ts
│   │   ├── environment.test.ts
│   │   └── health.test.ts
│   └── e2e/
│       └── homepage.spec.ts
│
├── public/                         ← Static assets
│
├── .env.example                    ← Environment variable documentation
├── .gitignore
├── package.json
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CHANGELOG.md
```

---

## Engineering Lifecycle

Every repository follows the same lifecycle, regardless of technology:

```
                    Developer
                        │
                        ▼
              git checkout -b feature/*
                        │
                        ▼
                  Local Development
                  npm run dev
                  npm run lint
                  npm run typecheck
                  npm test
                        │
                        ▼
              Pull Request → develop
                        │
                        ▼
              ┌─────────────────────┐
              │   CI Pipeline       │
              │   Lint              │
              │   Type Check        │
              │   Unit Tests        │
              │   E2E Tests         │
              │   Build             │
              └─────────────────────┘
                        │
                        ▼
              Code Review + Merge
                        │
                        ▼
              develop branch push
                        │
                        ▼
              CD Development
              Deploy → Hostinger Dev
              Health Check
                        │
                        ▼
              PR: develop → staging
                        │
                        ▼
              CD Staging
              Deploy → Hostinger Staging
              Health Check
                        │
                        ▼
              Validation + Sign-off
                        │
                        ▼
              PR: staging → main
                        │
                        ▼
              CD Production
              CI Gate + Security Gate
              Build + Deploy → Hostinger Prod
              Health Check
```

---

## Environments

| Environment | Branch | Hostinger Target | Secret Prefix |
|---|---|---|---|
| Development | `develop` | Dev subdomain/path | `APP_URL_DEV`, `HOSTINGER_DEPLOY_PATH_DEV` |
| Staging | `staging` | Staging subdomain/path | `APP_URL_STAGING`, `HOSTINGER_DEPLOY_PATH_STAGING` |
| Production | `main` | Live domain | `APP_URL_PROD`, `HOSTINGER_DEPLOY_PATH_PROD` |

---

## Deployment Architecture

```
GitHub Actions Runner (ubuntu-latest)
│
├── npm ci                    Install dependencies
├── npm run build             Build Next.js production bundle
├── tar build artifacts       Package for transfer
│
└── SSH + rsync ──────────────────────────────► Hostinger Server
                                                │
                                                ├── rsync files
                                                ├── npm install --production
                                                └── pm2 restart <app-name>
                                                    │
                                                    └── Health Check: GET /api/health
                                                        Expected: { "status": "ok" }
```

---

## GitHub Plan Constraints

**Current plan: GitHub Free for Organizations**

| Feature | Free | Team |
|---|---|---|
| Public repo rulesets | ✅ | ✅ |
| Private repo rulesets | Limited | ✅ Full |
| Environment secrets (private repos) | ❌ | ✅ |
| CODEOWNERS (private repos) | ❌ | ✅ |
| Organization-level rulesets | ❌ | ✅ |
| Required reviewers (private repos) | ❌ | ✅ |
| GitHub Advanced Security | ❌ | Add-on |
| Actions minutes/month | 2,000 | 3,000 |

**Design principle:** All Phase 1 architecture is compatible with GitHub Free. Upgrading to GitHub Team adds governance and security controls without requiring architectural changes.

---

## Future: Reusable Workflows

When the `infrastructure` repository is created, reusable workflows will be centralized:

```
infrastructure/
└── .github/
    └── workflows/
        ├── reusable-node-ci.yml
        ├── reusable-nextjs-ci.yml
        ├── reusable-security.yml
        └── reusable-hostinger-deploy.yml
```

Individual repositories will call these instead of duplicating workflow logic.

---

*See also: [branching.md](branching.md) | [ci-cd.md](ci-cd.md) | [deployment.md](deployment.md)*
