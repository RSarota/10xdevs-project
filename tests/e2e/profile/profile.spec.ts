import { test, expect } from "@playwright/test";
import { ProfilePage } from "../pages/ProfilePage";
import { LoginPage } from "../pages/LoginPage";
import { createConfirmedUser, deleteUserById, isSupabaseAdminConfigured } from "../utils/test-user-management";

async function login(page: import("@playwright/test").Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForReady();
  await loginPage.login(email, password);
  await loginPage.waitForRedirect("/dashboard");
}

test.describe("Profile (existing user)", () => {
  test.beforeEach(async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    await profilePage.waitForLoad();
  });

  test("should display profile data", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await expect(profilePage.emailInput).toBeVisible();
  });

  test("should validate profile form", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    // Email field is read-only, so we test password validation instead
    await profilePage.passwordInput.fill("short");
    await profilePage.saveButton.click();
    await expect(page.getByTestId("profile-password-input-error")).toBeVisible({ timeout: 5000 });
  });

  test("should display delete account option", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await expect(profilePage.deleteAccountButton).toBeVisible();
  });

  test("should show delete account confirmation without removing account", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.clickDeleteAccount();
    await expect(profilePage.deleteConfirmModal).toBeVisible();
    await expect(profilePage.confirmDeleteButton).toBeVisible();
    await expect(profilePage.cancelDeleteButton).toBeVisible();
    await profilePage.cancelDeleteAccount();
    await expect(profilePage.deleteConfirmModal).not.toBeVisible();
  });
});

test.describe.configure({ mode: "serial" });

const ADMIN_AVAILABLE = isSupabaseAdminConfigured();

test.describe("Profile (temporary user)", () => {
  test("should update password for temporary account", async ({ browser, request }, testInfo) => {
    if (!ADMIN_AVAILABLE) {
      test.skip(true, "Supabase admin credentials are required for profile mutation tests");
    }

    const baseURL = (testInfo.project.use as { baseURL?: string }).baseURL ?? "http://localhost:3000";
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    const { email, password, id } = await createConfirmedUser(request, "profile-test");

    try {
      await login(page, email, password);

      const profilePage = new ProfilePage(page);
      await profilePage.goto();

      const newPassword = `TempPassword${Date.now()}!`;
      await profilePage.updatePassword(newPassword, newPassword);

      // Wait for password update to complete
      await expect(profilePage.successMessage).toBeVisible({ timeout: 10000 });
      // Wait for network to be idle to ensure API call completed
      await page.waitForLoadState("networkidle");
      // Small delay to ensure Supabase has propagated the password change
      await page.waitForTimeout(1000);

      const verifyContext = await browser.newContext({ baseURL });
      const verifyPage = await verifyContext.newPage();
      await login(verifyPage, email, newPassword);
      await verifyContext.close();
    } finally {
      try {
        await deleteUserById(request, id);
      } catch {
        // Account already deleted during the test
      }
      await context.close();
    }
  });
});
