import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;
  readonly generalError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId("login-form");
    this.emailInput = page.getByLabel(/adres e-mail/i);
    this.passwordInput = page.getByLabel(/hasło/i);
    this.submitButton = page.getByRole("button", { name: /zaloguj się/i });
    this.forgotPasswordLink = page.getByRole("link", { name: /zapomniałeś hasła/i });
    this.registerLink = page.getByRole("link", { name: /zarejestruj się/i });
    // Error messages - rely on explicit data-testid attributes
    this.errorMessage = page.locator('[data-testid$="-error"]');
    this.emailError = page.getByTestId("login-email-input-error");
    this.passwordError = page.getByTestId("login-password-input-error");
    this.generalError = page.getByTestId("login-general-error");
  }

  async goto() {
    // Clear any existing session state to ensure we can access login page
    await this.page.context().clearCookies();
    // Wait for navigation to complete and verify we're on the login page
    await this.page.goto("/auth/login", { waitUntil: "networkidle" });
    // Verify we're actually on the login page (not redirected)
    await expect(this.page).toHaveURL(/\/auth\/login/, { timeout: 5000 });
    await this.waitForReady();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.waitForReady();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickRegister() {
    await this.registerLink.click();
  }

  async waitForRedirect(expectedPath: string) {
    // Check if already on expected path
    const currentUrl = this.page.url();
    if (currentUrl.includes(expectedPath)) {
      return;
    }

    // Wait for navigation to expected path
    // waitForURL handles both URL changes and window.location.href redirects
    try {
      await this.page.waitForURL(`**${expectedPath}`, { timeout: 15000 });
    } catch (error) {
      // If redirect didn't happen, check for login errors
      const currentUrl = this.page.url();
      if (currentUrl.includes("/auth/login")) {
        // Wait a bit for error messages to appear
        await this.page.waitForTimeout(1000);
        // Check if there's an error message visible
        const hasError = await this.generalError.isVisible().catch(() => false);
        if (hasError) {
          const errorText = await this.generalError.textContent();
          throw new Error(
            `Login failed - redirect to ${expectedPath} did not occur. Error: ${errorText || "Unknown error"}`
          );
        }
        throw new Error(`Expected redirect to ${expectedPath}, but still on login page. URL: ${currentUrl}`);
      }
      throw error;
    }
  }

  async waitForReady() {
    await this.form.waitFor({ state: "attached", timeout: 15000 });
    await expect(this.form).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  }
}
