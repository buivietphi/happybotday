import { test, expect } from '@playwright/test';

test.describe('Reduced motion (T048)', () => {
  test.use({ colorScheme: 'light' });

  test('particles layer is static when prefers-reduced-motion is set', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const animated = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[style*="opacity"]'));
      return els.filter((el) => {
        const styles = getComputedStyle(el as Element);
        const duration = styles.animationDuration;
        const transition = styles.transitionDuration;
        return (
          (duration !== '0s' && duration !== '0.01ms') ||
          (transition !== '0s' && transition !== '0.01ms')
        );
      }).length;
    });
    expect(animated).toBe(0);
    await context.close();
  });

  test('start button still navigates under reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.getByRole('button', { name: /bắt đầu/i }).click();
    await expect(page.getByRole('region', { name: /photo slideshow/i })).toBeVisible();
    await context.close();
  });
});
