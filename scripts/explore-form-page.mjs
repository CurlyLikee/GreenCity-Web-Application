import { chromium } from '@playwright/test';
import fs from 'fs';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function register(page) {
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByText('Увійти', { exact: true }).first().click();
  await page.waitForTimeout(1000);
  await page.locator('a.green-link').filter({ hasText: 'Зареєструватися' }).click();
  const email = `greencity.auto.${Date.now()}@test.com`;
  const password = 'TestPass123!';
  await page.locator('input[formcontrolname="firstName"]').fill('AutoTest');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(password);
  await page.locator('input[formcontrolname="repeatPassword"]').fill(password);
  await page.locator('button.greenStyle').filter({ hasText: /Зареєструватися/i }).click();
  await page.waitForTimeout(5000);
  return { email, password };
}

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await register(page);

  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const elements = await page.locator('input, textarea, button, .tag-button, .custom-tag').evaluateAll((els) =>
    els.map((el) => ({
      tag: el.tagName,
      type: el.type,
      text: el.textContent?.trim().slice(0, 60),
      placeholder: el.placeholder,
      formcontrolname: el.getAttribute('formcontrolname'),
      className: el.className?.slice(0, 120),
      disabled: el.disabled,
      readOnly: el.readOnly,
    }))
  );
  fs.writeFileSync('scripts/form-elements.json', JSON.stringify(elements, null, 2));
  console.log('Saved', elements.length, 'elements');

  const labels = await page.locator('label, .field-title, .form-block-title, h2, h3').allTextContents();
  console.log('Labels:', labels.map((t) => t.trim()).filter(Boolean));

  // Switch to English and re-check button texts
  await page.locator('.lang-switcher-lang-name').click().catch(() => {});
  await page.locator('a, span').filter({ hasText: /^En$/ }).first().click().catch(() => {});
  await page.waitForTimeout(1500);
  const enButtons = await page.locator('button').evaluateAll((els) =>
    els.map((el) => el.textContent?.trim()).filter(Boolean)
  );
  console.log('Buttons EN:', enButtons);

  await browser.close();
}

explore().catch(console.error);
