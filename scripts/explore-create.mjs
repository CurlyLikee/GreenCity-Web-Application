import { chromium } from '@playwright/test';

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

  const buttons = await page.locator('a, button').evaluateAll((els) =>
    els.map((el) => ({
      tag: el.tagName,
      text: el.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80),
      href: el.getAttribute('href'),
      class: el.className?.slice(0, 80),
    })).filter((x) => x.text)
  );
  console.log('Buttons after login:', buttons.filter((b) => /створ|create|news|новин|add|додати/i.test(b.text || '')));

  // Try direct create news URL
  for (const url of [
    `${baseUrl}/news/create`,
    `${baseUrl}/news/create-news`,
    `${baseUrl}/news/add`,
  ]) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('URL', url, '->', page.url(), 'inputs:', await page.locator('textarea').count());
  }

  await browser.close();
}

explore().catch(console.error);
