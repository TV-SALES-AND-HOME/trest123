# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main`) | Yes |
| Staging | Yes |
| Older releases | No |

## Reporting a Vulnerability

**Do NOT report security vulnerabilities in public GitHub Issues.**

Email the engineering team with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

We acknowledge within 48 hours and aim to fix critical issues within 7 business days.

## Security Practices

### Secrets Management
- Never commit secrets or credentials to the repository
- All secrets stored in GitHub Repository Secrets
- `.env`, `.env.local`, `.env.production` are in `.gitignore`
- `.env.example` contains only placeholder values

### GitHub Actions
- Minimum required permissions on all workflows
- `GITHUB_TOKEN` permissions explicitly declared per job
- No `permissions: write-all`
- Actions pinned to specific versions

### Dependency Auditing
- `npm audit` runs on every push
- HIGH and CRITICAL vulnerabilities block CI
- Gitleaks secret scanning on every push

### HTTP Security Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Future Upgrades

When upgrading to GitHub Team:
- GitHub Advanced Security (GHAS)
- CodeQL code scanning
- Full dependency review enforcement
- Private vulnerability reporting
