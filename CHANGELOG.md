# Changelog

All notable changes are documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
Versioning: [Semantic Versioning](https://semver.org/)

---

## [1.0.0] - 2026-08-08

### Added

#### Application
- Next.js 14 + React 18 + TypeScript demo application
- TV SALES & HOME branded dark-mode UI
- Environment indicator (development / staging / production)
- CI/CD pipeline status dashboard
- `/api/health` endpoint: `{ status, version, environment, timestamp }`
- Responsive design

#### Testing
- Vitest unit tests for environment utilities
- Vitest unit tests for health check contract
- Playwright E2E tests for homepage and health API

#### CI/CD
- GitHub Actions CI: Lint > TypeCheck > Unit Tests > E2E > Build
- Security workflow: dependency audit, dependency review, Gitleaks
- CD Development, Staging, Production workflows (SSH + rsync + PM2)
- Concurrency controls on all deployment workflows
- Health check verification after each deployment

#### Documentation
- docs/architecture.md, branching.md, ci-cd.md, deployment.md
- docs/environments.md, security.md, secrets.md
- docs/repository-standard.md, troubleshooting.md
- CONTRIBUTING.md, SECURITY.md
- PR template, bug/feature/task issue templates

---

## Planned

- GitHub Team upgrade: org-level rulesets, CODEOWNERS, environment secrets
- Additional repositories: website, customer-portal, admin-portal
- Reusable workflows in infrastructure repository
