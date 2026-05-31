import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
});
const page = await context.newPage();
await page.goto('https://atlab.io', { waitUntil: 'networkidle', timeout: 60000 });
await page.screenshot({ path: 'audit-shots/claude-reference-atlab-desktop.png', fullPage: true });
console.log(page.url());
await browser.close();
