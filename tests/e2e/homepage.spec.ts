import { test, expect } from '@playwright/test';

test.describe('TV SALES & HOME - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/TV SALES & HOME/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('main heading exists and contains brand name', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('TV Sales');
    await expect(heading).toContainText('Home');
  });

  test('environment badge is displayed', async ({ page }) => {
    const envBadge = page.getByTestId('environment-badge');
    await expect(envBadge).toBeVisible();
    const text = await envBadge.textContent();
    const validEnvs = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TEST'];
    expect(validEnvs.some((e) => text?.includes(e))).toBe(true);
  });

  test('pipeline dashboard is displayed', async ({ page }) => {
    const dashboard = page.getByTestId('pipeline-dashboard');
    await expect(dashboard).toBeVisible();
  });

  test('all CI pipeline checks are shown as PASSING', async ({ page }) => {
    const checks = ['lint', 'type-check', 'unit-tests', 'e2e-tests', 'security-scan', 'build'];
    for (const check of checks) {
      const item = page.getByTestId(`pipeline-check-${check}`);
      await expect(item).toBeVisible();
      await expect(item).toContainText('PASSING');
    }
  });

  test('system status shows operational', async ({ page }) => {
    const status = page.getByTestId('system-status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('All Systems Operational');
  });

  test('health endpoint reference is displayed', async ({ page }) => {
    const health = page.getByTestId('health-status');
    await expect(health).toBeVisible();
    await expect(health).toContainText('/api/health');
  });

  test('current environment is shown', async ({ page }) => {
    const envDisplay = page.getByTestId('current-environment');
    await expect(envDisplay).toBeVisible();
    const validEnvs = ['development', 'staging', 'production', 'test'];
    const text = await envDisplay.textContent();
    expect(validEnvs.some((e) => text?.includes(e))).toBe(true);
  });

  test('page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByTestId('pipeline-dashboard')).toBeVisible();
  });
});

test.describe('Health API', () => {
  test('GET /api/health returns 200 with correct shape', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('environment');
    expect(body).toHaveProperty('timestamp');
  });
});
