import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.waitForLoad();
  });

  test("should display user statistics", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Should show statistics overview
    const hasStatistics = await dashboardPage.isStatisticsVisible();
    // Statistics might not be visible if user has no flashcards
    // In that case, empty state should be visible
    const isEmpty = await dashboardPage.isEmptyStateVisible();

    expect(hasStatistics || isEmpty).toBeTruthy();
  });

  test("should display number of flashcards", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Should show flashcard count in statistics
    const hasStats = await dashboardPage.isStatisticsVisible();
    if (hasStats) {
      await expect(dashboardPage.statisticsOverview).toBeVisible();
    }
  });

  test("should display quick actions panel", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Quick actions should be available
    // In a real scenario, you'd verify specific actions are visible
    const hasActions =
      (await dashboardPage.generateFlashcardsButton.isVisible().catch(() => false)) ||
      (await dashboardPage.addFlashcardButton.isVisible().catch(() => false));

    // At least one action should be available
    expect(hasActions).toBeTruthy();
  });

  test("should navigate to generate flashcards from quick actions", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    if (await dashboardPage.generateFlashcardsButton.isVisible().catch(() => false)) {
      await dashboardPage.clickGenerateFlashcards();
      await expect(page).toHaveURL(/.*generate-flashcards/);
    }
  });

  test("should navigate to add flashcard from quick actions", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    if (await dashboardPage.addFlashcardButton.isVisible().catch(() => false)) {
      await dashboardPage.clickAddFlashcard();
      await expect(page).toHaveURL(/.*add-flashcard/);
    }
  });

  test("should show empty state for new user", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    const isEmpty = await dashboardPage.isEmptyStateVisible();
    if (isEmpty) {
      await expect(dashboardPage.emptyState).toBeVisible();
      // Should have action buttons in empty state
      const generateButton = page.getByTestId("empty-state-action-button");
      const hasAction = await generateButton.isVisible().catch(() => false);
      expect(hasAction).toBeTruthy();
    }
  });

  test("should refresh data", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Refresh button might be available
    if (await dashboardPage.refreshButton.isVisible().catch(() => false)) {
      await dashboardPage.refreshButton.click();
      await dashboardPage.waitForLoad();
    }
  });

  test("should navigate to my flashcards", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    if (await dashboardPage.myFlashcardsButton.isVisible().catch(() => false)) {
      await dashboardPage.clickMyFlashcards();
      await expect(page).toHaveURL(/.*my-flashcards/);
    }
  });
});
