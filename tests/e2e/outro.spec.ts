import { test, expect } from '@playwright/test';

test.describe('Outro (US5)', () => {
  test('outro section has replay and share buttons', async ({ page }) => {
    await page.goto('/');
    // Walk through quickly by setting section via direct URL is not supported
    // (state is in-memory), so we wait through the natural flow.
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    await expect(page.getByRole('button', { name: /xem lại từ đầu/i })).toBeVisible({ timeout: 120_000 });
    await expect(page.getByRole('button', { name: /chia sẻ trang này/i })).toBeVisible();
  });

  test('replay button returns to hero', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    const replay = page.getByRole('button', { name: /xem lại từ đầu/i });
    await expect(replay).toBeVisible({ timeout: 120_000 });
    await replay.click();
    await expect(page.getByRole('button', { name: /bắt đầu/i })).toBeVisible();
  });
});
