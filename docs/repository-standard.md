# Repository Standard

## TV SALES & HOME — Organizational Standard

This document defines the standard that every repository in the TV-SALES-AND-HOME GitHub organization must follow.

---

## Purpose

Standardize the engineering lifecycle so that:
- Developers can move between repositories without relearning the setup
- CI/CD and deployment work the same way across all projects
- Security practices are consistent organization-wide
- Onboarding new developers is fast

---

## Repository Structure Standard

Every repository must contain:

```
repo-name/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── security.yml
│   │   ├── cd-development.yml
│   │   ├── cd-staging.yml
│   │   └── cd-production.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/
│   ├── architecture.md
│   ├── branching.md
│   ├── ci-cd.md
│   ├── deployment.md
│   ├── environments.md
│   ├── security.md
│   ├── secrets.md
│   ├── repository-standard.md
│   └── troubleshooting.md
│
├── src/
├── tests/
│
├── .env.example
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CHANGELOG.md
```

The `src/` and `tests/` structures vary by technology.

---

## Branch Standard

All repositories use:

```
feature/*  ->  develop  ->  staging  ->  main
```

| Branch | Protected | Deploys to |
|---|---|---|
| `main` | Yes | Production |
| `staging` | Yes | Staging |
| `develop` | Yes | Development |

---

## CI Standard

All repositories must pass these quality gates:

| Gate | Technology-specific implementation |
|---|---|
| Lint | ESLint / Ruff / etc. |
| Type Check | TypeScript / MyPy / etc. |
| Unit Tests | Vitest / Pytest / etc. |
| Build | Next.js build / Python package / etc. |

E2E tests are required for applications with user interfaces.

---

## Technology Examples

### Next.js

```bash
npm run lint       # ESLint next/core-web-vitals
npm run typecheck  # tsc --noEmit
npm test           # Vitest
npm run test:e2e   # Playwright
npm run build      # next build
```

### Python / FastAPI

```bash
ruff check .       # Lint
mypy .             # Type check
pytest             # Tests
pip install .      # Build / install
```

### WordPress / PHP

```bash
phpcs --standard=WordPress .   # Lint
phpunit                        # Tests
```

---

## Security Standard

All repositories must:

- Run `npm audit` (or equivalent) on every push
- Run secret detection on every push
- Use minimum GitHub Actions permissions per job
- Include security headers in HTTP responses
- Never commit `.env` or credential files
- Store all secrets in GitHub Repository Secrets

---

## Documentation Standard

Every repository's `README.md` must include:

1. Project description
2. Technology stack
3. Installation instructions
4. Development commands
5. Environment variable reference
6. Testing instructions
7. CI/CD overview
8. Deployment overview
9. Security notes
10. Contributing link

---

## Deployment Standard

- Development: automatic on push to `develop`
- Staging: automatic on push to `staging`
- Production: automatic on push to `main` (after CI + security gates)
- All deployments include a health check
- All deployments include a deployment summary in GitHub Actions
- Rollback procedure documented in `docs/deployment.md`

---

## Future: CODEOWNERS (GitHub Team)

When TV Sales upgrades to GitHub Team, add:

```
.github/CODEOWNERS
```

Example:

```
# All files require engineering review
* @TV-SALES-AND-HOME/engineering

# CI/CD changes require senior review
.github/workflows/ @TV-SALES-AND-HOME/senior-engineers

# Security files require security team review
SECURITY.md @TV-SALES-AND-HOME/security
docs/security.md @TV-SALES-AND-HOME/security
```

---

## Creating a New Repository

Use `scripts/new-project.sh` (in `template` or `static-site`, whichever fits the new project) — it creates the repo from the template, sets up branches, and seeds placeholder secrets in one step. See [documentation/ORG-HANDOFF.md](https://github.com/TV-SALES-AND-HOME/documentation/blob/main/ORG-HANDOFF.md) for the full walkthrough. Manually, the steps are:

1. Use `template` (Next.js) or `static-site` (plain HTML/CSS/JS) as the template, depending on whether the project needs server-side logic
2. Copy the `.github/` directory structure
3. Adapt CI jobs for the new technology stack
4. Update `docs/` for the specific application
5. Configure repository secrets in GitHub
6. Create `develop` and `staging` branches from `main`
7. Configure repository rulesets
8. Announce to the team

---

*This standard is maintained in `template/docs/repository-standard.md`.*
