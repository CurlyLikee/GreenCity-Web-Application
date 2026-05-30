import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';

test.describe('TC-08: News preview', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should display preview with entered title and content', async ({
    createNewsPage,
    newsPreviewPage,
  }) => {
    await allure.feature('Eco News');
    await allure.story('TC-08 News preview');

    const title = 'Test Preview';
    const content = 'This is a test preview content';

    await createNewsPage.fillTitle(title);
    await createNewsPage.selectTag(TAGS.news);
    await createNewsPage.fillMainText(content);
    await createNewsPage.clickPreview();

    await newsPreviewPage.expectTitleVisible(title);
    await newsPreviewPage.expectContentVisible(content);
    await newsPreviewPage.expectDateVisible();
    await newsPreviewPage.expectAuthorVisible();
    await newsPreviewPage.expectBackToEditingVisible();
  });
});
