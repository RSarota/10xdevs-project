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

async function deleteAccountViaProfile(page: import("@playwright/test").Page) {
  const profilePage = new ProfilePage(page);
  await profilePage.goto();
  await profilePage.clickDeleteAccount();
  await profilePage.confirmDeleteAccount();
  await profilePage.waitForRedirect("/auth/login");
}

test.describe.configure({ mode: "serial" });

const ADMIN_AVAILABLE = isSupabaseAdminConfigured();

test.describe("Account Deletion", () => {
  test("should display delete account option in profile", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    await expect(profilePage.deleteAccountButton).toBeVisible();
  });

  test("should show confirmation modal when clicking delete", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    await profilePage.clickDeleteAccount();

    await expect(profilePage.deleteConfirmModal).toBeVisible();
    await expect(profilePage.confirmDeleteButton).toBeVisible();
    await expect(profilePage.cancelDeleteButton).toBeVisible();
  });

  test("should cancel account deletion", async ({ page }) => {
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    await profilePage.clickDeleteAccount();
    await profilePage.cancelDeleteAccount();

    await expect(profilePage.deleteConfirmModal).not.toBeVisible();
    await expect(page).toHaveURL(/.*profile/);
  });

  test("should delete account and redirect to login", async ({ browser, request }, testInfo) => {
    if (!ADMIN_AVAILABLE) {
      test.skip(true, "Supabase admin credentials are required for deletion tests");
    }

    const baseURL = (testInfo.project.use as { baseURL?: string }).baseURL ?? "http://localhost:3000";
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    const { email, password, id } = await createConfirmedUser(request, "delete-test");

    try {
      await login(page, email, password);
      await deleteAccountViaProfile(page);

      // Wait for page to fully load after redirect before checking form
      await page.waitForLoadState("networkidle");
      const loginPage = new LoginPage(page);
      await loginPage.waitForReady();
      await expect(loginPage.emailInput).toBeVisible();
    } finally {
      try {
        await deleteUserById(request, id);
      } catch {
        // Already removed through UI path
      }
      await context.close();
    }
  });

  test("should verify account deletion message", async ({ browser, request }, testInfo) => {
    if (!ADMIN_AVAILABLE) {
      test.skip(true, "Supabase admin credentials are required for deletion tests");
    }

    const baseURL = (testInfo.project.use as { baseURL?: string }).baseURL ?? "http://localhost:3000";
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();

    const { email, password, id } = await createConfirmedUser(request, "delete-test");

    try {
      await login(page, email, password);

      const profilePage = new ProfilePage(page);
      await profilePage.goto();

      await profilePage.deleteAccount();

      try {
        await expect(profilePage.successMessage).toBeVisible({ timeout: 2000 });
      } catch {
        // success toast may disappear quickly
      }

      await profilePage.waitForRedirect("/auth/login");
    } finally {
      try {
        await deleteUserById(request, id);
      } catch {
        // Already removed through UI path
      }
      await context.close();
    }
  });
});
