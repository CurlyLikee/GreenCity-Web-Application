import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const browser = await chromium.launch();
const ctx = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
const page = await ctx.newPage();
await page.goto('https://www.greencity.cx.ua/#/greenCity/news/12137');
await page.evaluate(() => localStorage.setItem('language', 'en'));
await page.reload();
await page.waitForTimeout(3000);

const locators = [
  ["a, button filter Edit", page.locator('a, button').filter({ hasText: /^Edit news$/i })],
  ["getByRole link", page.getByRole('link', { name: /Edit news/i })],
  ["getByRole link exact", page.getByRole('link', { name: 'Edit news' })],
];

for (const [name, loc] of locators) {
  const count = await loc.count();
  console.log(name, 'count', count);
  for (let i = 0; i < count; i++) {
    const el = loc.nth(i);
    console.log(' ', i, 'visible', await el.isVisible(), 'text', await el.textContent());
  }
}

await browser.close();
