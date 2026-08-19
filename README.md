# TV SALES & HOME - Demo Repository

[![CI](https://github.com/TV-SALES-HOME/demo_repository/actions/workflows/ci.yml/badge.svg)](https://github.com/TV-SALES-HOME/demo_repository/actions/workflows/ci.yml)
[![Security](https://github.com/TV-SALES-HOME/demo_repository/actions/workflows/security.yml/badge.svg)](https://github.com/TV-SALES-HOME/demo_repository/actions/workflows/security.yml)

Reference implementation of the TV SALES & HOME DevOps platform. Demonstrates CI/CD, automated testing, security scanning, and multi-environment deployment to Hostinger.

## Overview

This is the **Phase 1 DevOps reference implementation** for the TV-SALES-HOME GitHub organization. It establishes the engineering standards for all future repositories.

**Demonstrates:**
- Professional CI pipeline with quality gates
- Automated testing (unit + E2E)
- Security scanning and dependency auditing
- Multi-environment deployment (development > staging > production)
- GitHub Actions + Hostinger integration
- Git branching workflow and repository governance

## Technology

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Runtime | Node.js 20 |
| Unit Tests | Vitest + Testing Library |
| E2E Tests | Playwright |
| CI/CD | GitHub Actions |
| Hosting | Hostinger (SSH + rsync + PM2) |

## Installation

```bash
git clone https://github.com/TV-SALES-HOME/demo_repository.git
cd demo_repository
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm test             # Unit tests
npm run test:e2e     # E2E tests
npm run test:coverage  # Coverage report
```

## Branch Workflow

```
feature/*  ->  develop  ->  staging  ->  main
```

See [docs/branching.md](docs/branching.md)

## Environment Variables

Copy `.env.example` to `.env.local`. See [docs/environments.md](docs/environments.md).

**Never commit `.env`, `.env.local`, or `.env.production`.**

## CI/CD

| Workflow | Trigger | Jobs |
|---|---|---|
| CI | push / PR | Lint, TypeCheck, Tests, E2E, Build |
| Security | push / schedule | Audit, Review, Secret Detection |
| CD Dev | push to develop | Build + Deploy Dev |
| CD Staging | push to staging | Build + Deploy Staging |
| CD Prod | push to main | CI Gate + Security Gate + Build + Deploy |

See [docs/ci-cd.md](docs/ci-cd.md)

## Deployment

Hostinger via SSH + rsync + PM2. See [docs/deployment.md](docs/deployment.md).

Secrets required in GitHub Repository Settings: See [docs/secrets.md](docs/secrets.md).

## Security

See [SECURITY.md](SECURITY.md) and [docs/security.md](docs/security.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Organization

```
TV-SALES-HOME/
+-- demo_repository     <- You are here
+-- website             (planned)
+-- customer-portal     (planned)
+-- admin-portal        (planned)
+-- api                 (planned)
+-- infrastructure      (planned)
```

All repositories follow the standard in [docs/repository-standard.md](docs/repository-standard.md).

---
*TV SALES & HOME Engineering - Phase 1 DevOps Platform*
