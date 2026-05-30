import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function register(page) {
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
  return { email, password };
}

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await register(page);
  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });

  const allText = await page.locator('app-create-eco-news, .create-news-page, form').first().innerHTML().catch(async () => {
    return await page.locator('main, .main-content').first().innerHTML();
  });
  console.log('Has author:', allText.includes('author') || allText.includes('Author') || allText.includes('Автор'));
  console.log('Has date:', allText.includes('date') || allText.includes('Date') || allText.includes('Дата'));

  const spans = await page.locator('.author, .date, [class*="author"], [class*="date"], .news-data').allTextContents();
  console.log('Author/date areas:', spans.filter(Boolean));

  // Trigger validation - empty title blur
  await page.locator('textarea[formcontrolname="title"]').click();
  await page.locator('.ql-editor').click();
  await page.waitForTimeout(500);

  const redBorders = await page.locator('.ng-invalid, .error, .warning, .invalid').evaluateAll((els) =>
    els.map((el) => ({ tag: el.tagName, class: el.className?.slice(0, 80), text: el.textContent?.trim().slice(0, 100) }))
  );
  console.log('Invalid elements:', redBorders.slice(0, 15));

  const publishBtn = page.locator('button.primary-global-button').filter({ hasText: /Опублікувати|Publish/i });
  console.log('Publish disabled:', await publishBtn.isDisabled());

  // Fill invalid source
  await page.locator('input[formcontrolname="source"]').fill('www.example.com');
  await page.waitForTimeout(500);
  const errors = await page.locator('.warning, .error-text, .validation-warning, p.warning').allTextContents();
  console.log('Source errors:', errors.filter(Boolean));

  await browser.close();
}

explore().catch(console.error);
