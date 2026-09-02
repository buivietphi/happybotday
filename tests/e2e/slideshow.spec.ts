import { test, expect } from '@playwright/test';

test.describe('Slideshow (US2)', () => {
  test('hero → slideshow transition', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    await expect(page.getByRole('region', { name: /photo slideshow/i })).toBeVisible();
  });

  test('slideshow has controls', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    await expect(page.getByRole('button', { name: /tạm dừng slideshow/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /ảnh tiếp theo/i })).toBeVisible();
  });

  test('next button advances within 500ms', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    const counterBefore = await page.locator('[aria-live="polite"]').first().innerText();
    await page.getByRole('button', { name: /ảnh tiếp theo/i }).click();
    await page.waitForTimeout(500);
    const counterAfter = await page.locator('[aria-live="polite"]').first().innerText();
    expect(counterBefore).not.toEqual(counterAfter);
  });

  test('pause stops auto-advance', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    await page.getByRole('button', { name: /tạm dừng slideshow/i }).click();
    const counterBefore = await page.locator('[aria-live="polite"]').first().innerText();
    await page.waitForTimeout(7000);
    const counterAfter = await page.locator('[aria-live="polite"]').first().innerText();
    expect(counterBefore).toEqual(counterAfter);
  });
});
