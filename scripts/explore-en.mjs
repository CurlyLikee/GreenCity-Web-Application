import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function login(page, email, password) {
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });
  await page.getByText('Увійти', { exact: true }).first().click();
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(password);
  await page.locator('button.greenStyle').filter({ hasText: /^Увійти$/ }).click();
  await page.waitForTimeout(4000);
}

async function setEnglish(page) {
  const lang = page.locator('.lang-switcher-lang-name');
  if (await lang.count()) {
    await lang.click();
    await page.locator('.lang-switcher-list a, .lang-switcher-dropdown a').filter({ hasText: /^En$/ }).click({ timeout: 5000 }).catch(async () => {
      await page.getByText('En', { exact: true }).click();
    });
    await page.waitForTimeout(1500);
  }
}

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Register
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });
  await page.getByText('Увійти', { exact: true }).first().click();
  await page.locator('a.green-link').filter({ hasText: 'Зареєструватися' }).click();
  const email = `greencity.auto.${Date.now()}@test.com`;
  const password = 'TestPass123!';
  await page.locator('input[formcontrolname="firstName"]').fill('AutoTest');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(password);
  await page.locator('input[formcontrolname="repeatPassword"]').fill(password);
  await page.locator('button.greenStyle').filter({ hasText: /Зареєструватися/i }).click();
  await page.waitForTimeout(5000);

  await setEnglish(page);
  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const labels = await page.locator('label, .field-title, h2, h3, .form-title').allTextContents();
  console.log('EN Labels:', labels.map((t) => t.trim()).filter(Boolean));

  const counters = await page.locator('[class*="counter"], .text-input-counter, .character-counter').allTextContents();
  console.log('Counters:', counters);

  const readonly = await page.locator('input[readonly], textarea[readonly], .disabled-input').evaluateAll((els) =>
    els.map((el) => ({ tag: el.tagName, value: el.value, placeholder: el.placeholder, class: el.className }))
  );
  console.log('Readonly fields:', readonly);

  const ql = await page.locator('.ql-editor').innerText().catch(() => '');
  console.log('Quill editor exists:', await page.locator('.ql-editor').count());

  const buttons = await page.locator('button.primary-global-button, button.secondary-global-button').allTextContents();
  console.log('Action buttons:', buttons.map((t) => t.trim()).filter(Boolean));

  // Fill title and check counter
  await page.locator('textarea[formcontrolname="title"]').fill('Test');
  await page.waitForTimeout(500);
  console.log('Title counter area:', await page.locator('.text-input-counter, [class*="counter"]').first().textContent().catch(() => 'none'));

  await browser.close();
}

explore().catch(console.error);
