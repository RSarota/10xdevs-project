import { test, expect } from "@playwright/test";
import { GenerateFlashcardsPage } from "../pages/GenerateFlashcardsPage";
import { TEST_ENTITY_PREFIX, testTexts } from "../fixtures/test-data";

const mockGenerationResponse = {
  generation_id: 123,
  proposals: [
    { front: `${TEST_ENTITY_PREFIX} AI front 1`, back: `${TEST_ENTITY_PREFIX} AI back 1` },
    { front: `${TEST_ENTITY_PREFIX} AI front 2`, back: `${TEST_ENTITY_PREFIX} AI back 2` },
  ],
};

const mockSaveResponse = {
  count: mockGenerationResponse.proposals.length,
  flashcards: mockGenerationResponse.proposals.map((proposal, index) => ({
    id: index + 1,
    front: proposal.front,
    back: proposal.back,
    type: "ai-full",
    user_id: "test-user",
  })),
};

test.describe("AI Flashcard Generation", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/generations", async (route) => {
      if (route.request().method() !== "POST") {
        return route.continue();
      }

      // Simulate small network delay to surface loading state
      await new Promise((resolve) => setTimeout(resolve, 150));

      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGenerationResponse),
      });
    });

    await page.route("**/api/flashcards", async (route) => {
      if (route.request().method() !== "POST") {
        return route.continue();
      }

      await route.fulfill({
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockSaveResponse),
      });
    });

    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.goto();
  });

  test("should generate flashcards with valid text (1000-10000 characters)", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);

    await generatePage.waitForProposals();
    await expect(generatePage.proposalsList).toBeVisible();
    await expect(generatePage.proposalItem).toHaveCount(mockGenerationResponse.proposals.length);
  });

  test("should show validation feedback for text below 1000 characters", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.fillText(testTexts.tooShort);

    await expect(generatePage.generateButton).toBeDisabled();
    await expect(page.getByText(/Minimum\s+1[,.]?\s*000\s+znak/i)).toBeVisible();
  });

  test("should show validation feedback for text above 10000 characters", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.fillText(testTexts.tooLong);

    await expect(generatePage.generateButton).toBeDisabled();
    // For text > 10000, there's no separate text message, only the badge shows the count
    // The badge should show a number greater than 10,000 (e.g., "10,001 / 10,000 znaków")
    const characterCount = await generatePage.getCharacterCount();
    expect(characterCount).toBeTruthy();
    // Extract the current count from badge (format: "10,001 / 10,000 znaków")
    const currentCountMatch = characterCount?.match(/^([\d,.\s]+)\s*\/\s*10[,.]?\s*000/);
    expect(currentCountMatch).toBeTruthy();
    // Remove formatting and compare: should be > 10000
    const currentCount = parseInt(currentCountMatch![1].replace(/[,.\s]/g, ""), 10);
    expect(currentCount).toBeGreaterThan(10000);
  });

  test("should display loading state during generation", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.fillText(testTexts.valid);
    await generatePage.clickGenerate();

    await expect(generatePage.loadingIndicator).toBeVisible({ timeout: 500 });
  });

  test("should display proposals after generation", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);
    await generatePage.waitForProposals();

    await expect(generatePage.proposalItem).toHaveCount(mockGenerationResponse.proposals.length);
  });

  test("should accept a proposal", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);
    await generatePage.waitForProposals();

    await generatePage.acceptProposal(0);
    await expect(generatePage.proposalItem.nth(0).getByText(/zaakceptowano/i)).toBeVisible();
  });

  test("should reject a proposal", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);
    await generatePage.waitForProposals();

    await generatePage.rejectProposal(0);
    await expect(generatePage.proposalItem.nth(0).getByText(/odrzucono/i)).toBeVisible();
  });

  test("should edit a proposal", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);
    await generatePage.waitForProposals();

    await generatePage.editProposal(0);
    await expect(generatePage.editModal.or(generatePage.saveButton).first()).toBeVisible({ timeout: 5000 });
  });

  test("should save accepted flashcards", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);
    await generatePage.waitForProposals();

    await generatePage.acceptProposal(0);
    await page.getByRole("button", { name: /zapisz teraz/i }).click();

    await expect(generatePage.proposalItem).toHaveCount(0, { timeout: 5000 });
  });

  test("should handle API error gracefully", async ({ page }) => {
    await page.route(
      "**/api/generations",
      (route) =>
        route.fulfill({
          status: 500,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Internal Server Error", message: "Service unavailable" }),
        }),
      { times: 1 }
    );

    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.generate(testTexts.valid);

    await expect(generatePage.errorMessage).toBeVisible({ timeout: 5000 });
  });

  test("should display character count", async ({ page }) => {
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.fillText(testTexts.valid);

    const count = await generatePage.getCharacterCount();
    expect(count).toBeTruthy();
  });
});
