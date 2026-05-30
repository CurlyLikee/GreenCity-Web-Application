import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle' });

  const langHtml = await page.locator('.lang-switcher, [class*="lang"]').first().innerHTML().catch(() => 'none');
  console.log('Lang switcher HTML:', langHtml.slice(0, 800));

  await page.locator('.lang-switcher-lang-name').click();
  await page.waitForTimeout(1000);

  const options = await page.locator('.lang-switcher-list a, .lang-switcher-dropdown li, [class*="lang"] a').evaluateAll((els) =>
    els.map((el) => ({ text: el.textContent?.trim(), href: el.getAttribute('href'), class: el.className }))
  );
  console.log('Lang options:', options);

  await page.locator('a').filter({ hasText: /^En$/ }).click({ force: true });
  await page.waitForTimeout(2000);

  const header = await page.locator('header').textContent();
  console.log('Header after EN:', header?.slice(0, 300));

  await page.goto(`${baseUrl}/news/create-news`, { waitUntil: 'networkidle' });
  // register first - skip for lang test
  await browser.close();
}

explore().catch(console.error);
