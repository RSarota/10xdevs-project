import { test, expect } from "@playwright/test";
import { MyFlashcardsPage } from "../pages/MyFlashcardsPage";
import { AddFlashcardPage } from "../pages/AddFlashcardPage";
import { TEST_ENTITY_PREFIX } from "../fixtures/test-data";
import { teardownE2E } from "../utils/e2e-teardown";

test.describe.configure({ mode: "serial" });

test.describe("Flashcard Deletion", () => {
  let createdFront = "";
  let createdBack = "";

  test.beforeEach(async ({ page }) => {
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    createdFront = `${TEST_ENTITY_PREFIX} delete front ${Date.now()}`;
    createdBack = `${TEST_ENTITY_PREFIX} delete back ${Date.now()}`;
    await addPage.createFlashcard(createdFront, createdBack);
    await addPage.waitForSuccess();

    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();

    // Ensure the newly created flashcard is visible before running each test
    const createdCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    await expect(createdCard).toHaveCount(1, { timeout: 15000 });
  });

  test.afterEach(teardownE2E);

  test("should show delete option in flashcard list", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Set up response promise BEFORE navigation to catch the API call
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/flashcards") && response.request().method() === "GET"
    );

    // Refresh the page to ensure we have the latest data after flashcard creation
    await myFlashcardsPage.goto();

    // Wait for the flashcards API response to complete
    await responsePromise;

    await myFlashcardsPage.waitForLoad();

    // Scope search to flashcards list container to avoid matching parent divs
    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    await expect(targetCard).toHaveCount(1, { timeout: 10000 });

    // Delete button should be visible on the target flashcard
    const deleteButton = targetCard.first().getByRole("button", { name: /usuń|delete/i });
    await expect(deleteButton).toBeVisible();
  });

  test("should open confirmation modal when clicking delete", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Set up response promise BEFORE navigation to catch the API call
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/flashcards") && response.request().method() === "GET"
    );

    // Refresh the page to ensure we have the latest data after flashcard creation
    await myFlashcardsPage.goto();

    // Wait for the flashcards API response to complete
    await responsePromise;

    await myFlashcardsPage.waitForLoad();

    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    // Use expect() which auto-waits and retries, following Playwright best practices
    await expect(targetCard).toHaveCount(1, { timeout: 10000 });
    await expect(targetCard.first()).toBeVisible();
    await targetCard
      .first()
      .getByRole("button", { name: /usuń|delete/i })
      .click();

    // Should show confirmation modal
    await expect(myFlashcardsPage.confirmationModal).toBeVisible({ timeout: 5000 });
    await expect(myFlashcardsPage.confirmDeleteButton).toBeVisible();
    await expect(myFlashcardsPage.cancelDeleteButton).toBeVisible();
  });

  test("should confirm deletion", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Set up response promise BEFORE navigation to catch the API call
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/flashcards") && response.request().method() === "GET"
    );

    // Refresh the page to ensure we have the latest data after flashcard creation
    await myFlashcardsPage.goto();

    // Wait for the flashcards API response to complete
    await responsePromise;

    await myFlashcardsPage.waitForLoad();

    // Wait for the specific flashcard we created to appear (by its unique text)
    // Use expect() which auto-waits and retries, following Playwright best practices
    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    await expect(targetCard).toHaveCount(1, { timeout: 10000 });
    await expect(targetCard.first()).toBeVisible();

    // Wait for DELETE request to complete
    const deletePromise = page.waitForResponse(
      (response) => response.url().includes("/api/flashcards/") && response.request().method() === "DELETE"
    );

    await targetCard
      .first()
      .getByRole("button", { name: /usuń|delete/i })
      .click();
    await myFlashcardsPage.confirmDelete();

    // Wait for modal to close
    await expect(myFlashcardsPage.confirmationModal).not.toBeVisible();

    // Wait for deletion to complete
    await deletePromise;

    // Wait for the flashcard to be removed from the DOM
    // This also implicitly waits for any refetch to complete
    // Use expect().toHaveCount() which waits and retries, following Playwright best practices
    const remainingCards = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    await expect(remainingCards).toHaveCount(0, { timeout: 10000 });
  });

  test("should cancel deletion", async ({ page }) => {
    const myFlashcardsPage = new MyFlashcardsPage(page);

    // Set up response promise BEFORE navigation to catch the API call
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/flashcards") && response.request().method() === "GET"
    );

    // Refresh the page to ensure we have the latest data after flashcard creation
    await myFlashcardsPage.goto();

    // Wait for the flashcards API response to complete
    await responsePromise;

    await myFlashcardsPage.waitForLoad();

    const targetCard = myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront });
    await expect(targetCard).toHaveCount(1, { timeout: 10000 });
    await targetCard
      .first()
      .getByRole("button", { name: /usuń|delete/i })
      .click();
    await myFlashcardsPage.cancelDelete();

    // Modal should be closed, flashcard still in list
    await expect(myFlashcardsPage.confirmationModal).not.toBeVisible();
    const remaining = await myFlashcardsPage.flashcardsList
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: createdFront })
      .count();
    expect(remaining).toBeGreaterThan(0);
  });
});
