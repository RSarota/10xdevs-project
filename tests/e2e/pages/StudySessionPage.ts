import { expect, type Page, type Locator } from "@playwright/test";

export class StudySessionPage {
  readonly page: Page;
  readonly flashcardCard: Locator;
  readonly flashcardFront: Locator;
  readonly flashcardBack: Locator;
  readonly revealHint: Locator;
  readonly ratingControls: Locator;
  readonly ratingButton1: Locator;
  readonly ratingButton2: Locator;
  readonly ratingButton3: Locator;
  readonly ratingButton4: Locator;
  readonly ratingButton5: Locator;
  readonly sessionHeader: Locator;
  readonly progressBar: Locator;
  readonly endSessionButton: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly emptyState: Locator;
  readonly sessionCompleteMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.flashcardCard = page.locator('[data-testid="flashcard-view"]');
    this.flashcardFront = page.getByText(/przód/i).first();
    this.flashcardBack = page.getByText(/tył/i).first();
    this.revealHint = page.getByText(/kliknij, aby odsłonić/i);
    this.ratingControls = page.locator('[data-testid="rating-controls"]');
    this.ratingButton1 = page.locator('[data-testid="rating-button-1"]');
    this.ratingButton2 = page.locator('[data-testid="rating-button-2"]');
    this.ratingButton3 = page.locator('[data-testid="rating-button-3"]');
    this.ratingButton4 = page.locator('[data-testid="rating-button-4"]');
    this.ratingButton5 = page.locator('[data-testid="rating-button-5"]');
    this.sessionHeader = page.locator('[data-testid="study-session-header"]');
    this.progressBar = page.locator('[data-testid="study-session-progress"]');
    this.endSessionButton = page.locator('[data-testid="end-session-button"]');
    this.loadingIndicator = page.locator('[data-testid="study-session-loading"]');
    this.errorMessage = page.locator('[data-testid="study-session-error"]');
    this.emptyState = page.locator('[data-testid="study-session-empty"]');
    this.sessionCompleteMessage = page.locator('[data-testid="study-session-complete"]');
  }

  async goto() {
    await this.page.goto("/study");
  }

  async waitForLoad() {
    // Wait for study session API call to complete (success or error)
    try {
      await this.page.waitForResponse(
        (response) =>
          response.url().includes("/api/study/start") && (response.status() === 201 || response.status() >= 400),
        { timeout: 10000 }
      );
    } catch {
      // Response might have already completed
    }

    // Wait for one of the possible states: flashcard, empty state, or error
    await Promise.race([
      this.flashcardCard.waitFor({ timeout: 10000, state: "visible" }).catch(() => undefined),
      this.emptyState.waitFor({ timeout: 10000, state: "visible" }).catch(() => undefined),
      this.errorMessage.waitFor({ timeout: 10000, state: "visible" }).catch(() => undefined),
    ]);
  }

  async ensureSessionStarted() {
    await this.waitForLoad();

    // Check if there's an error or empty state
    const hasError = await this.errorMessage.isVisible().catch(() => false);
    const isEmpty = await this.emptyState.isVisible().catch(() => false);

    if (hasError) {
      const errorText = await this.errorMessage.textContent();
      throw new Error(`Study session failed to start: ${errorText || "Unknown error"}`);
    }

    if (isEmpty) {
      throw new Error("Study session failed to start: No flashcards available");
    }

    // Ensure flashcard is visible
    await expect(this.flashcardCard).toBeVisible({ timeout: 10000 });
  }

  async revealFlashcard() {
    await this.flashcardCard.click();
  }

  async rateFlashcard(rating: 1 | 2 | 3 | 4 | 5) {
    const buttonMap = {
      1: this.ratingButton1,
      2: this.ratingButton2,
      3: this.ratingButton3,
      4: this.ratingButton4,
      5: this.ratingButton5,
    };

    const button = buttonMap[rating];
    await button.waitFor({ timeout: 5000 });
    await button.click();

    // Wait for rating to be processed
    try {
      await this.page.waitForResponse(
        (response) => response.url().includes("/api/study/update") && response.status() === 200,
        { timeout: 5000 }
      );
    } catch {
      // Response might have already completed
    }
  }

  async endSession() {
    await this.endSessionButton.click();

    // Wait for completion API call
    try {
      await this.page.waitForResponse(
        (response) => response.url().includes("/api/study/complete") && response.status() === 200,
        { timeout: 5000 }
      );
    } catch {
      // Response might have already completed
    }
  }

  async getCurrentFlashcardText(): Promise<string | null> {
    // Wait for flashcard card to be visible
    await this.flashcardCard.waitFor({ timeout: 5000, state: "visible" }).catch(() => {
      return null;
    });

    // Get the Body element (p tag) that contains the flashcard text
    // The flashcard text is in a p element inside the flashcard-view, but not in the footnotes
    const flashcardTextElement = this.flashcardCard
      .locator("p")
      .filter({
        hasNotText: /przód|tył|kliknij/i,
      })
      .first();

    if (await flashcardTextElement.isVisible().catch(() => false)) {
      const text = await flashcardTextElement.textContent();
      return text?.trim() || null;
    }
    return null;
  }

  async isFlashcardRevealed(): Promise<boolean> {
    return await this.flashcardBack.isVisible().catch(() => false);
  }

  async getProgressText(): Promise<string | null> {
    const progressText = this.page.getByText(/\d+\/\d+/).first();
    if (await progressText.isVisible().catch(() => false)) {
      return await progressText.textContent();
    }
    return null;
  }

  async waitForSessionComplete() {
    // Wait for completion message to appear (primary behavior)
    try {
      await this.sessionCompleteMessage.waitFor({ state: "visible", timeout: 10000 });
      return;
    } catch {
      // Fallback: if completion message doesn't appear, check if we're on history page
      // This handles edge cases where app might redirect instead of showing banner
      try {
        await this.page.waitForURL("**/study/history", { timeout: 5000 });
        return;
      } catch {
        // If neither works, throw error with helpful message
        throw new Error(
          "Session completion not detected - neither completion message nor history page navigation occurred"
        );
      }
    }
  }
}
