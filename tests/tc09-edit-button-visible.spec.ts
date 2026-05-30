import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import { generateTitle, MIN_MAIN_TEXT } from '../src/utils/testData';
import { greenCityUrl } from '../src/utils/url';

test.describe('TC-09: Edit news button visibility', () => {
  test('should show Edit news button for news author', async ({
    authenticatedUser: _user,
    createNewsPage,
    newsDetailPage,
    page,
  }) => {
    await allure.feature('Eco News');
    await allure.story('TC-09 Edit news button');

    await createNewsPage.open();
    await createNewsPage.setEnglish();

    const title = generateTitle('TC-09 Edit');
    await createNewsPage.publishNews(title, MIN_MAIN_TEXT, [TAGS.news]);

    if (!page.url().match(/news\/\d+/)) {
      await page.goto(greenCityUrl('/news'));
      await page.locator('a.link').filter({ hasText: title }).first().click();
      await page.waitForURL(/\/news\/\d+/, { timeout: 30_000 });
    }

    await newsDetailPage.expectEditNewsVisible();
  });
});
