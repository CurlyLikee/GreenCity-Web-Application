import { Locator, Page } from '@playwright/test';
import * as allure from 'allure-js-commons';

export class NewsCard {
  constructor(
    private readonly page: Page,
    private readonly card: Locator,
  ) {}

  static firstOnPage(page: Page): NewsCard {
    return new NewsCard(page, page.locator('a.link').first());
  }

  static byTitle(page: Page, title: string): NewsCard {
    return new NewsCard(page, page.locator('a.link').filter({ hasText: title }).first());
  }

  async open(): Promise<void> {
    await allure.step('Open news card', async () => {
      await this.card.click();
      await this.page.waitForURL(/\/news\/\d+/);
    });
  }

  async getTagsText(): Promise<string> {
    return allure.step('Read tags from news card', async () => (await this.card.textContent()) ?? '');
  }
}
