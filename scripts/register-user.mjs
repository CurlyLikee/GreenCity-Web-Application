import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const base = 'https://www.greencity.cx.ua/#/greenCity';
const email = process.env.GC_USER_EMAIL ?? 'example@gmail.com';
const password = process.env.GC_USER_PASSWORD ?? 'VirtuCircuit_Pro1';
const firstName = process.env.GC_USER_NAME ?? 'ex';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(`${base}/news`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.locator('a.green-link').filter({ hasText: /Sign up/i }).click();

  await page.locator('input[formcontrolname="firstName"]').fill(firstName);
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(password);
  await page.locator('input[formcontrolname="repeatPassword"]').fill(password);

  const [signUpRes] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('signUp'), { timeout: 30000 }),
    page.locator('button.greenStyle').filter({ hasText: /Sign up/i }).first().click(),
  ]);
  console.log('Sign up:', signUpRes.status(), await signUpRes.text());

  await page.waitForTimeout(2000);
  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(password);

  const [signInRes] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('signIn'), { timeout: 30000 }),
    page.locator('button.greenStyle').filter({ hasText: /Sign in/i }).first().click(),
  ]);
  console.log('Sign in:', signInRes.status(), await signInRes.text());
  console.log('Sign-in link visible:', await page.locator('a.header_sign-in-link').isVisible());

  await browser.close();
}

main().catch(console.error);
