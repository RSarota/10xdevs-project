import { expect, type Locator, type Page } from "@playwright/test";

export class AddFlashcardPage {
  readonly page: Page;
  readonly form: Locator;
  readonly frontInput: Locator;
  readonly backTextarea: Locator;
  readonly submitButton: Locator;
  readonly frontCharacterCount: Locator;
  readonly backCharacterCount: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId("add-flashcard-form");
    this.frontInput = page.getByTestId("add-flashcard-front-input");
    this.backTextarea = page.getByTestId("add-flashcard-back-input");
    this.submitButton = page.getByTestId("add-flashcard-submit-button");
    this.frontCharacterCount = page.getByTestId("add-flashcard-front-count");
    this.backCharacterCount = page.getByTestId("add-flashcard-back-count");
    this.successMessage = page.getByText(/fiszka została dodana/i);
    this.errorMessage = page.getByText(/błąd|nie udało się/i);
  }

  async goto() {
    await this.page.goto("/add-flashcard");
    await this.waitForReady();
  }

  async fillFront(text: string) {
    await this.waitForReady();
    await this.frontInput.fill(text);
  }

  async fillBack(text: string) {
    await this.waitForReady();
    await this.backTextarea.fill(text);
  }

  async submit() {
    await this.waitForReady();
    await this.submitButton.click();
  }

  async createFlashcard(front: string, back: string) {
    await this.waitForReady();
    await this.fillFront(front);
    await this.fillBack(back);
    await this.submit();
  }

  async waitForSuccess() {
    await this.successMessage.waitFor({ timeout: 5000 });
  }

  async getFrontCharacterCount(): Promise<string | null> {
    try {
      return await this.frontCharacterCount.textContent();
    } catch {
      return null;
    }
  }

  async getBackCharacterCount(): Promise<string | null> {
    try {
      return await this.backCharacterCount.textContent();
    } catch {
      return null;
    }
  }

  async waitForReady() {
    await this.form.waitFor({ state: "attached", timeout: 15000 });
    await expect(this.form).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  }
}
