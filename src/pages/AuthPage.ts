import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { BasePage } from './BasePage';
import { greenCityUrl } from '../utils/url';

export interface UserCredentials {
  email: string;
  password: string;
  firstName: string;
}

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async register(user: UserCredentials): Promise<void> {
    await allure.step(`Register user ${user.email}`, async () => {
      await this.page.goto(greenCityUrl('/news'), { waitUntil: 'networkidle' });
      await this.header.dismissSiteWarning();
      await this.setEnglish();
      await this.header.openSignIn();
      await this.header.openSignUpFromSignIn();

      await this.page.locator('input[formcontrolname="firstName"]').fill(user.firstName);
      await this.page.locator('input[formcontrolname="email"]').fill(user.email);
      await this.page.locator('input[formcontrolname="password"]').fill(user.password);
      await this.page.locator('input[formcontrolname="repeatPassword"]').fill(user.password);

      const [signUpResponse] = await Promise.all([
        this.page.waitForResponse(
          (r) => r.url().includes('signUp') && r.request().method() === 'POST',
          { timeout: 30_000 },
        ),
        this.page.locator('button.greenStyle').filter({ hasText: /Sign up|Зареєструватися/i }).first().click(),
      ]);

      if (!signUpResponse.ok() && signUpResponse.status() !== 400) {
        const body = await signUpResponse.text().catch(() => '');
        throw new Error(`Sign-up failed (${signUpResponse.status()}): ${body}`);
      }

      await this.page.waitForTimeout(2000);
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    await allure.step(`Sign in as ${email}`, async () => {
      await this.page.goto(greenCityUrl('/news'), { waitUntil: 'networkidle' });
      await this.header.dismissSiteWarning();
      await this.setEnglish();
      await this.signInWithCredentials(email, password);
    });
  }

  /** Sign in; if account missing, register then sign in again. */
  async ensureAuthenticated(user: UserCredentials): Promise<void> {
    await allure.step('Ensure user is authenticated', async () => {
      try {
        await this.signIn(user.email, user.password);
      } catch {
        await this.register(user);
        await this.signIn(user.email, user.password);
      }
    });
  }

  private async signInWithCredentials(email: string, password: string): Promise<void> {
    await allure.step(`Authenticate as ${email}`, async () => {
      await this.header.openSignIn();
      await this.page.locator('input[formcontrolname="email"]').fill(email);
      await this.page.locator('input[formcontrolname="password"]').fill(password);

      const [signInResponse] = await Promise.all([
        this.page.waitForResponse(
          (r) => r.url().includes('signIn') && r.request().method() === 'POST',
          { timeout: 30_000 },
        ),
        this.page.locator('button.greenStyle').filter({ hasText: /Sign in|Увійти/i }).first().click(),
      ]);

      if (!signInResponse.ok()) {
        const body = await signInResponse.text().catch(() => '');
        if (body.includes('not verified')) {
          throw new Error(
            `Account ${email} is not verified. Open the confirmation email and verify, then run tests again.`,
          );
        }
        throw new Error(`Sign-in failed (${signInResponse.status()}): ${body}`);
      }

      await this.page.waitForURL(/\/news/, { timeout: 30_000 });
      await this.page.locator('a.header_sign-in-link').waitFor({ state: 'hidden', timeout: 15_000 });
    });
  }
}
