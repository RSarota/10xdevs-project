import { expect, type Locator, type Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly form: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly errorMessage: Locator;
  readonly generalError: Locator;
  readonly successMessage: Locator;
  readonly goToLoginButton: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId("register-form");
    this.nameInput = page.getByLabel(/imię/i);
    this.emailInput = page.getByLabel(/adres e-mail/i);
    // Use exact match for password to avoid matching "Potwierdź hasło"
    this.passwordInput = page.getByLabel("Hasło", { exact: true });
    this.confirmPasswordInput = page.getByLabel(/potwierdź hasło/i);
    this.submitButton = page.getByRole("button", { name: /zarejestruj się/i });
    this.loginLink = page.getByRole("link", { name: /zaloguj się/i });
    // Error messages - rely on explicit data-testid attributes
    this.errorMessage = page.locator('[data-testid$="-error"]');
    this.nameError = page.getByTestId("register-name-input-error");
    this.emailError = page.getByTestId("register-email-input-error");
    this.passwordError = page.getByTestId("register-password-input-error");
    this.confirmPasswordError = page.getByTestId("register-confirm-password-input-error");
    this.generalError = page.getByTestId("register-general-error");
    this.successMessage = page.getByTestId("register-success-message");
    this.goToLoginButton = page.getByTestId("register-go-to-login-button");
  }

  async goto() {
    await this.page.goto("/auth/register");
    await this.waitForReady();
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(name: string, email: string, password: string, confirmPassword?: string) {
    await this.waitForReady();
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword || password);
    await this.submit();
  }

  async clickLogin() {
    await this.loginLink.click();
  }

  async waitForSuccessMessage() {
    await this.successMessage.waitFor({ timeout: 5000 });
  }

  async waitForRedirect(expectedPath: string) {
    await this.page.waitForURL(`**${expectedPath}`, { timeout: 5000 });
  }

  async waitForReady() {
    await this.form.waitFor({ state: "attached", timeout: 15000 });
    await expect(this.form).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  }
}
