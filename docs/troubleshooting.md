# Troubleshooting

## TV SALES & HOME — Common Issues and Solutions

---

## Local Development

### `npm run dev` fails to start

**Symptom:** Error starting the development server.

**Solutions:**

```bash
# Check Node.js version (requires 18+)
node --version

# Clear Next.js cache and rebuild
rm -rf .next
npm run dev

# Reset node_modules
rm -rf node_modules
npm install
npm run dev

# Check for port conflicts
lsof -i :3000   # macOS / Linux
netstat -ano | findstr :3000   # Windows
```

### `npm run build` fails locally

```bash
# Check TypeScript errors
npm run typecheck

# Check ESLint errors
npm run lint

# Check for missing env variables
cat .env.local
```

### Environment variables not loading

- Ensure `.env.local` exists (copy from `.env.example`)
- Ensure variable names start with `NEXT_PUBLIC_` for browser access
- Restart the dev server after changing `.env.local`

---

## Testing

### Unit tests fail

```bash
# Run in verbose mode to see details
npm test -- --reporter=verbose

# Run a specific test file
npm test -- tests/unit/environment.test.ts

# Check for TypeScript issues in test files
npx tsc --noEmit
```

### E2E tests fail — "dev server not running"

```bash
# Start dev server first
npm run dev

# In a second terminal
npm run test:e2e
```

### Playwright browsers not installed

```bash
npx playwright install --with-deps chromium
```

### E2E tests fail on specific checks

```bash
# Run in headed mode to see what's happening
npx playwright test --headed

# Run with Playwright UI
npm run test:e2e:ui

# View the HTML report after a run
npm run test:e2e:report
```

---

## CI Pipeline

### CI fails on Lint

```bash
# Run lint locally and fix
npm run lint
npm run lint -- --fix   # Auto-fix safe issues
```

### CI fails on Type Check

```bash
# Check for errors
npm run typecheck

# Common fixes:
# - Add explicit types instead of any
# - Fix missing return types
# - Fix null/undefined handling
```

### CI fails on Build but passes locally

This usually means an environment variable is missing in CI. Check:
- Required env vars are passed in the workflow `env:` block
- The variable is not hardcoded to a local path

### CI runs out of minutes

GitHub Free provides 2,000 minutes/month. To conserve:
- E2E tests only run on PRs and `develop/staging/main` pushes (already configured)
- Avoid pushing rapidly to feature branches with minor changes
- Monitor usage: GitHub Organization → Settings → Billing

---

## Deployment

### Deployment fails — SSH connection refused

**Check:**
1. `HOSTINGER_HOST` secret is correct
2. `HOSTINGER_PORT` secret is correct (usually 22)
3. SSH is enabled on Hostinger server
4. Firewall is not blocking the SSH port

```bash
# Test SSH manually
ssh -i ~/.ssh/tv_sales_deploy -p 22 username@hostinger-host
```

### Deployment fails — Permission denied (SSH key)

**Check:**
1. `HOSTINGER_SSH_KEY` contains the complete private key (including header/footer)
2. The corresponding public key is in `~/.ssh/authorized_keys` on Hostinger
3. Permissions on Hostinger: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys`

### Health check fails after deployment

```bash
# SSH into Hostinger and check
ssh username@hostinger-host

# Check PM2 status
pm2 list
pm2 logs tv-sales-prod

# Check if Node.js app is listening
curl http://localhost:3000/api/health

# Restart manually
pm2 restart tv-sales-prod

# Check for missing node_modules
cd /path/to/app
npm install --production
pm2 restart tv-sales-prod
```

### PM2 not found on Hostinger

```bash
# Install PM2 globally
npm install -g pm2

# Verify
pm2 --version
```

### Production deployment ran but changes not visible

1. Check if the browser is caching an old version (hard refresh: Ctrl+Shift+R)
2. Check PM2 picked up the new build: `pm2 logs tv-sales-prod`
3. Verify the deployment path is correct in `HOSTINGER_DEPLOY_PATH_PROD`
4. Check the health endpoint: `curl https://yourdomain.com/api/health` — the `version` field should show the new commit SHA

---

## GitHub Actions

### Workflow not triggering

- Check the `on:` trigger in the workflow file matches the branch name
- Check Actions are enabled: `Settings > Actions > General > Allow all actions`
- Verify you pushed to the correct branch

### Secrets not available in workflow

- Verify the secret name in GitHub Secrets matches exactly what the workflow references
- Secrets are case-sensitive: `HOSTINGER_HOST` ≠ `hostinger_host`
- After adding a secret, re-run the workflow (secrets are not cached)

### Workflow stuck in "queued"

- Check GitHub Status: https://www.githubstatus.com/
- The organization may have reached its Actions minutes limit
- Try cancelling and re-running

---

## Getting Help

1. Search the error message in this document
2. Check `pm2 logs` on Hostinger
3. Check GitHub Actions workflow logs (click the failed step)
4. Open a GitHub Issue using the Bug Report template
5. Contact the engineering team
