import { Locator, Page } from '@playwright/test';
import * as allure from 'allure-js-commons';

export class Header {
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly ecoNewsLink: Locator;
  readonly langSwitcher: Locator;

  constructor(private readonly page: Page) {
    this.signInLink = page.locator('.header_sign-in-link');
    this.signUpLink = page.locator('a.green-link');
    this.ecoNewsLink = page.locator('a.url-name').filter({ hasText: /Eco news|Еко новини/i });
    this.langSwitcher = page.locator('.lang-option');
  }

  async dismissSiteWarning(): Promise<void> {
    await allure.step('Dismiss site testing warning if shown', async () => {
      const warningButton = this.page.locator('.warning_button_comment, .user-warning button');
      if (await warningButton.first().isVisible().catch(() => false)) {
        await warningButton.first().click();
      }
    });
  }

  async setEnglish(): Promise<void> {
    await allure.step('Switch UI language to English', async () => {
      await this.page.evaluate(() => localStorage.setItem('language', 'en'));
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.dismissSiteWarning();
    });
  }

  async openSignIn(): Promise<void> {
    await allure.step('Open Sign in dialog', async () => {
      await this.dismissSiteWarning();
      const signInIcon = this.page.locator('img[alt="sing in button"], img[alt*="sign in" i]');
      if (await signInIcon.isVisible().catch(() => false)) {
        await signInIcon.click();
      } else {
        await this.page.locator('a.header_sign-in-link').click({ force: true });
      }
    });
  }

  async openSignUpFromSignIn(): Promise<void> {
    await allure.step('Open Sign up form from Sign in dialog', async () => {
      await this.signUpLink.filter({ hasText: /Sign up|Зареєструватися/i }).click();
    });
  }

  async navigateToEcoNews(): Promise<void> {
    await allure.step('Navigate to Eco news via header', async () => {
      await this.ecoNewsLink.click();
      await this.page.waitForURL(/\/news/);
    });
  }
}
