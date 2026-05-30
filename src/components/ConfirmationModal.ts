import { Locator, Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { MESSAGES } from '../utils/constants';

export class ConfirmationModal {
  readonly continueEditingButton: Locator;
  readonly yesCancelButton: Locator;

  constructor(private readonly page: Page) {
    this.continueEditingButton = page.getByRole('button', { name: /Continue editing/i });
    this.yesCancelButton = page.getByRole('button', { name: /Yes, cancel/i });
  }

  async expectCancelMessage(): Promise<void> {
    await allure.step('Verify cancel confirmation message', async () => {
      await this.page.getByText(MESSAGES.cancelModal).waitFor({ state: 'visible' });
    });
  }

  async confirmCancel(): Promise<void> {
    await allure.step('Confirm cancellation (Yes, cancel)', async () => {
      await this.yesCancelButton.click();
    });
  }

  async continueEditing(): Promise<void> {
    await allure.step('Dismiss modal (Continue editing)', async () => {
      await this.continueEditingButton.click();
    });
  }
}
