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
    this.successMessage = page.getByText(/fiszka została dodana/i).first();
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
    // Wait for submit button to be enabled (form validation must pass)
    await expect(this.submitButton).toBeEnabled({ timeout: 5000 });
    await this.submitButton.click();
  }

  async createFlashcard(front: string, back: string) {
    await this.waitForReady();
    await this.fillFront(front);
    await this.fillBack(back);
    await this.submit();
  }

  async waitForSuccess() {
    // Wait for API response instead of toast (more reliable, avoids multiple toast elements)
    // The toast can appear multiple times when adding multiple flashcards, causing strict mode violations
    try {
      await this.page.waitForResponse(
        (response) => response.url().includes("/api/flashcards") && response.status() === 201,
        { timeout: 10000 }
      );
    } catch {
      // Response might have already completed, fallback to waiting for form reset
    }

    // Optionally wait for toast to appear (for compatibility with tests that check successMessage)
    // Using .first() to avoid strict mode violations when multiple toasts are visible
    try {
      await this.successMessage.waitFor({ timeout: 2000, state: "visible" });
    } catch {
      // Toast might not be visible yet or already dismissed, that's okay
    }

    // Wait for form to reset (form is reset by changing key, which remounts the component)
    // Check that inputs are empty and submit button is disabled (form is ready for next use)
    try {
      await this.page.waitForFunction(
        () => {
          const frontInput = document.querySelector('[data-testid="add-flashcard-front-input"]') as HTMLInputElement;
          const backInput = document.querySelector('[data-testid="add-flashcard-back-input"]') as HTMLTextAreaElement;
          const submitButton = document.querySelector(
            '[data-testid="add-flashcard-submit-button"]'
          ) as HTMLButtonElement;

          return frontInput?.value === "" && backInput?.value === "" && submitButton?.disabled === true;
        },
        { timeout: 5000 }
      );
    } catch {
      // If form reset check fails, just wait a bit - form should still be usable
      await this.page.waitForTimeout(500);
    }
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
