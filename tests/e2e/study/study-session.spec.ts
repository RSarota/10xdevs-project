import { test, expect } from "@playwright/test";
import { StudySessionPage } from "../pages/StudySessionPage";
import { AddFlashcardPage } from "../pages/AddFlashcardPage";
import { TEST_ENTITY_PREFIX } from "../fixtures/test-data";
import { teardownE2E } from "../utils/e2e-teardown";

test.describe.configure({ mode: "serial" });

test.describe("Study Session - Spaced Repetition", () => {
  test.afterEach(teardownE2E);

  test("should start a study session with available flashcards", async ({ page }) => {
    // Create flashcards first
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front1 = `${TEST_ENTITY_PREFIX} study front 1 ${Date.now()}`;
    const back1 = `${TEST_ENTITY_PREFIX} study back 1 ${Date.now()}`;
    await addPage.createFlashcard(front1, back1);
    await addPage.waitForSuccess();

    const front2 = `${TEST_ENTITY_PREFIX} study front 2 ${Date.now()}`;
    const back2 = `${TEST_ENTITY_PREFIX} study back 2 ${Date.now()}`;
    await addPage.createFlashcard(front2, back2);
    await addPage.waitForSuccess();

    // Wait for flashcards to be available in the database
    // Verify by checking the flashcards list page
    await page.goto("/my-flashcards");
    const createdFlashcard = page.locator('[data-testid="flashcard-item"]').filter({ hasText: front1 }).first();
    await expect(createdFlashcard).toBeVisible({ timeout: 10000 });

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.ensureSessionStarted();

    // Should see first flashcard
    const flashcardText = await studyPage.getCurrentFlashcardText();
    expect(flashcardText).toBeTruthy();
    expect(flashcardText).toContain(front1);

    // Should see session header
    await expect(studyPage.sessionHeader).toBeVisible();
  });

  test("should reveal flashcard back when clicked", async ({ page }) => {
    // Create a flashcard
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front = `${TEST_ENTITY_PREFIX} reveal front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} reveal back ${Date.now()}`;
    await addPage.createFlashcard(front, back);
    await addPage.waitForSuccess();

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // Initially should show front
    await expect(studyPage.flashcardFront).toBeVisible({ timeout: 5000 });
    const isRevealedBefore = await studyPage.isFlashcardRevealed();
    expect(isRevealedBefore).toBe(false);

    // Click to reveal
    await studyPage.revealFlashcard();

    // Should show back
    await expect(studyPage.flashcardBack).toBeVisible({ timeout: 5000 });
    const isRevealedAfter = await studyPage.isFlashcardRevealed();
    expect(isRevealedAfter).toBe(true);
  });

  test("should display rating controls after revealing flashcard", async ({ page }) => {
    // Create a flashcard
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front = `${TEST_ENTITY_PREFIX} rating front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} rating back ${Date.now()}`;
    await addPage.createFlashcard(front, back);
    await addPage.waitForSuccess();

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // Reveal flashcard
    await studyPage.revealFlashcard();

    // Should see rating controls
    await expect(studyPage.ratingButton1).toBeVisible({ timeout: 5000 });
    await expect(studyPage.ratingButton2).toBeVisible();
    await expect(studyPage.ratingButton3).toBeVisible();
    await expect(studyPage.ratingButton4).toBeVisible();
    await expect(studyPage.ratingButton5).toBeVisible();
  });

  test("should rate flashcard and move to next", async ({ page }) => {
    // Create flashcards
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front1 = `${TEST_ENTITY_PREFIX} rate front 1 ${Date.now()}`;
    const back1 = `${TEST_ENTITY_PREFIX} rate back 1 ${Date.now()}`;
    await addPage.createFlashcard(front1, back1);
    await addPage.waitForSuccess();

    const front2 = `${TEST_ENTITY_PREFIX} rate front 2 ${Date.now()}`;
    const back2 = `${TEST_ENTITY_PREFIX} rate back 2 ${Date.now()}`;
    await addPage.createFlashcard(front2, back2);
    await addPage.waitForSuccess();

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // Get first flashcard text
    const firstFlashcardText = await studyPage.getCurrentFlashcardText();
    expect(firstFlashcardText).toContain(front1);

    // Reveal and rate first flashcard
    await studyPage.revealFlashcard();
    await studyPage.rateFlashcard(4);

    // Wait for next flashcard
    await page.waitForTimeout(1000);

    // Should see second flashcard
    const secondFlashcardText = await studyPage.getCurrentFlashcardText();
    expect(secondFlashcardText).toBeTruthy();
    expect(secondFlashcardText).toContain(front2);

    // Should show front again (not revealed)
    const isRevealed = await studyPage.isFlashcardRevealed();
    expect(isRevealed).toBe(false);
  });

  test("should complete session when all flashcards are rated", async ({ page }) => {
    // Create a single flashcard
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front = `${TEST_ENTITY_PREFIX} complete front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} complete back ${Date.now()}`;
    await addPage.createFlashcard(front, back);
    await addPage.waitForSuccess();

    // Ensure flashcard is persisted before starting session
    await page.goto("/my-flashcards");
    const createdFlashcard = page.locator('[data-testid="flashcard-item"]').filter({ hasText: front }).first();
    await expect(createdFlashcard).toBeVisible({ timeout: 10000 });

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.ensureSessionStarted();

    // Reveal and rate flashcard
    await studyPage.revealFlashcard();
    await studyPage.rateFlashcard(5);

    // Wait for session completion
    await studyPage.waitForSessionComplete();

    // Session should be completed and completion message visible
    await expect(studyPage.sessionCompleteMessage).toBeVisible({ timeout: 5000 });
  });

  test("should allow ending session early", async ({ page }) => {
    // Create flashcards
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front1 = `${TEST_ENTITY_PREFIX} end front 1 ${Date.now()}`;
    const back1 = `${TEST_ENTITY_PREFIX} end back 1 ${Date.now()}`;
    await addPage.createFlashcard(front1, back1);
    await addPage.waitForSuccess();

    const front2 = `${TEST_ENTITY_PREFIX} end front 2 ${Date.now()}`;
    const back2 = `${TEST_ENTITY_PREFIX} end back 2 ${Date.now()}`;
    await addPage.createFlashcard(front2, back2);
    await addPage.waitForSuccess();

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // End session early
    await studyPage.endSession();

    // Wait for session completion
    await studyPage.waitForSessionComplete();

    // Session should be ended - completion message should be visible
    await expect(studyPage.sessionCompleteMessage).toBeVisible({ timeout: 5000 });
  });

  test("should display progress correctly", async ({ page }) => {
    // Create flashcards
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front1 = `${TEST_ENTITY_PREFIX} progress front 1 ${Date.now()}`;
    const back1 = `${TEST_ENTITY_PREFIX} progress back 1 ${Date.now()}`;
    await addPage.createFlashcard(front1, back1);
    await addPage.waitForSuccess();

    const front2 = `${TEST_ENTITY_PREFIX} progress front 2 ${Date.now()}`;
    const back2 = `${TEST_ENTITY_PREFIX} progress back 2 ${Date.now()}`;
    await addPage.createFlashcard(front2, back2);
    await addPage.waitForSuccess();

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // Check initial progress
    const initialProgress = await studyPage.getProgressText();
    expect(initialProgress).toContain("1/2");

    // Rate first flashcard
    await studyPage.revealFlashcard();
    await studyPage.rateFlashcard(3);

    // Wait for next flashcard
    await page.waitForTimeout(1000);

    // Check updated progress
    const updatedProgress = await studyPage.getProgressText();
    expect(updatedProgress).toContain("2/2");
  });

  test("should show empty state when no flashcards available", async ({ page }) => {
    // Start study session without creating flashcards
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // Should show error message (when no flashcards exist) or empty state (when session ends with no cards)
    // Wait a bit for the UI to settle
    await page.waitForTimeout(1000);

    const isEmptyStateVisible = await studyPage.emptyState.isVisible().catch(() => false);
    const isErrorMessageVisible = await studyPage.errorMessage.isVisible().catch(() => false);

    expect(isEmptyStateVisible || isErrorMessageVisible).toBe(true);
  });

  test("should handle different rating values", async ({ page }) => {
    // Create a flashcard
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();
    const front = `${TEST_ENTITY_PREFIX} ratings front ${Date.now()}`;
    const back = `${TEST_ENTITY_PREFIX} ratings back ${Date.now()}`;
    await addPage.createFlashcard(front, back);
    await addPage.waitForSuccess();

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.waitForLoad();

    // Reveal flashcard
    await studyPage.revealFlashcard();

    // Test all rating buttons are clickable
    const ratings: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];
    for (const rating of ratings) {
      const buttonMap = {
        1: studyPage.ratingButton1,
        2: studyPage.ratingButton2,
        3: studyPage.ratingButton3,
        4: studyPage.ratingButton4,
        5: studyPage.ratingButton5,
      };

      const button = buttonMap[rating];
      const isVisible = await button.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    }
  });

  test("should navigate through multiple flashcards", async ({ page }) => {
    // Create multiple flashcards
    const addPage = new AddFlashcardPage(page);
    await addPage.goto();

    const flashcards = [];
    for (let i = 1; i <= 3; i++) {
      const front = `${TEST_ENTITY_PREFIX} multi front ${i} ${Date.now()}`;
      const back = `${TEST_ENTITY_PREFIX} multi back ${i} ${Date.now()}`;
      await addPage.createFlashcard(front, back);
      await addPage.waitForSuccess();
      flashcards.push({ front, back });
    }

    // Wait for flashcards to be available in the database
    // Verify by checking the flashcards list page
    await page.goto("/my-flashcards");
    const firstFlashcard = page
      .locator('[data-testid="flashcard-item"]')
      .filter({ hasText: flashcards[0].front })
      .first();
    await expect(firstFlashcard).toBeVisible({ timeout: 10000 });

    // Start study session
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    await studyPage.ensureSessionStarted();

    // Navigate through all flashcards
    for (let i = 0; i < flashcards.length; i++) {
      // Wait for current flashcard to be visible
      await expect(studyPage.flashcardCard).toBeVisible({ timeout: 5000 });

      const flashcardText = await studyPage.getCurrentFlashcardText();
      expect(flashcardText).toBeTruthy();
      expect(flashcardText).toContain(flashcards[i].front);

      await studyPage.revealFlashcard();
      await studyPage.rateFlashcard(3);

      // Wait for next flashcard to appear (except for last one)
      if (i < flashcards.length - 1) {
        // Wait for flashcard card to update (next flashcard appears)
        await expect(studyPage.flashcardCard).toBeVisible({ timeout: 5000 });
        // Small delay to ensure state is stable
        await page.waitForTimeout(500);
      }
    }
  });
});
