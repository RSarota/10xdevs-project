import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

/**
 * Read environment variables from .env.test file.
 * https://github.com/motdotla/dotenv
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env.test") });

const webServerEnvKeys = [
  "SUPABASE_URL",
  "SUPABASE_KEY",
  "OPENAI_URL",
  "OPENAI_API_KEY",
  "E2E_USERNAME",
  "E2E_USER_PASSWORD",
  "E2E_USERNAME_ID",
];

const collectedWebServerEnv: Record<string, string> = {};
for (const key of webServerEnvKeys) {
  const value = process.env[key];
  if (value) {
    collectedWebServerEnv[key] = value;
  }
}

const sanitizedProcessEnv = Object.entries(process.env).reduce<Record<string, string>>((acc, [key, value]) => {
  if (value !== undefined) {
    acc[key] = value;
  }
  return acc;
}, {});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  outputDir: "test-results",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:3000",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Take screenshot on failure */
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project for authentication
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    // Tests that require authentication (depend on setup)
    {
      name: "chromium-authenticated",
      use: { ...devices["Desktop Chrome"], storageState: "playwright/.auth/user.json" },
      dependencies: ["setup"],
      testMatch: [
        "**/dashboard/**",
        "**/flashcards/**",
        "**/profile/**",
        "**/study/**",
        "**/auth/account-deletion.spec.ts",
      ],
    },
    // Tests that don't require authentication (can run independently)
    {
      name: "chromium-unauthenticated",
      use: { ...devices["Desktop Chrome"] },
      testMatch: [
        "**/homepage.spec.ts",
        "**/auth/registration.spec.ts",
        "**/auth/protected-routes.spec.ts",
        "**/auth/login.spec.ts",
      ],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...sanitizedProcessEnv,
      ...collectedWebServerEnv,
    },
  },
});
