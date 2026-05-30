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

const invalid = await source.evaluate((el) => el.classList.contains('ng-invalid'));
console.log('invalid after bad url:', invalid);
console.log('publish disabled:', await page.getByRole('button', { name: /^Publish$/ }).isDisabled());

await source.fill('https://example.com');
await source.blur();
await page.waitForTimeout(500);
const valid = await source.evaluate((el) => el.classList.contains('ng-invalid'));
console.log('invalid after good url:', valid);
console.log('publish enabled:', await page.getByRole('button', { name: /^Publish$/ }).isEnabled());

await browser.close();
