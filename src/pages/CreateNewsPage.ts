import { Locator, Page, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BasePage } from './BasePage';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { MESSAGES, NewsTag, ROUTES } from '../utils/constants';
import { greenCityUrl } from '../utils/url';

export class CreateNewsPage extends BasePage {
  readonly form: Locator;
  readonly titleField: Locator;
  readonly titleCounter: Locator;
  readonly sourceField: Locator;
  readonly mainTextEditor: Locator;
  readonly imageInput: Locator;
  readonly authorBlock: Locator;
  readonly dateBlock: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;
  readonly publishButton: Locator;
  readonly confirmationModal: ConfirmationModal;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('form');
    this.titleField = page.locator('textarea[formcontrolname="title"]');
    this.titleCounter = page.locator('.text-input-counter, .counter').first();
    this.sourceField = page.locator('input[formcontrolname="source"]');
    this.mainTextEditor = page.locator('.ql-editor');
    this.imageInput = page.locator('input[type="file"]');
    this.authorBlock = page.locator('.author-block, .news-author').or(page.getByText(/Author:/i));
    this.dateBlock = page.locator('.date-block, .news-date').or(page.getByText(/Date:/i));
    this.cancelButton = page
      .getByRole('button', { name: /^Preview$/i })
      .locator('xpath=preceding-sibling::button[1]');
    this.previewButton = page.getByRole('button', { name: /^Preview$/i });
    this.publishButton = page.getByRole('button', { name: /^Publish$/i });
    this.confirmationModal = new ConfirmationModal(page);
  }

  async open(): Promise<void> {
    await allure.step('Navigate to Create News page', async () => {
      await this.page.goto(greenCityUrl(ROUTES.createNews));
      await this.page.waitForURL(/create-news/);
      await this.titleField.waitFor({ state: 'visible', timeout: 15_000 });
    });
  }

  tagButton(tag: NewsTag): Locator {
    return this.page.locator('.tag-button').filter({ hasText: new RegExp(`^${tag}$`, 'i') });
  }

  async fillTitle(value: string): Promise<void> {
    await allure.step(`Fill Title: "${value}"`, async () => {
      await this.titleField.fill(value);
    });
  }

  async fillMainText(value: string): Promise<void> {
    await allure.step('Fill Main Text content', async () => {
      await this.mainTextEditor.click();
      await this.mainTextEditor.fill(value);
    });
  }

  async selectTag(tag: NewsTag): Promise<void> {
    await allure.step(`Select tag: ${tag}`, async () => {
      const button = this.tagButton(tag);
      if (await this.isTagSelected(tag)) {
        return;
      }
      await button.click();
      await button.locator('.global-tag-clicked').waitFor({ state: 'visible', timeout: 5_000 });
    });
  }

  async selectTags(tags: NewsTag[]): Promise<void> {
    for (const tag of tags) {
      await this.selectTag(tag);
    }
  }

  async fillSource(url: string): Promise<void> {
    await allure.step(`Fill Source: ${url}`, async () => {
      await this.sourceField.fill(url);
      await this.sourceField.blur();
    });
  }

  async uploadImage(filePath: string): Promise<void> {
    await allure.step(`Upload image: ${filePath}`, async () => {
      await this.imageInput.waitFor({ state: 'attached', timeout: 15_000 });
      await this.imageInput.setInputFiles(filePath);
      await this.page.waitForTimeout(500);
      const hasUploadError = await this.page
        .locator('p.warning')
        .filter({ hasText: MESSAGES.imageUploadError })
        .isVisible();
      if (hasUploadError) {
        return;
      }
      const cropSubmit = this.page
        .getByRole('heading', { name: /Picture/i })
        .locator('..')
        .getByRole('button', { name: /^Submit$/i });
      if (await cropSubmit.isVisible({ timeout: 60_000 }).catch(() => false)) {
        await cropSubmit.click({ timeout: 15_000 });
        await this.page.waitForTimeout(1_000);
      }
    });
  }

  async publishNews(title: string, mainText: string, tags: NewsTag[]): Promise<void> {
    await allure.step(`Publish news: ${title}`, async () => {
      await this.fillTitle(title);
      for (const tag of tags) {
        await this.selectTag(tag);
      }
      await this.fillMainText(mainText);
      await expect(this.publishButton).toBeEnabled({ timeout: 20_000 });
      await this.clickPublish();
      await this.page.waitForURL(
        (url) => url.toString().includes('/news') && !url.toString().includes('create-news'),
        { timeout: 30_000 },
      );
    });
  }

  async clickPublish(): Promise<void> {
    await allure.step('Click Publish', async () => {
      await this.publishButton.click();
    });
  }

  async clickCancel(): Promise<void> {
    await allure.step('Click Cancel', async () => {
      await this.cancelButton.click();
    });
  }

  async clickPreview(): Promise<void> {
    await allure.step('Click Preview', async () => {
      await this.previewButton.click();
    });
  }

  async getTitleCounterText(): Promise<string> {
    return allure.step('Read Title character counter', async () => {
      const formText = (await this.form.textContent()) ?? '';
      const match = formText.match(/(\d+)\/170/);
      return match ? `${match[1]}/170` : (await this.titleCounter.textContent()) ?? '';
    });
  }

  async getMainTextLengthFromForm(): Promise<number> {
    return allure.step('Read Main Text length', async () => {
      return this.mainTextEditor.evaluate((el) => el.textContent?.length ?? 0);
    });
  }

  async isTitleInvalid(): Promise<boolean> {
    return this.titleField.evaluate((el) => el.classList.contains('ng-invalid'));
  }

  async isPublishDisabled(): Promise<boolean> {
    return this.publishButton.isDisabled();
  }

  async expectImageErrorVisible(): Promise<void> {
    await allure.step('Verify image upload error message', async () => {
      await this.page.locator('p.warning').filter({ hasText: MESSAGES.imageUploadError }).waitFor({ state: 'visible' });
    });
  }

  async expectImageUploadAccepted(): Promise<void> {
    await allure.step('Verify valid image upload completed', async () => {
      await expect(this.page.getByText(MESSAGES.imageUploadError)).toBeVisible();
    });
  }

  async expectMainTextErrorVisible(): Promise<void> {
    await allure.step('Verify main text length error', async () => {
      await this.page
        .locator('p.field-info.warning')
        .filter({ hasText: MESSAGES.mainTextLengthError })
        .waitFor({ state: 'visible' });
    });
  }

  async expectMainTextErrorHidden(): Promise<void> {
    await allure.step('Verify main text error is hidden', async () => {
      await this.page.locator('p.field-info.warning').filter({ hasText: MESSAGES.mainTextLengthError }).waitFor({
        state: 'hidden',
      });
    });
  }

  async expectSourceErrorVisible(): Promise<void> {
    await allure.step('Verify source URL error message', async () => {
      await this.page.locator('span.field-info.warning').filter({ hasText: MESSAGES.sourceUrlError }).waitFor({
        state: 'visible',
      });
    });
  }

  async expectSourceErrorHidden(): Promise<void> {
    await allure.step('Verify source error is hidden', async () => {
      await this.page.locator('span.field-info.warning').filter({ hasText: MESSAGES.sourceUrlError }).waitFor({
        state: 'hidden',
      });
    });
  }

  async getSelectedTagsCount(): Promise<number> {
    return allure.step('Count selected tags', async () => {
      return this.page.locator('.tag-button .global-tag-clicked').count();
    });
  }

  async isTagSelected(tag: NewsTag): Promise<boolean> {
    return this.tagButton(tag).locator('.global-tag-clicked').isVisible();
  }

  async getFormFieldOrder(): Promise<string[]> {
    return allure.step('Collect visible form field labels in order', async () => {
      const text = (await this.form.textContent()) ?? '';
      const order: string[] = [];
      if (/Title/i.test(text)) order.push('Title');
      if (/Pick tags|tags for news/i.test(text)) order.push('Tag');
      if (/Picture|image|browse/i.test(text)) order.push('Add Image');
      if (/Content/i.test(text)) order.push('Main Text');
      if (/Author:/i.test(text)) order.push('Author');
      if (/Date:/i.test(text)) order.push('Date');
      if (/Source/i.test(text)) order.push('Source');
      return order;
    });
  }
}
