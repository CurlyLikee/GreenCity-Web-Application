import { Page, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { CreateNewsPage } from './CreateNewsPage';
import { NewsTag, TAGS } from '../utils/constants';

export class EditNewsPage extends CreateNewsPage {
  readonly submitButton: ReturnType<Page['locator']>;
  private originalCreatedDate = '';

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByRole('button', { name: /^Edit$/i });
  }

  async saveCreatedDate(): Promise<void> {
    await allure.step('Save original created date before edit', async () => {
      const formText = (await this.form.textContent()) ?? '';
      const match = formText.match(/Date:\s*([^A]+?)(?=Author:|$)/i);
      this.originalCreatedDate = match?.[1]?.trim() ?? '';
    });
  }

  async getSavedCreatedDate(): Promise<string> {
    return this.originalCreatedDate;
  }

  async setTags(tags: NewsTag[]): Promise<void> {
    const allTags = Object.values(TAGS);
    for (const tag of allTags) {
      const selected = await this.isTagSelected(tag);
      const shouldSelect = tags.includes(tag);
      if (selected !== shouldSelect) {
        await this.selectTag(tag);
      }
    }
  }

  async updateNews(title: string, content: string, tags: NewsTag[]): Promise<void> {
    await allure.step('Update news title, content and tags', async () => {
      await this.fillTitle(title);
      await this.mainTextEditor.click();
      await this.mainTextEditor.fill('');
      await this.fillMainText(content);
      await this.setTags(tags);
    });
  }

  async clickSubmit(): Promise<void> {
    await allure.step('Click Edit to save edited news', async () => {
      await expect(this.submitButton).toBeEnabled({ timeout: 15_000 });
      await this.submitButton.click();
      await this.page.waitForURL(
        (url) => url.toString().includes('/news') && !url.toString().includes('create-news'),
        { timeout: 30_000 },
      );
    });
  }
}
