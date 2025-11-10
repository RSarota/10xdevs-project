import { expect, type Locator, type Page } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;
  readonly form: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly deleteAccountButton: Locator;
  readonly deleteConfirmModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId("profile-form");
    this.emailInput = page.getByTestId("profile-email-input");
    this.passwordInput = page.getByTestId("profile-password-input");
    this.confirmPasswordInput = page.getByTestId("profile-confirm-password-input");
    this.saveButton = page.getByTestId("profile-save-button");
    this.deleteAccountButton = page.getByTestId("profile-delete-account-button");
    this.deleteConfirmModal = page.getByTestId("alert-dialog");
    this.confirmDeleteButton = page.getByTestId("alert-dialog-primary-button");
    this.cancelDeleteButton = page.getByTestId("alert-dialog-cancel-button");
    this.successMessage = page.getByText(/profil został zaktualizowany|konto zostało usunięte/i);
    this.errorMessage = page.locator('[data-testid$="-error"]').or(page.getByText(/błąd|nie udało się/i));
    this.emailError = page.getByTestId("profile-email-input-error");
  }

  async goto() {
    await this.page.goto("/profile");
    await this.waitForReady();
  }

  async waitForLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async updateEmail(email: string) {
    await this.waitForReady();
    await this.emailInput.fill(email);
    await this.saveButton.click();
  }

  async updatePassword(password: string, confirmPassword: string) {
    await this.waitForReady();
    await this.passwordInput.fill(password);
    const confirmInput = this.page.getByTestId("profile-confirm-password-input");
    await confirmInput.waitFor({ state: "visible" });
    await confirmInput.fill(confirmPassword);
    await this.saveButton.click();
  }

  async clickDeleteAccount() {
    await this.waitForReady();
    await this.deleteAccountButton.click();
  }

  async confirmDeleteAccount() {
    await this.confirmDeleteButton.click();
  }

  async cancelDeleteAccount() {
    await this.cancelDeleteButton.click();
  }

  async deleteAccount() {
    await this.clickDeleteAccount();
    await this.confirmDeleteAccount();
  }

  async waitForSuccess() {
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
