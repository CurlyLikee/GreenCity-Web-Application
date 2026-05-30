import { UserCredentials } from '../pages/AuthPage';

/** Test account from .env (see .env.example). */
export function getTestUser(): UserCredentials {
  return {
    email: process.env.GC_USER_EMAIL || 'totktozaidetnamoupohtytotlox@gmail.com',
    password: process.env.GC_USER_PASSWORD || 'VirtuCircuit_Pro1',
    firstName: process.env.GC_USER_NAME || 'ex',
  };
}

