import { test, expect } from '@playwright/test';

/**
 * US3 — Heartfelt Messages.
 * These tests assume the gift-giver configured ≥ 3 messages in site.config.ts.
 */
test.describe('Messages (US3)', () => {
  test('navigates hero → slideshow → messages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    // Skip through the slideshow quickly.
    while (await page.getByRole('region', { name: /photo slideshow/i }).isVisible().catch(() => false)) {
      const next = page.getByRole('button', { name: /ảnh tiếp theo/i });
      if (await next.isVisible().catch(() => false)) {
        await next.click();
      } else {
        break;
      }
    }
    await expect(page.getByRole('region', { name: /lời yêu thương/i })).toBeVisible({ timeout: 30_000 });
  });

  test('messages section shows message text', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    // Force-jump by waiting (the section auto-flows from slideshow → messages after last photo).
    await expect(page.getByRole('region', { name: /lời yêu thương/i })).toBeVisible({ timeout: 60_000 });
    // The first message text appears in <p class="text">.
    const text = await page.locator('p').filter({ hasText: /cảm ơn|chúc|mong|happy/i }).first().innerText();
    expect(text.length).toBeGreaterThan(10);
  });
});
