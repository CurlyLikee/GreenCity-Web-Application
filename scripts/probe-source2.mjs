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
await page.locator('.ql-editor').fill('Test content with 20 chars');

const source = page.locator('input[formcontrolname="source"]');
await source.fill('www.example.com');
await source.blur();
await page.waitForTimeout(500);

const errors = await page.evaluate(() => {
  const els = [...document.querySelectorAll('*')].filter((el) => {
    const t = el.textContent ?? '';
    return /Please add the link/i.test(t) && el.children.length === 0;
  });
  return els.map((el) => ({
    tag: el.tagName,
    class: el.className,
    color: getComputedStyle(el).color,
    text: el.textContent?.trim().slice(0, 120),
  }));
});

console.log('error-like elements:', JSON.stringify(errors, null, 2));
await browser.close();
