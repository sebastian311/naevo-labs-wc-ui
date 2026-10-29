import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test — end-to-end / behavioural tests.
 * Drives the component demo pages served by @web/dev-server, like a real user would.
 * Specs live next to each component: packages/<name>/e2e/*.spec.js
 */
const PORT = 8765;

export default defineConfig({
  testDir: './packages',
  testMatch: '**/e2e/**/*.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  // Boots the dev server before the tests, reuses it if one is already running locally
  webServer: {
    command: `npx wds --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
