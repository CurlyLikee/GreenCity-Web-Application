import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import { generateTitle, MIN_MAIN_TEXT } from '../src/utils/testData';
import { greenCityUrl } from '../src/utils/url';

test.describe('TC-06: Source field validation', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should validate optional source URL', async ({ createNewsPage, page }) => {
    await allure.feature('Eco News');
    await allure.story('TC-06 Source validation');

    const titleEmptySource = generateTitle('TC-06 Empty Source');
    await createNewsPage.publishNews(titleEmptySource, MIN_MAIN_TEXT, [TAGS.news]);
    await page.goto(greenCityUrl('/news'));
    await expect(page.locator('a.link').filter({ hasText: titleEmptySource }).first()).toBeVisible({
      timeout: 30_000,
    });

    await createNewsPage.open();
    await createNewsPage.fillTitle('Test News');
    await createNewsPage.selectTag(TAGS.news);
    await createNewsPage.fillMainText(MIN_MAIN_TEXT);
    await createNewsPage.fillSource('www.example.com');
    await createNewsPage.expectSourceErrorVisible();
    await expect(createNewsPage.publishButton).toBeDisabled();

    await createNewsPage.open();
    await createNewsPage.setEnglish();
    await createNewsPage.fillTitle('Test News');
    await createNewsPage.selectTag(TAGS.news);
    await createNewsPage.fillMainText(MIN_MAIN_TEXT);
    await createNewsPage.fillSource('https://example.com');
    await createNewsPage.expectSourceErrorHidden();
    await expect(createNewsPage.publishButton).toBeEnabled({ timeout: 15_000 });

    const titleWithSource = generateTitle('TC-06 Source');
    await createNewsPage.fillTitle(titleWithSource);
    await createNewsPage.selectTag(TAGS.news);
    await createNewsPage.fillMainText(MIN_MAIN_TEXT);
    await createNewsPage.fillSource('https://example.com');
    await createNewsPage.expectSourceErrorHidden();
    await expect(createNewsPage.publishButton).toBeEnabled({ timeout: 15_000 });
    await createNewsPage.clickPublish();
    await page.waitForURL(/\/news/, { timeout: 30_000 });
    await page.goto(greenCityUrl('/news'));
    await expect(page.locator('a.link').filter({ hasText: titleWithSource }).first()).toBeVisible({
      timeout: 30_000,
    });
  });
});
