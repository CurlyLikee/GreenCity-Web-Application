import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BasePage } from './BasePage';
import { ROUTES } from '../utils/constants';
import { greenCityUrl } from '../utils/url';

export class NewsPage extends BasePage {
  readonly createNewsButton: ReturnType<Page['locator']>;

  constructor(page: Page) {
    super(page);
    this.createNewsButton = page.locator('a, button').filter({ hasText: /Create news|Створити новину/i });
  }

  async open(): Promise<void> {
    await allure.step('Open Eco news page', async () => {
      await this.page.goto(greenCityUrl(ROUTES.news));
      await this.page.waitForURL(/\/news/);
    });
  }

  async openCreateNews(): Promise<void> {
    await allure.step('Open Create News form', async () => {
      await this.page.goto(greenCityUrl(ROUTES.createNews));
      await this.page.waitForURL(/create-news/);
    });
  }

  async expectOnNewsPage(): Promise<void> {
    await allure.step('Verify user is on news page', async () => {
      await this.page.waitForURL(/\/news\/?$/);
    });
  }
}
