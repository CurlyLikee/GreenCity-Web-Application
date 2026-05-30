import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function register(page) {
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Sign in', { exact: true }).first().click();
  await page.locator('a.green-link').filter({ hasText: 'Sign up' }).click();
  const email = `greencity.auto.${Date.now()}@test.com`;
  await page.locator('input[formcontrolname="firstName"]').fill('AutoTest');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill('TestPass123!');
  await page.locator('input[formcontrolname="repeatPassword"]').fill('TestPass123!');
  await page.locator('button.greenStyle').filter({ hasText: /Sign up/i }).click();
  await page.waitForTimeout(5000);
  return email;
}

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await register(page);
  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });

  const labels = await page.locator('label, .field-title, h2').allTextContents();
  console.log('EN form labels:', labels.map((t) => t.trim()).filter(Boolean));

  const buttons = await page.locator('button').evaluateAll((els) => els.map((e) => e.textContent?.trim()).filter(Boolean));
  console.log('Buttons:', buttons.filter((b) => /cancel|publish|preview|apply/i.test(b || '')));

  const body = await page.locator('form').textContent();
  console.log('Form text snippet:', body?.slice(0, 500));

  await browser.close();
}

explore().catch(console.error);
