import { test, expect } from '@playwright/test';

const DEMO_URL = '/src/dropdown/demo/';

const OPTIONS = [
  { value: 'apple', label: 'Apples' },
  { value: 'pear', label: 'Pears' },
  { value: 'banana', label: 'Bananas' },
];

test.describe('naevo-select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.locator('naevo-select').first().evaluate((el, opts) => {
      el.options = opts;
      el.value = '';
    }, OPTIONS);
  });

  test('demo renders', async ({ page }) => {
    await expect(page.locator('naevo-select').first()).toBeVisible();
  });

  test('opens options panel on click', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.click();

    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(3);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('closes options panel on second click', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.click();
    await trigger.click();

    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('selects an option on click and shows its label', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.click();
    await page.getByRole('option', { name: 'Pears' }).click();

    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(trigger).toContainText('Pears');
    await expect(page.locator('naevo-select').first()).toHaveJSProperty('value', 'pear');
  });

  test('fires naevo-select event with the selected value', async ({ page }) => {
    await page.locator('naevo-select').first().evaluate((el) => {
      window.__selectEvents = [];
      el.addEventListener('naevo-select', (e) => window.__selectEvents.push(e.detail.value));
    });

    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Bananas' }).click();

    const events = await page.evaluate(() => window.__selectEvents);
    expect(events).toEqual(['banana']);
  });

  test('closes when clicking outside', async ({ page }) => {
    await page.getByRole('combobox').first().click();
    await expect(page.getByRole('listbox')).toBeVisible();

    await page.mouse.click(5, 5);

    await expect(page.getByRole('listbox')).toHaveCount(0);
  });

  test('is reachable with Tab', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();
    await expect(trigger).toBeFocused();
  });

  test('ArrowDown opens the panel and highlights the first option', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();
    await page.keyboard.press('ArrowDown');

    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'option-0');
  });

  test('ArrowDown moves the highlight and wraps from last to first', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();

    await page.keyboard.press('ArrowDown'); // open → 0
    await page.keyboard.press('ArrowDown'); // 1
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'option-1');

    await page.keyboard.press('ArrowDown'); // 2
    await page.keyboard.press('ArrowDown'); // wrap → 0
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'option-0');
  });

  test('ArrowUp wraps from first to last', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();

    await page.keyboard.press('ArrowDown'); // open → 0
    await page.keyboard.press('ArrowUp'); // wrap → 2
    await expect(trigger).toHaveAttribute('aria-activedescendant', 'option-2');
  });

  test('Enter selects the highlighted option (including the first one)', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();

    await page.keyboard.press('ArrowDown'); // open → 0
    await page.keyboard.press('Enter');

    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(trigger).toContainText('Apples');
  });

  test('Escape closes the panel without selecting', async ({ page }) => {
    const trigger = page.getByRole('combobox').first();
    await trigger.focus();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');

    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('naevo-select').first()).toHaveJSProperty('value', '');
  });

  test('disabled select is not focusable', async ({ page }) => {
    await page.locator('naevo-select').first().evaluate((el) => {
      el.disabled = true;
    });

    const trigger = page.getByRole('combobox').first();
    await expect(trigger).toHaveAttribute('tabindex', '-1');
    await expect(trigger).toHaveAttribute('aria-disabled', 'true');
  });
});