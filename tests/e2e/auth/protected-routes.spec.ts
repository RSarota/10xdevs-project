import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Protected Routes", () => {
  const protectedRoutes = ["/dashboard", "/generate-flashcards", "/add-flashcard", "/my-flashcards", "/profile"];

  for (const route of protectedRoutes) {
    test(`should redirect to login when accessing ${route} without authentication`, async ({ page }) => {
      await page.goto(route);

      // Should redirect to login page
      await expect(page).toHaveURL(/.*auth\/login/);
      const loginPage = new LoginPage(page);
      await expect(loginPage.emailInput).toBeVisible();
    });
  }

  test("should not access dashboard without login", async ({ page }) => {
    await page.goto("/dashboard");

    // Should redirect to login
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test("should not access generate flashcards without login", async ({ page }) => {
    await page.goto("/generate-flashcards");

    // Should redirect to login
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test("should not access add flashcard without login", async ({ page }) => {
    await page.goto("/add-flashcard");

    // Should redirect to login
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test("should not access my flashcards without login", async ({ page }) => {
    await page.goto("/my-flashcards");

    // Should redirect to login
    await expect(page).toHaveURL(/.*auth\/login/);
  });

  test("should not access profile without login", async ({ page }) => {
    await page.goto("/profile");

    // Should redirect to login
    await expect(page).toHaveURL(/.*auth\/login/);
  });
});


