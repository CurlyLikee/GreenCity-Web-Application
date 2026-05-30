import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle', timeout: 60000 });

  console.log('=== NEWS PAGE ===');
  const headerText = await page.locator('header, nav, .header').first().textContent().catch(() => '');
  console.log('Header snippet:', headerText?.slice(0, 500));

  const allLinks = await page.locator('a').evaluateAll((els) =>
    els.map((el) => ({ text: el.textContent?.trim(), href: el.getAttribute('href') })).filter((x) => x.text)
  );
  console.log('Links:', allLinks.slice(0, 40));

  // Try Ukrainian sign in
  const signInLink = page.locator('a').filter({ hasText: /увійти|sign in/i }).first();
  console.log('Sign in found:', await signInLink.count());
  if (await signInLink.count()) {
    await signInLink.click();
    await page.waitForTimeout(3000);
    console.log('Login URL:', page.url());
    const inputs = await page.locator('input').evaluateAll((els) =>
      els.map((el) => ({ type: el.type, name: el.name, placeholder: el.placeholder, formcontrolname: el.getAttribute('formcontrolname') }))
    );
    console.log('Inputs:', JSON.stringify(inputs, null, 2));
  }

  // Check create news button
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });
  const createBtn = page.locator('button, a').filter({ hasText: /create|створ|додати/i });
  console.log('Create buttons count:', await createBtn.count());
  for (let i = 0; i < Math.min(await createBtn.count(), 5); i++) {
    console.log('Create btn', i, ':', await createBtn.nth(i).textContent());
  }

  await browser.close();
}

explore().catch(console.error);
