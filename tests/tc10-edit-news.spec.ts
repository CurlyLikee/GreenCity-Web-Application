import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import { generateTitle, MIN_MAIN_TEXT } from '../src/utils/testData';
import { greenCityUrl } from '../src/utils/url';

test.describe('TC-10: Edit own news', () => {
  test('should update news and keep original creation date', async ({
    authenticatedUser: _user,
    createNewsPage,
    newsDetailPage,
    editNewsPage,
    page,
  }) => {
    await allure.feature('Eco News');
    await allure.story('TC-10 Edit news');

    await createNewsPage.open();
    await createNewsPage.setEnglish();

    const originalTitle = generateTitle('TC-10 Original');
    await createNewsPage.publishNews(originalTitle, MIN_MAIN_TEXT, [TAGS.news]);

    await page.goto(greenCityUrl('/news'));
    await page.locator('a.link').filter({ hasText: originalTitle }).first().click({ timeout: 30_000 });
    await page.waitForURL(/\/news\/\d+/, { timeout: 30_000 });

    const createdDate = await newsDetailPage.getCreatedDateText();

    await newsDetailPage.clickEditNews();

    const updatedTitle = generateTitle('TC-10 Updated');
    const updatedContent = 'Updated content with twenty chars';
    await editNewsPage.updateNews(updatedTitle, updatedContent, [TAGS.events, TAGS.education]);

    await editNewsPage.clickSubmit();

    if (!page.url().match(/\/news\/\d+/)) {
      await page.goto(greenCityUrl('/news'));
      await page.locator('a.link').filter({ hasText: updatedTitle }).first().click({ timeout: 30_000 });
      await page.waitForURL(/\/news\/\d+/, { timeout: 30_000 });
    }

    await expect(page.locator('h1, h2, .news-title, .title').first()).toContainText(updatedTitle);
    const content = await newsDetailPage.getContentText();
    expect(content).toMatch(/Updated content/i);

    await expect(page.locator('main')).toContainText('Events');
    await expect(page.locator('main')).toContainText('Education');

    const dateAfterEdit = await newsDetailPage.getCreatedDateText();
    expect(dateAfterEdit).toBe(createdDate);
  });
});
