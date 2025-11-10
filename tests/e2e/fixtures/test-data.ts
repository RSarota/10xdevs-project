/**
 * Get test user credentials from environment variables
 * The user defined in .env.test already exists in the integration database
 */
function getTestUserCredentials() {
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_USER_PASSWORD;

  if (!username || !password) {
    throw new Error("E2E_USERNAME and E2E_USER_PASSWORD must be set in .env.test file");
  }

  return { username, password };
}

export const testUsers = {
  // Test user for registration tests (new users)
  valid: {
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "Test1234!",
    confirmPassword: "Test1234!",
  },
  // Test user from environment variables (exists in integration database)
  // This user is used for authenticated tests that require an existing user
  e2e: (() => {
    try {
      const { username, password } = getTestUserCredentials();
      return {
        email: username,
        password: password,
        id: process.env.E2E_USERNAME_ID,
      };
    } catch {
      return null;
    }
  })(),
  invalid: {
    email: "invalid-email",
    password: "short",
    confirmPassword: "different",
  },
  existing: {
    email: "existing@example.com",
    password: "Test1234!",
  },
};

export const testFlashcards = {
  valid: {
    front: "What is React?",
    back: "React is a JavaScript library for building user interfaces.",
  },
  longFront: "A".repeat(201), // Exceeds 200 character limit
  longBack: "B".repeat(501), // Exceeds 500 character limit
  empty: {
    front: "",
    back: "",
  },
};

export const TEST_ENTITY_PREFIX = "[TEST]";

export const testTexts = {
  valid: "A".repeat(1500), // Within 1000-10000 range
  tooShort: "Short text", // Below 1000 characters
  tooLong: "A".repeat(10001), // Above 10000 characters
  empty: "",
};

export function generateRandomEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

export function generateRandomName(): string {
  return `Test User ${Date.now()}`;
}
