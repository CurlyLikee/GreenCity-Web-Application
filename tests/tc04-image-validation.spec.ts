import { test, expect } from '../src/fixtures/test';
import * as allure from 'allure-js-commons';
import { createGifFile, createJpegFile, createPngFile } from '../src/utils/fileHelpers';

test.describe('TC-04: Upload Image validation', () => {
  test.beforeEach(async ({ authenticatedUser: _user, createNewsPage }) => {
    await createNewsPage.open();
    await createNewsPage.setEnglish();
  });

  test('should accept valid PNG and reject invalid format or size', async ({ createNewsPage }) => {
    await allure.feature('Eco News');
    await allure.story('TC-04 Image upload validation');

    const validPng = createPngFile('valid-5mb.png', 5 * 1024 * 1024);
    await createNewsPage.uploadImage(validPng);

    await createNewsPage.open();
    await createNewsPage.setEnglish();
    const invalidGif = createGifFile('invalid.gif', 1024 * 1024);
    await createNewsPage.uploadImage(invalidGif);
    await createNewsPage.expectImageErrorVisible();

    await createNewsPage.open();
    await createNewsPage.setEnglish();
    const oversizedJpeg = createJpegFile('oversized.jpg', 15 * 1024 * 1024);
    await createNewsPage.uploadImage(oversizedJpeg);
    await createNewsPage.expectImageErrorVisible();
  });
});
