import { chromium } from 'playwright';
import { createPngFile } from '../src/utils/fileHelpers.js';
import dotenv from 'dotenv';

dotenv.config();

const validPng = createPngFile('valid-5mb.png', 5 * 1024 * 1024);
const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
const page = await ctx.newPage();
await page.goto('https://www.greencity.cx.ua/#/greenCity/news/create-news');
await page.evaluate(() => localStorage.setItem('language', 'en'));
await page.reload();
await page.waitForTimeout(2000);

await page.locator('input[type="file"]').setInputFiles(validPng);
const submit = page.getByRole('button', { name: /^Submit$/i });
if (await submit.isVisible({ timeout: 3000 }).catch(() => false)) await submit.click();
await page.waitForTimeout(1000);

const p = page.locator('p').filter({ hasText: /Upload only PNG/i });
console.log('visible', await p.isVisible(), 'class', await p.getAttribute('class'), 'color', await p.evaluate((el) => getComputedStyle(el).color));

await browser.close();
