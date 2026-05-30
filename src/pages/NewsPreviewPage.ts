import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BasePage } from './BasePage';
import { getTestUser } from '../utils/testUser';

export class NewsPreviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectTitleVisible(title: string): Promise<void> {
    await allure.step(`Verify preview shows title: ${title}`, async () => {
      await this.page.getByText(title, { exact: true }).waitFor({ state: 'visible' });
    });
  }

  async expectContentVisible(content: string): Promise<void> {
    await allure.step('Verify preview shows main text', async () => {
      await this.page.getByText(content).waitFor({ state: 'visible' });
    });
  }

  async expectDateVisible(): Promise<void> {
    await allure.step('Verify preview shows current date', async () => {
      await this.page.getByText(/Date:|May \d+, \d{4}|\d{1,2} [A-Za-z]+ \d{4}/i).waitFor({ state: 'visible' });
    });
  }

  async expectAuthorVisible(): Promise<void> {
    await allure.step('Verify preview shows author block', async () => {
      const authorName = getTestUser().firstName;
      await this.page
        .getByText(new RegExp(`Author:|by\\s+${authorName}`, 'i'))
        .first()
        .waitFor({ state: 'visible' });
    });
  }

  async expectBackToEditingVisible(): Promise<void> {
    await allure.step('Verify Back to editing control is available', async () => {
      await this.page
        .locator('a, button')
        .filter({ hasText: /Back to editing|Return to editing|back to editing/i })
        .first()
        .waitFor({ state: 'visible', timeout: 15_000 });
    });
  }
}
