import { chromium } from '@playwright/test';
import fs from 'fs';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function registerUser(page) {
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByText('Увійти', { exact: true }).first().click();
  await page.waitForTimeout(1500);
  await page.locator('a.green-link').filter({ hasText: 'Зареєструватися' }).click();

  const email = `greencity.auto.${Date.now()}@test.com`;
  const password = 'TestPass123!';

  await page.locator('input[formcontrolname="firstName"]').fill('AutoTest User');
  await page.locator('input[formcontrolname="email"]').fill(email);
  await page.locator('input[formcontrolname="password"]').fill(password);
  await page.locator('input[formcontrolname="repeatPassword"]').fill(password);
  await page.locator('button.greenStyle').filter({ hasText: /Зареєструватися|Sign up/i }).click();
  await page.waitForTimeout(6000);

  return { email, password };
}

async function switchEnglish(page) {
  await page.locator('.lang-switcher-lang-name').click({ timeout: 5000 }).catch(() => {});
  await page.locator('a, span').filter({ hasText: /^En$/ }).first().click({ timeout: 3000 }).catch(() => {});
  await page.waitForTimeout(1000);
}

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  const user = await registerUser(page);
  console.log('Registered:', user.email, 'URL:', page.url());

  await switchEnglish(page);
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });

  const createBtn = page.locator('a, button').filter({ hasText: /Create news|Створити новину/i });
  console.log('Create news:', await createBtn.count(), await createBtn.first().textContent().catch(() => ''));

  if (await createBtn.count()) {
    await createBtn.first().click();
    await page.waitForTimeout(3000);

    const elements = await page.locator('input, textarea, button, .custom-tag, .tag-btn').evaluateAll((els) =>
      els.map((el) => ({
        tag: el.tagName,
        type: el.type,
        text: el.textContent?.trim().slice(0, 50),
        placeholder: el.placeholder,
        formcontrolname: el.getAttribute('formcontrolname'),
        className: el.className?.slice(0, 100),
        disabled: el.disabled,
        readOnly: el.readOnly,
      }))
    );
    fs.writeFileSync('scripts/form-elements.json', JSON.stringify(elements, null, 2));
    console.log('Elements saved:', elements.length);

    // Get field order by labels
    const labels = await page.locator('label, .field-title, h3, .form-title').allTextContents();
    console.log('Labels:', labels.filter((t) => t.trim()));
  }

  await browser.close();
}

explore().catch(console.error);
