# Branching Guide

## TV SALES & HOME — Git Workflow

---

## Branch Structure

```
feature/*  ──►
bugfix/*   ──►  develop  ──►  staging  ──►  main
hotfix/*   ──►                         ──►
release/*  ──────────────────────────► ──►
```

---

## Permanent Branches

| Branch | Represents | Protected | Deploys to |
|---|---|---|---|
| `main` | Production | Yes — PR only | Hostinger Production |
| `staging` | Pre-production candidate | Yes — PR only | Hostinger Staging |
| `develop` | Active integration | Yes — PR only | Hostinger Development |

---

## Feature Branches

### Naming

| Type | Format | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/user-login` |
| Bug fix | `bugfix/issue-description` | `bugfix/health-check-null` |
| Hotfix | `hotfix/critical-fix` | `hotfix/prod-env-mismatch` |
| Release | `release/vX.Y.Z` | `release/v1.2.0` |
| Chore | `chore/description` | `chore/update-dependencies` |

### Rules

- Always branch from `develop` (except hotfixes which may branch from `main`)
- Keep branches short-lived — merge frequently
- Delete branches after merge
- One purpose per branch

---

## Creating a Feature Branch

```bash
# 1. Make sure you're on develop and up to date
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# ... work ...

# 4. Run checks before pushing
npm run lint
npm run typecheck
npm test
npm run build

# 5. Push your branch
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub against develop
```

---

## Merge Flow

### Feature → develop

```bash
# PR: feature/your-feature → develop
# - CI must pass
# - At least 1 reviewer approval (when team is larger)
# - Squash and Merge preferred
```

### develop → staging

```bash
# PR: develop → staging
# - Create when develop is ready for pre-production testing
# - CI must pass
# - Triggers CD Staging deployment automatically
```

### staging → main (Production Release)

```bash
# PR: staging → main
# - Final validation must be complete on staging
# - CI must pass
# - This is the production release gate
# - Triggers CD Production deployment automatically
```

---

## Hotfix Flow

For urgent production fixes:

```bash
# 1. Branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix-description

# 2. Apply the fix
# ...

# 3. PR hotfix → main  (direct to production)
# 4. After merge, also merge hotfix → develop to keep in sync
git checkout develop
git merge hotfix/critical-fix-description
git push origin develop
```

---

## Ruleset Configuration

### main

Configure in: `Settings > Rules > Rulesets`

| Rule | Setting |
|---|---|
| Require a pull request before merging | ✅ Enabled |
| Block force pushes | ✅ Enabled |
| Block deletion | ✅ Enabled |
| Require status checks to pass | ✅ Enable when CI is registered |

> **Note:** Requiring status checks for private repos on GitHub Free has limited support. Configure what is available. Full enforcement is available on GitHub Team.

### staging

Same as `main`.

### develop

| Rule | Setting |
|---|---|
| Require a pull request before merging | ✅ Enabled |
| Block force pushes | ✅ Enabled |

---

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
type(scope): short description

Optional longer body explaining WHY, not WHAT.

Optional footer: Closes #123
```

### Types

| Type | Purpose |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace |
| `refactor` | Restructuring without behaviour change |
| `test` | Adding or updating tests |
| `chore` | Build tools, dependencies |
| `ci` | CI/CD pipeline changes |
| `perf` | Performance improvement |
| `security` | Security fix |

### Examples

```bash
git commit -m "feat(health): add uptime to health check response"
git commit -m "fix(env): handle missing NEXT_PUBLIC_ENVIRONMENT gracefully"
git commit -m "ci: add security gate to production workflow"
git commit -m "docs: update deployment guide with PM2 commands"
git commit -m "test(e2e): add mobile viewport test for homepage"
```

---

## Future GitHub Team Upgrade

When TV SALES & HOME upgrades to GitHub Team, add:

- Required reviewers on `main`, `staging`, `develop`
- CODEOWNERS file for automatic reviewer assignment
- Organization-level rulesets
- Branch protection for private repositories with full enforcement

---

*See also: [ci-cd.md](ci-cd.md) | [deployment.md](deployment.md) | [repository-standard.md](repository-standard.md)*
