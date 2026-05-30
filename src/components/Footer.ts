import { Locator, Page } from '@playwright/test';
import * as allure from 'allure-js-commons';

export class Footer {
  readonly root: Locator;
  readonly ecoNewsLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('footer');
    this.ecoNewsLink = this.root.locator('a.footer_link-item').filter({ hasText: /Eco news|Еко новини/i });
  }

  async isVisible(): Promise<boolean> {
    return allure.step('Verify footer is visible', async () => this.root.isVisible());
  }
}
