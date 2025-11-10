import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  // Use environment variables for test user credentials
  // The user defined in .env.test already exists in the integration database
  const testUser = {
    email: process.env.E2E_USERNAME,
    password: process.env.E2E_USER_PASSWORD,
  };

  if (!testUser.email || !testUser.password) {
    throw new Error("E2E_USERNAME and E2E_USER_PASSWORD must be set in .env.test file");
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.waitForReady();

  // Wait for login form to be ready
  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();

  // Login with the existing test user (user exists in integration database)
  // Wait for the login API response before checking navigation
  const loginResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/auth/login") && response.status() === 200,
    { timeout: 10000 }
  );

  await loginPage.login(testUser.email, testUser.password);

  // Wait for login API to complete
  await loginResponsePromise;

  // Wait for navigation to dashboard or check for authenticated state
  // The login form uses window.location.href, which may not always trigger waitForURL
  try {
    // Wait for navigation to dashboard
    await page.waitForURL("**/dashboard", { timeout: 10000 }).catch(async () => {
      // If URL didn't change, check if user is authenticated by looking for authenticated UI
      // This handles cases where redirect happens but Playwright doesn't detect it immediately
      const logoutButton = page.getByRole("button", { name: /wyloguj się/i });
      const isAuthenticated = await logoutButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (isAuthenticated) {
        // User is authenticated, navigate to dashboard manually or wait a bit more
        await page.waitForTimeout(1000);
        const currentUrl = page.url();
        // If still on login page but authenticated, the redirect should happen
        if (currentUrl.includes("/auth/login")) {
          // Server-side redirect should happen, wait a bit more
          await page.waitForURL("**/dashboard", { timeout: 5000 }).catch(() => {
            // If still not redirected, navigate manually
            return page.goto("/dashboard", { waitUntil: "networkidle" });
          });
        }
      } else {
        throw new Error("Login failed: User is not authenticated");
      }
    });

    // Verify we're logged in by checking the URL
    const finalUrl = page.url();
    if (!finalUrl.includes("/dashboard")) {
      throw new Error(`Login failed: Expected dashboard, but URL is ${finalUrl}`);
    }
  } catch (error) {
    // If login failed, check for error messages
    const currentUrl = page.url();

    // Wait a bit for error messages to appear
    await page.waitForTimeout(1000);

    const errorVisible = await loginPage.errorMessage
      .first()
      .isVisible()
      .catch(() => false);
    const generalErrorVisible = await loginPage.generalError.isVisible().catch(() => false);

    if (errorVisible || generalErrorVisible) {
      const errorText = errorVisible
        ? await loginPage.errorMessage.first().textContent()
        : await loginPage.generalError.textContent();
      throw new Error(`Login failed: ${errorText || "Unknown error"}. Current URL: ${currentUrl}`);
    }

    // Check if user is actually authenticated (might be on login page but authenticated)
    const logoutButton = page.getByRole("button", { name: /wyloguj się/i });
    const isAuthenticated = await logoutButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isAuthenticated && currentUrl.includes("/auth/login")) {
      // User is authenticated but still on login page - redirect should happen
      // Navigate to dashboard manually
      await page.goto("/dashboard", { waitUntil: "networkidle" });
      // Verify we're on dashboard now
      const newUrl = page.url();
      if (!newUrl.includes("/dashboard")) {
        throw new Error(`Login failed: Expected dashboard after manual navigation, but URL is ${newUrl}`);
      }
      // Success - exit catch block and continue to save storage state
    } else {
      // If we're still on login page and not authenticated, something went wrong
      if (currentUrl.includes("/auth/login") && !isAuthenticated) {
        throw new Error(
          `Login failed: Still on login page after timeout. Current URL: ${currentUrl}. ` +
            `Please verify that E2E_USERNAME and E2E_USER_PASSWORD in .env.test are correct ` +
            `and the user exists in the integration database.`
        );
      }

      // Re-throw original error with more context
      throw new Error(
        `Login failed: ${error instanceof Error ? error.message : String(error)}. ` + `Current URL: ${currentUrl}`
      );
    }
  }

  // Save signed-in state to 'playwright/.auth/user.json'
  await page.context().storageState({ path: authFile });
});
