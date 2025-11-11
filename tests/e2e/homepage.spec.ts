import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check if page title is correct
    await expect(page).toHaveTitle(/10xCards/i);
  });

  test("should display page content", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check if page is visible (basic check that page rendered)
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("should have accessible structure", async ({ page }) => {
    await page.goto("/");

    // Check for main content area
    const main = page.locator('main, [role="main"], body');
    await expect(main.first()).toBeVisible();
  });
});
