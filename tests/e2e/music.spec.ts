import { test, expect } from '@playwright/test';

test.describe('Music Toggle (US4)', () => {
  test('toggle is visible from the hero', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /bật nhạc|tắt nhạc/i });
    await expect(toggle).toBeVisible();
  });

  test('toggle is reachable from the slideshow', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    await expect(page.getByRole('button', { name: /bật nhạc|tắt nhạc/i })).toBeVisible();
  });

  test('toggle label swaps on click', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /bật nhạc/i });
    await toggle.click();
    await expect(page.getByRole('button', { name: /tắt nhạc/i })).toBeVisible();
  });
});
