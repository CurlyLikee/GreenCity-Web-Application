import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const base = 'https://www.greencity.cx.ua/#/greenCity';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(`${base}/news`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.waitForTimeout(1000);
  await page.locator('input[formcontrolname="email"]').fill(process.env.GC_USER_EMAIL);
  await page.locator('input[formcontrolname="password"]').fill(process.env.GC_USER_PASSWORD);

  const [signInRes] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('signIn') && r.request().method() === 'POST', { timeout: 30000 }),
    page.locator('button.greenStyle').filter({ hasText: /Sign in/i }).first().click(),
  ]);
  console.log('Sign in:', signInRes.status(), await signInRes.text());
  console.log('Logged in:', !(await page.locator('a.header_sign-in-link').isVisible()));

  await browser.close();
}

main().catch(console.error);
