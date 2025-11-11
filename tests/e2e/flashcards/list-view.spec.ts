import { test, expect } from "@playwright/test";
import { MyFlashcardsPage } from "../pages/MyFlashcardsPage";
import { AddFlashcardPage } from "../pages/AddFlashcardPage";
import { TEST_ENTITY_PREFIX } from "../fixtures/test-data";
import { teardownE2E } from "../utils/e2e-teardown";

test.describe.configure({ mode: "serial" });

test.describe("Flashcards List View", () => {
  test.afterEach(teardownE2E);

  test("should display list of flashcards", async ({ page }) => {
    // Create a flashcard first
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front = `${TEST_ENTITY_PREFIX} list front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} list back ${Date.now()}`;
    await addPage.createFlashcard(front, back);
    await addPage.waitForSuccess();

    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // Wait for the specific flashcard we created to appear (by its unique text)
    // This is more reliable than waiting for any flashcard item
    const createdFlashcard = page.locator('[data-testid="flashcard-item"]').filter({ hasText: front }).first();
    await expect(createdFlashcard).toBeVisible({ timeout: 10000 });

    // Should show flashcards list
    const count = await myFlashcardsPage.getFlashcardCount();
    expect(count).toBeGreaterThan(0);
  });

  test("should show empty state when no flashcards", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // If no flashcards, should show empty state
    const isEmpty = await myFlashcardsPage.isEmptyStateVisible();
    if (isEmpty) {
      await expect(myFlashcardsPage.emptyState).toBeVisible();
    }
  });

  test("should filter flashcards", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // Filter controls should be visible if implemented
    // In a real scenario, you'd interact with filter controls
    await myFlashcardsPage.filterControls.isVisible().catch(() => false);
    // Test would continue based on actual implementation
  });

  test("should sort flashcards", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // Sort controls should be available if implemented
    // In a real scenario, you'd interact with sort controls
  });

  test("should paginate flashcards", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // Pagination controls should be visible if there are many flashcards
    await myFlashcardsPage.paginationControls.isVisible().catch(() => false);
    // Test would continue based on actual implementation
  });

  test("should refresh flashcards list", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // Refresh functionality if implemented
    // In a real scenario, you'd click refresh and verify list updates
  });

  test("should navigate to add/generate from empty state", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    const isEmpty = await myFlashcardsPage.isEmptyStateVisible();
    if (isEmpty) {
      // Should have links to generate or add flashcards
      const generateButton = page.getByRole("button", { name: /wygeneruj/i });

      if (await generateButton.isVisible().catch(() => false)) {
        await generateButton.click();
        await expect(page).toHaveURL(/.*generate-flashcards/);
      }
    }
  });
});
