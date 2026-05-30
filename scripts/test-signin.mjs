import { chromium } from '@playwright/test';

const url = 'https://www.greencity.cx.ua/#/greenCity';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${url}/news`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });

  await page.locator('a.header_sign-in-link').click({ force: true });
  await page.waitForTimeout(1000);

  const buttons = await page.locator('button').evaluateAll((els) =>
    els.map((e) => ({ text: e.textContent?.trim(), class: e.className?.slice(0, 60) }))
  );
  console.log('Buttons in modal:', buttons.filter((b) => b.text));

  const email = `t${Date.now()}@t.com`;
  await page.locator('a.green-link').filter({ hasText: /Sign up/i }).click();
  await page.locator('input[formcontrolname="firstName"]').fill('Test');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill('TestPass123!');
  await page.locator('input[formcontrolname="repeatPassword"]').fill('TestPass123!');
  await page.locator('button.greenStyle').filter({ hasText: /Sign up/i }).click();
  await page.waitForTimeout(5000);

  console.log('After signup URL:', page.url());
  console.log('localStorage keys:', await page.evaluate(() => Object.keys(localStorage)));

  await browser.close();
}

run();
