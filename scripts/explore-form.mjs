import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function switchToEnglish(page) {
  const langSwitcher = page.locator('.lang-switcher, .language-switcher, [class*="lang"]').first();
  if (await langSwitcher.count()) {
    await langSwitcher.click().catch(() => {});
    await page.getByText(/^En$|^EN$|English/i).first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);
  }
}

async function registerAndLogin(page) {
  const email = `greencity.test.${Date.now()}@mailinator.com`;
  const password = 'TestPass123!';
  const name = 'AutoTestUser';

  await page.goto(`${baseUrl}/auth/sign-up`, { waitUntil: 'networkidle', timeout: 60000 });
  console.log('Sign up URL:', page.url());

  const inputs = await page.locator('input').evaluateAll((els) =>
    els.map((el) => ({
      type: el.type,
      placeholder: el.placeholder,
      formcontrolname: el.getAttribute('formcontrolname'),
      name: el.name,
    }))
  );
  console.log('Sign up inputs:', JSON.stringify(inputs, null, 2));

  await page.locator('input[formcontrolname="name"], input[placeholder*="Name"], input[placeholder*="Ім"]').first().fill(name).catch(() => {});
  await page.locator('input[formcontrolname="email"], input[type="email"]').first().fill(email);
  await page.locator('input[formcontrolname="password"], input[type="password"]').first().fill(password);
  await page.locator('input[formcontrolname="confirmPassword"]').fill(password).catch(async () => {
    const pwds = page.locator('input[type="password"]');
    if ((await pwds.count()) > 1) await pwds.nth(1).fill(password);
  });

  const submit = page.locator('button[type="submit"], button').filter({ hasText: /sign up|зареєстр/i }).first();
  await submit.click();
  await page.waitForTimeout(5000);
  console.log('After sign up URL:', page.url());

  return { email, password, name };
}

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const user = await registerAndLogin(page);
  console.log('Created user:', user.email);

  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });
  await switchToEnglish(page);

  const createBtn = page.locator('button, a').filter({ hasText: /create news|створити новину|додати новину/i });
  console.log('Create news buttons:', await createBtn.count());
  if (await createBtn.count()) {
    console.log('Create btn text:', await createBtn.first().textContent());
    await createBtn.first().click();
    await page.waitForTimeout(3000);
    console.log('Create form URL:', page.url());

    const formHtml = await page.locator('form, .create-news, app-create-eco-news').first().innerHTML().catch(() => 'no form');
    console.log('Form snippet:', formHtml.slice(0, 2000));

    const labels = await page.locator('label, h2, h3, .label, .form-label').allTextContents();
    console.log('Labels:', labels.filter(Boolean));

    const textareas = await page.locator('textarea, input, button').evaluateAll((els) =>
      els.map((el) => ({
        tag: el.tagName,
        type: el.type,
        placeholder: el.placeholder,
        text: el.textContent?.trim().slice(0, 50),
        formcontrolname: el.getAttribute('formcontrolname'),
        disabled: el.disabled,
        readonly: el.readOnly,
      }))
    );
    console.log('Form elements:', JSON.stringify(textareas, null, 2));
  }

  await browser.close();
}

explore().catch(console.error);
