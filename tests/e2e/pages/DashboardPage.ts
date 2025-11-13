import type { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly statisticsOverview: Locator;
  readonly quickActionsPanel: Locator;
  readonly generateFlashcardsButton: Locator;
  readonly addFlashcardButton: Locator;
  readonly myFlashcardsButton: Locator;
  readonly emptyState: Locator;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statisticsOverview = page
      .locator('[data-testid="statistics-overview"]')
      .or(page.getByText(/fiszek|generacji/i));
    this.quickActionsPanel = page.locator('[data-testid="quick-actions"]');
    this.generateFlashcardsButton = page
      .getByTestId("empty-state-action-button")
      .or(page.getByRole("button", { name: /(wy)?generuj fiszki/i }));
    this.addFlashcardButton = page.getByRole("button", { name: /dodaj fiszkę/i });
    this.myFlashcardsButton = page.getByRole("link", { name: /moje fiszki/i });
    this.emptyState = page.getByText(/brak fiszek/i);
    this.refreshButton = page.getByRole("button", { name: /odśwież/i });
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async waitForLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async clickGenerateFlashcards() {
    await this.generateFlashcardsButton.click();
  }

  async clickAddFlashcard() {
    await this.addFlashcardButton.click();
  }

  async clickMyFlashcards() {
    await this.myFlashcardsButton.click();
  }

  async isStatisticsVisible(): Promise<boolean> {
    try {
      await this.statisticsOverview.waitFor({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
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
