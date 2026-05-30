import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import {
  generateLongText,
  generateTitle,
  SHORT_MAIN_TEXT,
  VALID_MAIN_TEXT,
} from '../src/utils/testData';

test.describe('TC-05: Main Text validation', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should validate main text length and publishing', async ({ createNewsPage, page }) => {
    await allure.feature('Eco News');
    await allure.story('TC-05 Main Text validation');

    await createNewsPage.fillTitle('Test');
    await createNewsPage.fillMainText(SHORT_MAIN_TEXT);
    await createNewsPage.selectTag(TAGS.news);
    await createNewsPage.expectMainTextErrorVisible();
    await expect(createNewsPage.publishButton).toBeDisabled();

    const tooLong = generateLongText(63_207);
    await createNewsPage.mainTextEditor.fill(tooLong);
    const length = await createNewsPage.getMainTextLengthFromForm();
    if (length > 63_206) {
      await expect(createNewsPage.publishButton).toBeDisabled();
    } else {
      expect(length).toBeLessThanOrEqual(63_206);
      await createNewsPage.expectMainTextErrorHidden();
    }

    await createNewsPage.fillMainText(VALID_MAIN_TEXT);
    await createNewsPage.expectMainTextErrorHidden();
    await expect(createNewsPage.publishButton).toBeEnabled();

    const title = generateTitle('TC-05 Published');
    await createNewsPage.publishNews(title, VALID_MAIN_TEXT, [TAGS.news]);
    await page.goto('https://www.greencity.cx.ua/#/greenCity/news');
    await expect(page.locator('a.link').filter({ hasText: title }).first()).toBeVisible({ timeout: 30_000 });
  });
});
