import { test, expect } from './node_modules/playwright/test.mjs';

test('the prewritten-life cover copy is left aligned on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:5175/');

  await page.evaluate(() => {
    document.body.dataset.phase = 'city';
    document.body.dataset.nextScene = 'asme';
    document.querySelector('#next-scene').style.display = 'block';
  });
  await page.locator('[data-script-open="0"] [data-script-open-button]').click({ force: true });

  const reader = page.locator('[data-script-reader]');
  await expect(reader).toHaveClass(/open/);

  const coverCopy = reader.locator('.script-cover-copy');
  await expect(coverCopy).toHaveCSS('text-align', 'left');
});

test('reader chapters do not trap scroll inside the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:5175/');

  await page.evaluate(() => {
    document.body.dataset.phase = 'city';
    document.body.dataset.nextScene = 'asme';
    document.querySelector('#next-scene').style.display = 'block';
  });
  await page.locator('[data-script-open="0"] [data-script-open-button]').click({ force: true });

  const scroller = page.locator('[data-script-scenes]');
  const body = page.locator('.script-page-body').first();
  const head = page.locator('.script-page-head').first();

  await expect(scroller).toHaveCSS('scroll-snap-type', 'y proximity');
  await expect(head).toHaveCSS('position', 'relative');
  await expect(body).toHaveCSS('overflow-y', 'visible');
  await expect(body).toHaveCSS('max-height', 'none');
});

test('vex scene reads like a lab journal on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:5175/');

  await page.evaluate(() => {
    document.body.dataset.phase = 'city';
    document.body.dataset.nextScene = 'vex';
    document.querySelector('#next-scene').style.display = 'block';
  });

  const field = page.locator('.vex-field__core');
  await expect(field.getByText('[FIELD NOTES]')).toBeVisible();
  await expect(field.getByText('orbital city node map')).toBeVisible();
});
