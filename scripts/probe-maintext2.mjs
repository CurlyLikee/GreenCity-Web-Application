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

async function state(label, text) {
  await page.locator('.ql-editor').click();
  await page.locator('.ql-editor').fill(text);
  await page.locator('.ql-editor').blur();
  await page.waitForTimeout(300);
  const p = page.locator('p').filter({ hasText: /Must be minimum 20/i });
  const cls = await p.getAttribute('class');
  console.log(label, { visible: await p.isVisible(), class: cls, color: await p.evaluate((el) => getComputedStyle(el).color) });
}

await page.locator('textarea[formcontrolname="title"]').fill('Test');
await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();

await state('short', 'short');
await state('valid', 'Test content with 20 chars');

await browser.close();
