import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';
import { generateLongTitle, MIN_MAIN_TEXT, VALID_MAIN_TEXT } from '../src/utils/testData';

test.describe('TC-02: Title field validation', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should validate title length and enable Publish only when form is valid', async ({
    createNewsPage,
  }) => {
    await allure.feature('Eco News');
    await allure.story('TC-02 Title validation');

    await createNewsPage.titleField.click();
    await createNewsPage.mainTextEditor.click();
    expect(await createNewsPage.isTitleInvalid()).toBeTruthy();
    await expect(createNewsPage.publishButton).toBeDisabled();
    await expect(createNewsPage.form).toContainText('0/170');

    const longTitle = generateLongTitle(171);
    await createNewsPage.fillTitle(longTitle);
    await createNewsPage.mainTextEditor.click();
    await createNewsPage.titleField.blur();
    await expect(createNewsPage.form).toContainText(/17[01]\/170/);

    await createNewsPage.fillTitle('Test News');
    await expect(createNewsPage.form).toContainText('9/170');
    expect(await createNewsPage.isTitleInvalid()).toBeFalsy();
    await expect(createNewsPage.publishButton).toBeDisabled();

    await createNewsPage.selectTag(TAGS.news);
    await createNewsPage.fillMainText(VALID_MAIN_TEXT);
    await expect(createNewsPage.publishButton).toBeEnabled();
  });
});
