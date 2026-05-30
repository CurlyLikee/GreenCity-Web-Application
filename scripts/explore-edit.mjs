import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function setup(page) {
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
  await setup(page);
  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });

  await page.locator('textarea[formcontrolname="title"]').fill('Test');
  await page.locator('.ql-editor').fill('Test content with 20 chars');
  await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();
  await page.locator('button').filter({ hasText: /^Cancel$/ }).first().click();
  await page.waitForTimeout(1000);

  const modal = await page.locator('.modal, mat-dialog-container, app-confirmation-dialog').textContent().catch(() => '');
  console.log('Cancel modal:', modal?.replace(/\s+/g, ' ').slice(0, 300));

  const modalButtons = await page.locator('.modal button, mat-dialog-container button, app-confirmation-dialog button').allTextContents();
  console.log('Modal buttons:', modalButtons.map((t) => t.trim()).filter(Boolean));

  // Publish news for edit test
  await page.locator('button').filter({ hasText: 'Continue editing' }).click().catch(() => {});
  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });
  const title = `TC09-${Date.now()}`;
  await page.locator('textarea[formcontrolname="title"]').fill(title);
  await page.locator('.ql-editor').fill('Test content with 20 chars');
  await page.locator('.tag-button').filter({ hasText: /^News$/ }).click();
  await page.locator('button[type="submit"]').filter({ hasText: /^Publish$/ }).click();
  await page.waitForTimeout(5000);
  console.log('After publish URL:', page.url());

  const editBtn = page.locator('a, button').filter({ hasText: /Edit news/i });
  console.log('Edit news visible:', await editBtn.count(), await editBtn.first().textContent().catch(() => ''));

  await browser.close();
}

explore().catch(console.error);
