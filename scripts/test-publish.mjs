import { chromium } from '@playwright/test';

const url = 'https://www.greencity.cx.ua/#/greenCity';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${url}/news`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.locator('a.green-link').filter({ hasText: /Sign up/i }).click();
  const email = `t${Date.now()}@t.com`;
  const pass = 'TestPass123!';
  await page.locator('input[formcontrolname="firstName"]').fill('Test');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(pass);
  await page.locator('input[formcontrolname="repeatPassword"]').fill(pass);
  await page.locator('button.greenStyle').filter({ hasText: /^Sign up$|^Зареєструватися$/i }).click();
  await page.waitForTimeout(5000);

  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(pass);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForTimeout(5000);

  const keys = await page.evaluate(() => Object.keys(localStorage));
  console.log('localStorage:', keys);
  console.log('Sign in visible:', await page.locator('a.header_sign-in-link').isVisible());

  await page.goto(`${url}/news/create-news`, { waitUntil: 'networkidle' });
  await page.locator('textarea[formcontrolname="title"]').fill('PubTest');
  await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();
  await page.locator('.ql-editor').fill('Test content with 20 chars');

  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('eco-news') && r.request().method() === 'POST', { timeout: 20000 }).catch(() => null),
    page.getByRole('button', { name: 'Publish', exact: true }).click(),
  ]);
  console.log('POST:', response?.status());
  await page.waitForTimeout(3000);
  console.log('URL:', page.url());

  await browser.close();
}

run();
