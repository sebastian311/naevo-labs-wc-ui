import { test, expect } from '@playwright/test';

test('naevo-button demo renders', async ({ page }) => {
  await page.goto('/src/button/demo/');
  await expect(page.locator('naevo-button')).toBeVisible();
});
