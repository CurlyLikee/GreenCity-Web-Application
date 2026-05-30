import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BasePage } from './BasePage';
import { greenCityUrl } from '../utils/url';

export class NewsDetailPage extends BasePage {
  readonly editNewsButton: ReturnType<Page['locator']>;

  constructor(page: Page) {
    super(page);
    this.editNewsButton = page.getByRole('link', { name: /Edit news/i });
  }

  async openById(newsId: string): Promise<void> {
    await allure.step(`Open news post ${newsId}`, async () => {
      await this.page.goto(greenCityUrl(`/news/${newsId}`));
      await this.page.waitForURL(new RegExp(`/news/${newsId}`));
    });
  }

  async expectEditNewsVisible(): Promise<void> {
    await allure.step('Verify Edit news button is visible for author', async () => {
      await this.editNewsButton.scrollIntoViewIfNeeded();
      await this.editNewsButton.waitFor({ state: 'visible', timeout: 15_000 });
    });
  }

  async clickEditNews(): Promise<void> {
    await allure.step('Click Edit news', async () => {
      await this.editNewsButton.click();
      await this.page.waitForURL(/create-news|edit/);
    });
  }

  async getTitleText(): Promise<string> {
    return allure.step('Read news title on detail page', async () => {
      const heading = this.page.locator('h1, h2, .news-title, .title').first();
      return (await heading.textContent())?.trim() ?? '';
    });
  }

  async getContentText(): Promise<string> {
    return allure.step('Read news content on detail page', async () => {
      const content = this.page.locator('.news-content, .content-text, .text').first();
      return (await content.textContent())?.trim() ?? '';
    });
  }

  async getCreatedDateText(): Promise<string> {
    return allure.step('Read created date on detail page', async () => {
      const dateEl = this.page.locator('[class*="date"], .news-date').first();
      return (await dateEl.textContent())?.trim() ?? '';
    });
  }

  async getTagsText(): Promise<string> {
    return allure.step('Read tags on detail page', async () => {
      return (await this.page.locator('main').innerText()) ?? '';
    });
  }
}
