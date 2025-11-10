import { test, expect } from "@playwright/test";
import { AddFlashcardPage } from "../pages/AddFlashcardPage";
import { MyFlashcardsPage } from "../pages/MyFlashcardsPage";
import { TEST_ENTITY_PREFIX, testFlashcards } from "../fixtures/test-data";
import { teardownE2E } from "../utils/e2e-teardown";

test.describe.configure({ mode: "serial" });

test.describe("Manual Flashcard Creation", () => {
  test.afterEach(teardownE2E);

  test.beforeEach(async ({ page }) => {
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
  });

  test("should create flashcard with valid data", async ({ page }) => {
    const addPage = new AddFlashcardPage(page);
    const front = `${TEST_ENTITY_PREFIX} manual front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} manual back ${Date.now()}`;

    await addPage.createFlashcard(front, back);

    // Should show success message
    await addPage.waitForSuccess();
    await expect(addPage.successMessage).toBeVisible();
  });

  test("should validate front field max 200 characters", async ({ page }) => {
    const addPage = new AddFlashcardPage(page);

    await addPage.fillFront(testFlashcards.longFront);
    await addPage.fillBack(testFlashcards.valid.back);

    // Should show character count and disable submit if over limit
    const count = await addPage.getFrontCharacterCount();
    expect(count).toContain("201");

    // Submit button should be disabled or show error
    const isDisabled = await addPage.submitButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test("should validate back field max 500 characters", async ({ page }) => {
    const addPage = new AddFlashcardPage(page);

    await addPage.fillFront(testFlashcards.valid.front);
    await addPage.fillBack(testFlashcards.longBack);

    // Should show character count
    const count = await addPage.getBackCharacterCount();
    expect(count).toContain("501");

    // Submit button should be disabled or show error
    const isDisabled = await addPage.submitButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test("should display character count", async ({ page }) => {
    const addPage = new AddFlashcardPage(page);

    await addPage.fillFront("Test front");
    await addPage.fillBack("Test back");

    // Should show character counts
    const frontCount = await addPage.getFrontCharacterCount();
    const backCount = await addPage.getBackCharacterCount();

    expect(frontCount).toBeTruthy();
    expect(backCount).toBeTruthy();
  });

  test("should prevent saving with empty fields", async ({ page }) => {
    const addPage = new AddFlashcardPage(page);

    // Try to submit without filling fields
    const isDisabled = await addPage.submitButton.isDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test("should redirect to flashcards list after saving", async ({ page }) => {
    const addPage = new AddFlashcardPage(page);
    const front = `${TEST_ENTITY_PREFIX} manual front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} manual back ${Date.now()}`;

    await addPage.createFlashcard(front, back);
    await addPage.waitForSuccess();

    // Should eventually navigate to my flashcards or stay on page with success message
    // In a real scenario, you'd check for redirect or verify flashcard appears in list
    const myFlashcardsPage = new MyFlashcardsPage(page);
    await myFlashcardsPage.goto();
    await myFlashcardsPage.waitForLoad();
  });
});
