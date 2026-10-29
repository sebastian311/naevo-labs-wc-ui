import { test, expect } from '@playwright/test';

test('naevo-input demo renders', async ({ page }) => {
  await page.goto('/src/input/demo/');
  await expect(page.locator('naevo-input')).toBeVisible();
});

test('naevo-input can type', async ({ page }) => {
  await page.goto('src/input/demo/');
  const input = page.locator('naevo-input input');
  const typed = page.evaluate(() => {
    return new Promise( resolve =>
      document.querySelector('naevo-input').addEventListener('input', () => resolve(true))
    )
  });

  await input.fill('hello');
  expect(await typed).toBe(true);
});

test('naevo-input is disabled', async ({ page }) => {
  await page.goto('src/input/demo/');
  const input = page.locator('naevo-input input');
  
  await page.evaluate(() => {
    document.querySelector('naevo-input').disabled = true;
  })

  await input.fill('test', { force: true });
  await expect(input).toHaveValue('');
  await expect(input).toBeDisabled();
});

test('naevo-input has invalid value', async ({ page }) => {
  await page.goto('src/input/demo/');
  const input = page.locator('naevo-input input');

  await page.evaluate(() => {
    document.querySelector('naevo-input').invalidMessage = 'INVALID123';
    document.querySelector('naevo-input').type = 'email';
  })

  await input.fill('123');
  await expect(page.locator('naevo-input')).toContainText('INVALID123');
});
