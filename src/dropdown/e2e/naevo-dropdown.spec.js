import { test, expect } from '@playwright/test';

test('naevo-dropdown demo renders', async ({ page }) => {
  await page.goto('/src/dropdown/demo/');
  await expect(page.locator('naevo-dropdown')).toBeVisible();
});
