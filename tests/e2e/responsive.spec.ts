import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-2560', width: 2560, height: 1440 },
];

for (const vp of VIEWPORTS) {
  test(`hero renders without horizontal scroll at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test(`start button is reachable at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    const btn = page.getByRole('button', { name: /bắt đầu/i });
    await expect(btn).toBeVisible();
    await expect(btn).toBeInViewport();
  });
}
