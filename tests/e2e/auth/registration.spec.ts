import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { generateRandomEmail, generateRandomName, testUsers } from "../fixtures/test-data";

test.describe("Registration", () => {
  test.beforeEach(async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.waitForReady();
  });

  test("should register with valid data", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();
    const email = generateRandomEmail();
    const name = generateRandomName();

    await page.route(
      "**/api/auth/register",
      async (route) => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Wysłaliśmy link aktywacyjny na podany adres e-mail",
            user: { id: "user-123", email },
          }),
        });
      },
      { times: 1 }
    );

    await registerPage.register(name, email, "Test1234!", "Test1234!");

    // Wait for success message
    await registerPage.waitForSuccessMessage();
    await expect(registerPage.successMessage).toBeVisible();
    await expect(registerPage.successMessage).toContainText(/rejestracja zakończona/i);
  });

  test("should show error for invalid email format", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();

    await registerPage.fillEmail("invalid-email");
    await registerPage.fillName("Test User");
    await registerPage.fillPassword("Test1234!");
    await registerPage.fillConfirmPassword("Test1234!");
    await registerPage.submit();

    // Should show validation error
    await expect(registerPage.emailError).toBeVisible({ timeout: 3000 });
  });

  test("should show error for password not meeting requirements", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();
    const email = generateRandomEmail();

    await registerPage.fillName("Test User");
    await registerPage.fillEmail(email);
    await registerPage.fillPassword("short");
    await registerPage.fillConfirmPassword("short");
    await registerPage.submit();

    // Should show password validation error
    await expect(registerPage.passwordError).toBeVisible({ timeout: 3000 });
    await expect(registerPage.passwordError).toContainText(/hasło/i);
  });

  test("should show error for mismatched passwords", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();
    const email = generateRandomEmail();

    await registerPage.fillName("Test User");
    await registerPage.fillEmail(email);
    await registerPage.fillPassword("Test1234!");
    await registerPage.fillConfirmPassword("Different1234!");
    await registerPage.submit();

    // Should show password mismatch error
    await expect(registerPage.confirmPasswordError).toBeVisible({ timeout: 3000 });
  });

  test("should show error for existing email", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();
    const existingUser = testUsers.e2e;
    if (!existingUser) {
      test.skip(true, "E2E test user not configured (missing E2E_USERNAME env).");
      return;
    }
    const existingEmail = existingUser.email;

    await page.route(
      "**/api/auth/register",
      async (route) => {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Ten adres e-mail jest już zarejestrowany",
            field: "email",
          }),
        });
      },
      { times: 1 }
    );

    await registerPage.register("Test User", existingEmail, "Test1234!", "Test1234!");

    // Should show error about existing email
    await expect(registerPage.emailError).toBeVisible({ timeout: 5000 });
  });

  test("should display activation email message", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();
    const email = generateRandomEmail();
    const name = generateRandomName();

    await page.route(
      "**/api/auth/register",
      async (route) => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Wysłaliśmy link aktywacyjny na podany adres e-mail",
            user: { id: "user-activation", email },
          }),
        });
      },
      { times: 1 }
    );

    await registerPage.register(name, email, "Test1234!", "Test1234!");

    await registerPage.waitForSuccessMessage();
    await expect(registerPage.successMessage).toContainText(/e-mail/i);
    await expect(registerPage.successMessage).toContainText(/aktywacyjny/i);
  });

  test("should redirect to login after registration", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.waitForReady();
    const email = generateRandomEmail();
    const name = generateRandomName();

    await page.route(
      "**/api/auth/register",
      async (route) => {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Wysłaliśmy link aktywacyjny na podany adres e-mail",
            user: { id: "user-redirect", email },
          }),
        });
      },
      { times: 1 }
    );

    await registerPage.register(name, email, "Test1234!", "Test1234!");

    await registerPage.waitForSuccessMessage();
    await registerPage.goToLoginButton.click();

    // Should redirect to login page
    await registerPage.waitForRedirect("/auth/login");
    const loginPage = new LoginPage(page);
    await expect(loginPage.emailInput).toBeVisible();
  });

  test("should have link to login page", async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await expect(registerPage.loginLink).toBeVisible();
    await registerPage.clickLogin();

    // Should navigate to login page
    await registerPage.waitForRedirect("/auth/login");
  });
});
