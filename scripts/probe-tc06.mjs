import { chromium } from 'playwright';
import dotenv from 'dotenv';
import { greenCityUrl } from '../src/utils/url.js';

dotenv.config();

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
const page = await ctx.newPage();

await page.goto(greenCityUrl('/news/create-news'));
await page.evaluate(() => localStorage.setItem('language', 'en'));
await page.reload();
await page.waitForTimeout(2000);

// simulate first publish quickly - skip

await page.goto(greenCityUrl('/news/create-news'));
await page.waitForTimeout(1000);

await page.locator('textarea[formcontrolname="title"]').fill('Test News');
await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();
await page.locator('.ql-editor').fill('Test content with 20 chars');
await page.locator('input[formcontrolname="source"]').fill('www.example.com');
await page.locator('input[formcontrolname="source"]').blur();
console.log('after invalid', await page.getByRole('button', { name: /^Publish$/ }).isEnabled());

await page.locator('input[formcontrolname="source"]').fill('https://example.com');
await page.locator('input[formcontrolname="source"]').blur();
await page.waitForTimeout(500);
console.log('after valid', await page.getByRole('button', { name: /^Publish$/ }).isEnabled());

const titleVal = await page.locator('textarea[formcontrolname="title"]').inputValue();
console.log('title', titleVal);

await browser.close();
