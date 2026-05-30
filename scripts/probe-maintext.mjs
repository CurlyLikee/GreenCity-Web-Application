import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
const page = await ctx.newPage();
await page.goto('https://www.greencity.cx.ua/#/greenCity/news/create-news');
await page.evaluate(() => localStorage.setItem('language', 'en'));
await page.reload();
await page.waitForTimeout(2000);

await page.locator('textarea[formcontrolname="title"]').fill('Test');
await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();
await page.locator('.ql-editor').fill('short');
await page.locator('.ql-editor').blur();
await page.waitForTimeout(500);

const warnings = await page.locator('span.field-info.warning, p').filter({ hasText: /Must be minimum/i }).all();
for (const w of warnings) {
  console.log('visible', await w.isVisible(), await w.textContent());
}

await browser.close();
