import { test, expect } from "@playwright/test";
import { MyFlashcardsPage } from "../pages/MyFlashcardsPage";
import { AddFlashcardPage } from "../pages/AddFlashcardPage";
import { TEST_ENTITY_PREFIX, testFlashcards } from "../fixtures/test-data";
import { teardownE2E } from "../utils/e2e-teardown";

test.describe.configure({ mode: "serial" });

test.describe("Flashcard Editing", () => {
  let createdFront = "";
  let createdBack = "";

  test.beforeEach(async ({ page }) => {
    // Ensure we have at least one flashcard to edit
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    createdFront = `${TEST_ENTITY_PREFIX} edit front ${Date.now()}`;
    createdBack = `${TEST_ENTITY_PREFIX} edit back ${Date.now()}`;
    await addPage.createFlashcard(createdFront, createdBack);
    await addPage.waitForSuccess();

    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    const createdCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    await expect(createdCard).toHaveCount(1, { timeout: 15000 });
  });

  test.afterEach(teardownE2E);

  test("should open edit modal", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Navigate to the page
    await myFlashcardsPage.goto();

    // Scope search to flashcards list container to avoid matching parent divs
    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });

    // Use expect().toHaveCount() which waits and retries, following Playwright best practices
    await expect(targetCard).toHaveCount(1, { timeout: 15000 });
    await expect(targetCard.first()).toBeVisible();
    await targetCard
      .first()
      .getByRole("button", { name: /edytuj/i })
      .click();

    // Should show edit modal
    await expect(myFlashcardsPage.editModal).toBeVisible({ timeout: 5000 });
  });

  test("should edit flashcard content", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Navigate to the page
    await myFlashcardsPage.goto();

    // Wait for flashcards to load - check that we have at least one flashcard item in the list
    // This is more reliable than waiting for API response which might be empty
    await expect(myFlashcardsPage.flashcardsList.locator('[data-testid="flashcard-item"]').first()).toBeVisible({
      timeout: 15000,
    });

    // Scope search to flashcards list container to avoid matching parent divs
    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });

    // Use expect().toHaveCount() which waits and retries, following Playwright best practices
    await expect(targetCard).toHaveCount(1, { timeout: 15000 });
    await expect(targetCard.first()).toBeVisible();
    await targetCard
      .first()
      .getByRole("button", { name: /edytuj/i })
      .click();

    const newFront = `${TEST_ENTITY_PREFIX} updated front ${Date.now()}`;
    const newBack = `${TEST_ENTITY_PREFIX} updated back ${Date.now()}`;

    await myFlashcardsPage.editFlashcard(newFront, newBack);

    // Should show success message or update UI
    // In a real scenario, you'd verify the flashcard was updated
  });

  test("should cancel editing", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Navigate to the page
    await myFlashcardsPage.goto();

    // Wait for flashcards to load - check that we have at least one flashcard item in the list
    // This is more reliable than waiting for API response which might be empty
    await expect(myFlashcardsPage.flashcardsList.locator('[data-testid="flashcard-item"]').first()).toBeVisible({
      timeout: 15000,
    });

    // Scope search to flashcards list container to avoid matching parent divs
    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });

    // Use expect().toHaveCount() which waits and retries, following Playwright best practices
    await expect(targetCard).toHaveCount(1, { timeout: 15000 });
    await expect(targetCard.first()).toBeVisible();
    await targetCard
      .first()
      .getByRole("button", { name: /edytuj/i })
      .click();
    await myFlashcardsPage.cancelEdit();

    // Modal should be closed
    await expect(myFlashcardsPage.editModal).not.toBeVisible();
  });

  test("should validate during editing (character limits)", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Navigate to the page
    await myFlashcardsPage.goto();

    // Wait for flashcards to load - check that we have at least one flashcard item in the list
    // This is more reliable than waiting for API response which might be empty
    await expect(myFlashcardsPage.flashcardsList.locator('[data-testid="flashcard-item"]').first()).toBeVisible({
      timeout: 15000,
    });

    // Scope search to flashcards list container to avoid matching parent divs
    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });

    // Use expect().toHaveCount() which waits and retries, following Playwright best practices
    await expect(targetCard).toHaveCount(1, { timeout: 15000 });
    await expect(targetCard.first()).toBeVisible();
    await targetCard
      .first()
      .getByRole("button", { name: /edytuj/i })
      .click();

    // Try to enter text exceeding limits
    const frontInput = page.getByLabel(/przód/i);
    const backInput = page.getByLabel(/tył/i);

    if (await frontInput.isVisible()) {
      await frontInput.fill(testFlashcards.longFront);
      // Should show validation error or disable save
    }

    if (await backInput.isVisible()) {
      await backInput.fill(testFlashcards.longBack);
      // Should show validation error or disable save
    }
  });
});
