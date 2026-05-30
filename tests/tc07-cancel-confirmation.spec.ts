import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import { MIN_MAIN_TEXT } from '../src/utils/testData';

test.describe('TC-07: Cancel confirmation modal', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should show confirmation modal and handle cancel actions', async ({
    createNewsPage,
    newsPage,
    page,
  }) => {
    await allure.feature('Eco News');
    await allure.story('TC-07 Cancel confirmation');

    await createNewsPage.fillTitle('Test');
    await createNewsPage.fillMainText(MIN_MAIN_TEXT);
    await createNewsPage.clickCancel();
    await createNewsPage.confirmationModal.expectCancelMessage();
    await createNewsPage.confirmationModal.confirmCancel();
    await newsPage.expectOnNewsPage();

    await createNewsPage.open();
    await createNewsPage.fillTitle('Test');
    await createNewsPage.fillMainText(MIN_MAIN_TEXT);
    await createNewsPage.clickCancel();
    await createNewsPage.confirmationModal.continueEditing();

    await expect(createNewsPage.titleField).toHaveValue('Test');
    await expect(createNewsPage.mainTextEditor).toContainText(MIN_MAIN_TEXT);
    await expect(page).toHaveURL(/create-news/);
  });
});
