# Security Guide

## TV SALES & HOME — Security Practices

---

## Principles

1. **Never commit secrets** — all credentials in GitHub Repository Secrets
2. **Minimum permissions** — GitHub Actions workflows use least-privilege
3. **Dependency hygiene** — audit on every push, review on PRs
4. **Secret scanning** — detect accidentally committed secrets before they spread
5. **Security headers** — all HTTP responses include security headers

---

## Dependency Security

### npm audit

`npm audit` runs on every push to `main`, `staging`, and `develop`, and on all PRs.

```yaml
- run: npm audit --audit-level=high
```

This fails the job if any **HIGH** or **CRITICAL** vulnerability is found.

### What to do when audit fails

```bash
# View vulnerabilities
npm audit

# Auto-fix safe updates
npm audit fix

# View what would be changed without applying
npm audit fix --dry-run

# For breaking changes that require manual review
npm audit fix --force  # Use with caution
```

### Dependency Review

Pull requests trigger a dependency review that compares the diff of `package-lock.json` against the base branch. This highlights newly introduced vulnerable packages before they merge.

> **Note:** Full dependency review enforcement requires GitHub Advanced Security. On GitHub Free private repos, `continue-on-error: true` is set so the job does not block PRs. Remove this when GHAS is enabled.

---

## Secret Detection

Gitleaks scans the full git history on every push to detect accidentally committed secrets.

```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
```

### Common secrets detected

- API keys and tokens
- Private SSH keys
- AWS/cloud credentials
- Database connection strings
- JWT secrets

### If a secret is detected

1. Immediately rotate the credential (invalidate the old one)
2. Remove the secret from git history: `git filter-branch` or `git filter-repo`
3. Force push the cleaned history
4. Document the incident

---

## GitHub Actions Security

### Minimum permissions

All workflow jobs explicitly declare minimum permissions:

```yaml
permissions:
  contents: read
```

Jobs that post PR comments use:
```yaml
permissions:
  contents: read
  pull-requests: write
```

No workflow uses `permissions: write-all`.

### Action version pinning

All actions are pinned to major version tags:

```yaml
uses: actions/checkout@v4        # Pinned
uses: actions/setup-node@v4      # Pinned
uses: actions/upload-artifact@v4 # Pinned
```

> When GitHub Team is purchased, pin to specific commit SHAs for maximum security.

---

## HTTP Security Headers

Configured in `next.config.ts`, applied to all responses:

| Header | Value | Purpose |
|---|---|---|
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restrict browser APIs |

---

## Secrets Management

See [secrets.md](secrets.md) for the full secrets reference.

**Rules:**
- Never put secrets in source code
- Never put secrets in `.env` files that are committed
- Always use GitHub Repository Secrets for CI/CD credentials
- The `.env.example` file must only contain placeholder values (empty or example)

---

## Future GitHub Team Upgrades

When TV SALES & HOME upgrades to GitHub Team / GitHub Advanced Security:

| Feature | Benefit |
|---|---|
| CodeQL scanning | Static analysis for security vulnerabilities in code |
| Dependency review enforcement | Block PRs that introduce vulnerable packages |
| Gitleaks SARIF upload | Security findings visible in Security tab |
| Secret scanning alerts | GitHub natively alerts on detected secrets |
| Private vulnerability reporting | Secure channel for external reporters |

---

*See also: [SECURITY.md](../SECURITY.md) | [secrets.md](secrets.md)*
