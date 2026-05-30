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

async function check(label) {
  const span = page.locator('input[formcontrolname="source"]').locator('xpath=../..').locator('.field-info.warning, .field-info');
  const count = await page.locator('span.field-info').count();
  const visible = await page.locator('span.field-info.warning').isVisible().catch(() => false);
  const text = await page.locator('span.field-info').allTextContents();
  console.log(label, { count, visible, text });
}

await page.locator('textarea[formcontrolname="title"]').fill('Test');
await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();
await page.locator('.ql-editor').fill('Test content with 20 chars');

const source = page.locator('input[formcontrolname="source"]');
await source.fill('www.example.com');
await source.blur();
await page.waitForTimeout(500);
await check('invalid');

await source.fill('https://example.com');
await source.blur();
await page.waitForTimeout(500);
await check('valid');

await browser.close();
