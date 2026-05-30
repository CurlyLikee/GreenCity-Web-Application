import { chromium } from '@playwright/test';

const base = 'https://www.greencity.cx.ua/#/greenCity';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(`${base}/news`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.locator('a.green-link').filter({ hasText: /Sign up/i }).click();

  const email = `gc.auto.${Date.now()}@mail.com`;
  const pass = 'TestPass123!';
  await page.locator('input[formcontrolname="firstName"]').fill('Auto');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(pass);
  await page.locator('input[formcontrolname="repeatPassword"]').fill(pass);

  const [regRes] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('signUp'), { timeout: 20000 }),
    page.locator('button.greenStyle').filter({ hasText: /Sign up/i }).first().click(),
  ]);
  console.log('SignUp status:', regRes.status());
  console.log('SignUp body:', (await regRes.text()).slice(0, 500));

  await browser.close();
}

main().catch(console.error);
