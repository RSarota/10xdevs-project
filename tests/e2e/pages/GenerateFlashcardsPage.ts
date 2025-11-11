import { expect, type Locator, type Page } from "@playwright/test";

export class GenerateFlashcardsPage {
  readonly page: Page;
  readonly form: Locator;
  readonly textarea: Locator;
  readonly generateButton: Locator;
  readonly characterCount: Locator;
  readonly loadingIndicator: Locator;
  readonly proposalsList: Locator;
  readonly proposalItem: Locator;
  readonly acceptButton: Locator;
  readonly rejectButton: Locator;
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly editModal: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId("generate-flashcards-form");
    this.textarea = page.getByTestId("generate-flashcards-textarea");
    this.generateButton = page.getByTestId("button-generuj-fiszki");
    this.characterCount = page.getByTestId("generate-character-count");
    this.loadingIndicator = page.getByTestId("flashcards-loader");
    this.proposalsList = page.getByTestId("proposals-list");
    this.proposalItem = page.getByTestId("proposal-item");
    this.acceptButton = page.getByRole("button", { name: /akceptuj|zaakceptuj/i });
    this.rejectButton = page.getByRole("button", { name: /odrzuć|odrzuć/i });
    this.editButton = page.getByRole("button", { name: /edytuj/i });
    this.saveButton = page.getByRole("button", { name: /zapisz/i });
    this.editModal = page.getByText(/edytuj fiszkę|edycja/i);
    this.errorMessage = page.getByTestId("generate-error-banner");
    this.successMessage = page.getByText(/zapisano|sukces/i);
  }

  async goto() {
    await this.page.goto("/generate-flashcards");
    await this.waitForReady();
  }

  async fillText(text: string) {
    await this.waitForReady();
    await this.textarea.fill(text);
  }

  async clickGenerate() {
    await this.waitForReady();
    await this.generateButton.click();
  }

  async generate(text: string) {
    await this.waitForReady();
    await this.fillText(text);
    await this.clickGenerate();
  }

  async waitForProposals() {
    await this.proposalItem.first().waitFor({ timeout: 30000 });
  }

  async acceptProposal(index = 0) {
    const proposal = this.proposalItem.nth(index);
    await proposal
      .getByRole("button", { name: /akceptuj/i })
      .first()
      .click();
  }

  async rejectProposal(index = 0) {
    const proposal = this.proposalItem.nth(index);
    await proposal
      .getByRole("button", { name: /odrzuć/i })
      .first()
      .click();
  }

  async editProposal(index = 0) {
    const proposal = this.proposalItem.nth(index);
    await proposal
      .getByRole("button", { name: /edytuj/i })
      .first()
      .click();
  }

  async getCharacterCount(): Promise<string | null> {
    try {
      return await this.characterCount.textContent();
    } catch {
      return null;
    }
  }

  async isErrorVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForReady() {
    await this.form.waitFor({ state: "attached", timeout: 15000 });
    await expect(this.form).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  }
}
