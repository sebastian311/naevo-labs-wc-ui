import { test, expect } from '@playwright/test';

test('naevo-button demo renders', async ({ page }) => {
  await page.goto('/src/button/demo/');
  await expect(page.locator('naevo-button')).toBeVisible();
});

test('naevo-button should click', async ({ page }) => {
  await page.goto('/src/button/demo/');
  const button = page.locator('naevo-button');

  const clicked = page.evaluate(() => {
    return new Promise(resolve => {
      document.querySelector('naevo-button').addEventListener('click', () => resolve(true));
    });
  });

  await button.click();
  expect(await clicked).toBe(true);
});

test('naevo-button should be disabled', async ({ page }) => {
  await page.goto('/src/button/demo/');
  const button = page.locator('naevo-button');

  await page.evaluate(() => {
    document.querySelector('naevo-button').disabled = true;
  });

  await expect(button).toHaveAttribute('disabled');

  const pointerEvents = await button.evaluate(el => getComputedStyle(el).pointerEvents);
  expect(pointerEvents).toBe('none');
});
