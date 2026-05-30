import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { TAGS } from '../src/utils/constants';

test.describe('TC-01: Create News form fields', () => {
  test.beforeEach(async ({ authenticatedUser: _user, newsPage, createNewsPage }) => {
    await newsPage.open();
    await newsPage.openCreateNews();
    await createNewsPage.setEnglish();
  });

  test('should display all required fields in correct order', async ({ createNewsPage }) => {
    await allure.feature('Eco News');
    await allure.story('TC-01 Create News form structure');

    await expect(createNewsPage.titleField).toBeVisible();
    await expect(createNewsPage.sourceField).toBeVisible();
    await expect(createNewsPage.mainTextEditor).toBeVisible();
    await expect(createNewsPage.imageInput).toBeAttached();

    await expect(createNewsPage.tagButton(TAGS.news)).toBeVisible();
    await expect(createNewsPage.tagButton(TAGS.events)).toBeVisible();
    await expect(createNewsPage.tagButton(TAGS.education)).toBeVisible();
    await expect(createNewsPage.tagButton(TAGS.initiatives)).toBeVisible();
    await expect(createNewsPage.tagButton(TAGS.ads)).toBeVisible();

    await expect(createNewsPage.cancelButton).toBeVisible();
    await expect(createNewsPage.previewButton).toBeVisible();
    await expect(createNewsPage.publishButton).toBeVisible();

    const order = await createNewsPage.getFormFieldOrder();
    expect(order.indexOf('Title')).toBeGreaterThanOrEqual(0);
    expect(order.indexOf('Tag')).toBeGreaterThan(order.indexOf('Title'));
    expect(order.indexOf('Main Text')).toBeGreaterThan(order.indexOf('Tag'));

    const formText = await createNewsPage.form.textContent();
    expect(formText).toMatch(/Author:/i);
    expect(formText).toMatch(/Date:/i);
    expect(formText).toMatch(/0\/170/);
    expect(formText).toMatch(/63.?206/);

    await expect(createNewsPage.publishButton).toBeDisabled();
  });
});
