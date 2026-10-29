import { test, expect } from '@playwright/test';

test('naevo-input demo renders', async ({ page }) => {
  await page.goto('/src/input/demo/');
  await expect(page.locator('naevo-input')).toBeVisible();
});
