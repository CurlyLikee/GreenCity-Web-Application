import { test as base } from '@playwright/test';
import { AuthPage, UserCredentials } from '../pages/AuthPage';
import { NewsPage } from '../pages/NewsPage';
import { CreateNewsPage } from '../pages/CreateNewsPage';
import { NewsPreviewPage } from '../pages/NewsPreviewPage';
import { NewsDetailPage } from '../pages/NewsDetailPage';
import { EditNewsPage } from '../pages/EditNewsPage';
import { getTestUser } from '../utils/testUser';
import { greenCityUrl } from '../utils/url';

type Fixtures = {
  authPage: AuthPage;
  newsPage: NewsPage;
  createNewsPage: CreateNewsPage;
  newsPreviewPage: NewsPreviewPage;
  newsDetailPage: NewsDetailPage;
  editNewsPage: EditNewsPage;
  authenticatedUser: UserCredentials;
};

export const test = base.extend<Fixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  newsPage: async ({ page }, use) => {
    await use(new NewsPage(page));
  },
  createNewsPage: async ({ page }, use) => {
    await use(new CreateNewsPage(page));
  },
  newsPreviewPage: async ({ page }, use) => {
    await use(new NewsPreviewPage(page));
  },
  newsDetailPage: async ({ page }, use) => {
    await use(new NewsDetailPage(page));
  },
  editNewsPage: async ({ page }, use) => {
    await use(new EditNewsPage(page));
  },
  authenticatedUser: async ({ page }, use) => {
    const user = getTestUser();

    // Session restored from auth.setup.ts (storageState); only set English UI.
    await page.goto(greenCityUrl('/news'), { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('language', 'en'));
    await page.reload({ waitUntil: 'networkidle' });

    const signedIn = !(await page.locator('a.header_sign-in-link').isVisible().catch(() => true));
    if (!signedIn) {
      throw new Error(
        'Not logged in. Run tests with default config (setup project) or verify email for the account in .env',
      );
    }

    await use(user);
  },
});

export { expect } from '@playwright/test';
