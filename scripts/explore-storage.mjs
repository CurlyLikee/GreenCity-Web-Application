import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });

  const storage = await page.evaluate(() => JSON.stringify(localStorage));
  console.log('localStorage:', storage);

  await page.evaluate(() => localStorage.setItem('language', 'en'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });

  // need login - just check labels on news page header
  const signIn = await page.getByText('Sign in', { exact: true }).count();
  const uviity = await page.getByText('Увійти', { exact: true }).count();
  console.log('Sign in EN:', signIn, 'UK:', uviity);

  await page.evaluate(() => {
    localStorage.setItem('lang', 'en');
    localStorage.setItem('language', 'en');
    localStorage.setItem('locale', 'en');
  });
  await page.reload({ waitUntil: 'networkidle' });
  console.log('After reload Sign in EN:', await page.getByText('Sign in', { exact: true }).count());

  await browser.close();
}

explore().catch(console.error);
