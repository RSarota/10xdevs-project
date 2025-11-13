import type { Page, Locator } from "@playwright/test";

export class MyFlashcardsPage {
  readonly page: Page;
  readonly flashcardsList: Locator;
  readonly flashcardItem: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly emptyState: Locator;
  readonly filterControls: Locator;
  readonly paginationControls: Locator;
  readonly confirmationModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;
  readonly editModal: Locator;
  readonly saveEditButton: Locator;
  readonly cancelEditButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.flashcardsList = page.locator('[data-testid="flashcards-list"]');
    this.flashcardItem = page
      .locator('[data-testid="flashcard-item"]')
      .or(page.locator("div").filter({ hasText: /przód|tył/i }));
    this.editButton = page.getByTestId("flashcard-edit-button");
    this.deleteButton = page.getByTestId("flashcard-delete-button");
    this.emptyState = page.getByText(/brak fiszek/i);
    this.filterControls = page.locator('[data-testid="filter-controls"]');
    this.paginationControls = page.locator('[data-testid="pagination-controls"]');
    this.confirmationModal = page.getByText(/czy na pewno chcesz usunąć/i);
    this.confirmDeleteButton = page.getByTestId("alert-dialog-primary-button");
    this.cancelDeleteButton = page.getByTestId("alert-dialog-cancel-button");
    this.editModal = page.getByText(/edytuj fiszkę/i);
    this.saveEditButton = page.getByRole("button", { name: /zapisz zmiany/i });
    this.cancelEditButton = page.getByRole("button", { name: /anuluj/i });
  }

  async goto() {
    await this.page.goto("/my-flashcards");
  }

  async waitForLoad() {
    // Try to wait for the flashcards API request to complete
    // If it already happened (e.g., test already waited for it), this will timeout quickly
    // and we'll proceed to wait for UI state
    try {
      await this.page.waitForResponse(
        (response) => response.url().includes("/api/flashcards") && response.status() === 200,
        { timeout: 2000 }
      );
    } catch {
      // Response already happened or will happen later - proceed to wait for UI
    }
    // Wait for loading state to finish - either flashcards appear or empty state is shown
    await Promise.race([
      this.flashcardItem
        .first()
        .waitFor({ timeout: 5000 })
        .catch(() => undefined),
      this.emptyState.waitFor({ timeout: 5000 }).catch(() => undefined),
    ]);
  }

  async getFlashcardCount(): Promise<number> {
    return await this.flashcardItem.count();
  }

  async clickEdit(index = 0) {
    const items = await this.flashcardItem.all();
    if (items[index]) {
      await items[index]
        .getByRole("button", { name: /edytuj/i })
        .first()
        .click();
    }
  }

  async clickDelete(index = 0) {
    const items = await this.flashcardItem.all();
    if (items[index]) {
      await items[index]
        .getByRole("button", { name: /usuń|delete/i })
        .first()
        .click();
    }
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async cancelDelete() {
    await this.cancelDeleteButton.click();
  }

  async editFlashcard(front: string, back: string) {
    if (await this.editModal.isVisible()) {
      const frontInput = this.page.getByTestId("edit-flashcard-front-input");
      const backInput = this.page.getByTestId("edit-flashcard-back-input");
      await frontInput.fill(front);
      await backInput.fill(back);
      await this.saveEditButton.click();
    }
  }

  async cancelEdit() {
    await this.cancelEditButton.click();
  }

  async isEmptyStateVisible(): Promise<boolean> {
    try {
      await this.emptyState.waitFor({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}
