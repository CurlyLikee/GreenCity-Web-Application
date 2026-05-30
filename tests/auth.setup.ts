import { test as setup } from '@playwright/test';
import path from 'path';
import { AuthPage } from '../src/pages/AuthPage';
import { getTestUser } from '../src/utils/testUser';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

/**
 * Runs once before all tests. Saves browser session after successful sign-in.
 * Requires a verified account in .env (one-time email confirmation on greencity.cx.ua).
 */
setup('authenticate and save session', async ({ page }) => {
  const authPage = new AuthPage(page);
  const user = getTestUser();

  await authPage.ensureAuthenticated(user);
  await page.context().storageState({ path: authFile });
});
