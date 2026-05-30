import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import { generateTitle, MIN_MAIN_TEXT } from '../src/utils/testData';
import { greenCityUrl } from '../src/utils/url';

test.describe('TC-03: Tags selection', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should allow selecting 1 to 3 tags and block a fourth tag', async ({
    createNewsPage,
    page,
  }) => {
    await allure.feature('Eco News');
    await allure.story('TC-03 Tags selection');

    const titleOneTag = generateTitle('TC-03 One Tag');
    await createNewsPage.publishNews(titleOneTag, MIN_MAIN_TEXT, [TAGS.news]);

    await page.goto(greenCityUrl('/news'));
    await expect(page.locator('a.link').filter({ hasText: titleOneTag }).first()).toContainText('News', {
      timeout: 30_000,
    });

    await createNewsPage.open();
    const titleThreeTags = generateTitle('TC-03 Three Tags');
    await createNewsPage.fillTitle(titleThreeTags);
    await createNewsPage.selectTags([TAGS.news, TAGS.events, TAGS.education]);
    await createNewsPage.fillMainText(MIN_MAIN_TEXT);

    const selectedCount = await createNewsPage.getSelectedTagsCount();
    expect(selectedCount).toBe(3);

    await createNewsPage.tagButton(TAGS.initiatives).click();
    const afterFourth = await createNewsPage.getSelectedTagsCount();
    expect(afterFourth).toBe(3);
    expect(await createNewsPage.isTagSelected(TAGS.initiatives)).toBe(false);

    await createNewsPage.clickPublish();
    await page.waitForURL(/\/news/, { timeout: 30_000 });

    await page.goto(greenCityUrl('/news'));
    const card = page.locator('a.link').filter({ hasText: titleThreeTags }).first();
    await expect(card).toContainText('News', { timeout: 30_000 });
    await expect(card).toContainText('Events');
    await expect(card).toContainText('Education');
  });
});
