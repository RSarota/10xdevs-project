import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { generateRandomEmail, testUsers } from "../fixtures/test-data";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.waitForReady();
  });

  test("should login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();
    // Use test user from environment variables
    const testUser = testUsers.e2e;
    if (!testUser) {
      test.skip();
      return;
    }
    const email = testUser.email;
    const password = testUser.password;

    await loginPage.login(email, password);

    // Should redirect to dashboard
    await loginPage.waitForRedirect("/dashboard");
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.page).toHaveURL(/.*dashboard/);
  });

  test("should show error for invalid email", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();

    await loginPage.fillEmail("invalid-email");
    await loginPage.fillPassword("Test1234!");
    await loginPage.submit();

    // Should show validation error on the email field
    await expect(loginPage.emailError).toBeVisible({ timeout: 3000 });
  });

  test("should show error for invalid password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();
    const email = generateRandomEmail();

    await loginPage.fillEmail(email);
    await loginPage.fillPassword("wrongpassword");
    await loginPage.submit();

    // Should show general error from API
    await expect(loginPage.generalError).toBeVisible({ timeout: 7000 });
  });

  test("should show error for unconfirmed email", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();
    // This would require a user that exists but hasn't confirmed email
    // In real scenario, you'd create such a user via API
    const email = "unconfirmed@example.com";
    const password = "Test1234!";

    await loginPage.login(email, password);

    // Should show general error about unconfirmed email
    await expect(loginPage.generalError).toBeVisible({ timeout: 7000 });
  });

  test("should redirect to dashboard after successful login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();
    const testUser = testUsers.e2e;
    if (!testUser) {
      test.skip();
      return;
    }
    const email = testUser.email;
    const password = testUser.password;

    await loginPage.login(email, password);

    // Should redirect to dashboard
    await loginPage.waitForRedirect("/dashboard");
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should have link to forgot password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();

    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await loginPage.clickForgotPassword();

    // Should navigate to forgot password page
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test("should have link to registration", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.waitForReady();

    await expect(loginPage.registerLink).toBeVisible();
    await loginPage.clickRegister();

    // Should navigate to registration page
    await loginPage.waitForRedirect("/auth/register");
    const registerPage = new RegisterPage(page);
    await expect(registerPage.nameInput).toBeVisible();
  });
});
