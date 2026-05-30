import { chromium } from '@playwright/test';

const baseUrl = 'https://www.greencity.cx.ua/#/greenCity';

async function explore() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${baseUrl}/news`, { waitUntil: 'networkidle', timeout: 60000 });

  await page.getByText('Увійти', { exact: true }).first().click();
  await page.waitForTimeout(1500);
  await page.locator('a.green-link').filter({ hasText: 'Зареєструватися' }).click();
  await page.waitForTimeout(2000);

  const inputs = await page.locator('input').evaluateAll((els) =>
    els.map((el) => ({
      type: el.type,
      placeholder: el.placeholder,
      formcontrolname: el.getAttribute('formcontrolname'),
      name: el.name,
      id: el.id,
      visible: el.offsetParent !== null,
    }))
  );
  console.log(JSON.stringify(inputs, null, 2));

  await browser.close();
}

explore().catch(console.error);
