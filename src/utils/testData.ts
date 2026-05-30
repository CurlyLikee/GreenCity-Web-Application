export const VALID_MAIN_TEXT = 'This is a valid test content';
export const SHORT_MAIN_TEXT = 'Short text';
export const MIN_MAIN_TEXT = 'Test content with 20 chars';

export function generateTitle(prefix = 'Test'): string {
  return `${prefix} ${Date.now()}`;
}

export function generateLongTitle(length: number): string {
  return 'A'.repeat(length);
}

export function generateLongText(length: number): string {
  return 'B'.repeat(length);
}
