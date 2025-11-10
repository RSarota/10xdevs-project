import type { Page, Locator } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: /zaloguj się/i });
    this.registerButton = page.getByRole("button", { name: /zarejestruj się/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickRegister() {
    await this.registerButton.click();
  }
}
