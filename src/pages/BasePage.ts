import { Page } from '@playwright/test';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export abstract class BasePage {
  readonly header: Header;
  readonly footer: Footer;

  constructor(protected readonly page: Page) {
    this.header = new Header(page);
    this.footer = new Footer(page);
  }

  async setEnglish(): Promise<void> {
    await this.header.setEnglish();
  }
}
