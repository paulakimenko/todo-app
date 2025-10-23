const { test, expect } = require('@playwright/test');

function attachBrowserTrackers(page) {
  const jsErrors = [];
  const failedRequests = [];
  const errorResponses = [];

  // JS runtime errors on the page
  page.on('pageerror', (err) => {
    jsErrors.push(String(err?.message || err));
  });

  // Network request lifecycle
  page.on('request', (_request) => {
    // Hook left intentionally for debugging/analytics; no-op capture for now
  });
  page.on('requestfailed', (request) => {
    failedRequests.push({ url: request.url(), method: request.method(), failure: request.failure() });
  });
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    // Ignore common, harmless assets if they ever 404 (e.g., sourcemaps or favicons)
    const isNoise = /\.map($|\?)/.test(url) || /favicon\.ico($|\?)/.test(url);
    if (status >= 400 && !isNoise) {
      errorResponses.push({ url, status });
    }
  });

  const assertNoBrowserErrors = async () => {
    expect(jsErrors, `JS errors on page: \n${jsErrors.join('\n')}`).toEqual([]);
    expect(failedRequests, `Failed requests: \n${failedRequests.map((r) => `${r.method} ${r.url} -> ${r.failure?.errorText || 'failed'}`).join('\n')}`).toEqual([]);
    expect(errorResponses, `HTTP error responses: \n${errorResponses.map((r) => `${r.status} ${r.url}`).join('\n')}`).toEqual([]);
  };

  return { assertNoBrowserErrors };
}

function uniqueEmail() {
  return `ui_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

const CLIENT_BASE = process.env.CLIENT_BASE_URL || 'http://localhost:3000';

// Helper to register a user directly via API to avoid client-side shape mismatches
async function registerViaApi(request, { email, password }) {
  const res = await request.post(`${process.env.API_BASE_URL || 'http://localhost:8080/api'}/users/register`, {
    data: { first_name: 'UI', last_name: 'Smoke', email, password, picture: null },
  });
  expect(res.status(), 'register status').toBe(201);
  return res.json();
}

test('ui smoke: unauthenticated users are redirected to /login', async ({ page }) => {
  const { assertNoBrowserErrors } = attachBrowserTrackers(page);
  await page.goto(`${CLIENT_BASE}/`);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await assertNoBrowserErrors();
});

test('ui smoke: login, add todo, logout', async ({ page, request }) => {
  const { assertNoBrowserErrors } = attachBrowserTrackers(page);
  const email = uniqueEmail();
  const password = 'Passw0rd!';

  // Register via API
  await registerViaApi(request, { email, password });

  // Go to login page and sign in
  await page.goto(`${CLIENT_BASE}/login`);
  await page.fill('#inputEmail3', email);
  await page.fill('#inputPassword3', password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Expect dashboard
  await expect(page).toHaveURL(`${CLIENT_BASE}/`);
  await expect(page.getByText('To do today')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

  // Expand form and add a todo
  await page.locator('button:has(svg.bi-chevron-compact-down)').click();
  await page.fill('#item', 'UI Smoke Task');
  await page.getByRole('button', { name: 'Add' }).click();

  // Verify todo appears
  await expect(page.getByText('UI Smoke Task')).toBeVisible();

  // Logout
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await assertNoBrowserErrors();
});
