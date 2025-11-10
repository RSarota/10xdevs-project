import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

// Mock environment variables before importing the module
vi.stubEnv("OPENAI_API_KEY", "test-api-key");
vi.stubEnv("OPENAI_URL", "https://test-endpoint.com/api");

// Import after mocking env - use dynamic import in beforeAll
let OpenAIService: typeof import("./openai.service").OpenAIService;
let OpenAIServiceError: typeof import("./openai.service").OpenAIServiceError;
let generateFlashcards: typeof import("./openai.service").generateFlashcards;

beforeAll(async () => {
  const module = await import("./openai.service");
  OpenAIService = module.OpenAIService;
  OpenAIServiceError = module.OpenAIServiceError;
  generateFlashcards = module.generateFlashcards;
});

describe("OpenAIService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should initialize with valid environment variables", () => {
      const service = new OpenAIService();
      expect(service.configuration.apiKey).toBe("test-api-key");
      expect(service.configuration.endpoint).toBe("https://test-endpoint.com/api");
    });

    it("should initialize with default systemMessage", () => {
      const service = new OpenAIService();
      expect(service.configuration.systemMessage).toContain("flashcard generator");
    });
  });

  describe("sendRequest", () => {
    it("should throw error when message is empty", async () => {
      const service = new OpenAIService();

      await expect(service.sendRequest("")).rejects.toThrow(OpenAIServiceError);
      await expect(service.sendRequest("   ")).rejects.toThrow(OpenAIServiceError);
    });

    it("should sanitize input (trim and limit to 10000 chars)", async () => {
      const longMessage = "a".repeat(15000);
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "test",
          choices: [
            {
              index: 0,
              finish_reason: "function_call",
              message: {
                role: "assistant",
                function_call: {
                  name: "generate_flashcards",
                  arguments: JSON.stringify({
                    flashcards: [{ front: "Q", back: "A" }],
                  }),
                },
              },
            },
          ],
        }),
      } as Response);

      await service.sendRequest(longMessage);

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);
      // The message includes a prefix, so we extract the user's message part
      // The full content includes: "Create flashcards from the following text. Generate multiple flashcards that cover key concepts, definitions, and important information:\n\n" + sanitizedMessage
      const userMessage = body.messages[1].content;
      const prefix =
        "Create flashcards from the following text. Generate multiple flashcards that cover key concepts, definitions, and important information:\n\n";
      const messageWithoutPrefix = userMessage.substring(prefix.length);
      // The sanitized message should be limited to 10000 chars
      expect(messageWithoutPrefix.length).toBeLessThanOrEqual(10000);
      // And it should be trimmed from the original 15000 chars
      expect(messageWithoutPrefix.length).toBe(10000);
    });

    it("should build correct payload with function_call", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "test",
          choices: [
            {
              index: 0,
              finish_reason: "function_call",
              message: {
                role: "assistant",
                function_call: {
                  name: "generate_flashcards",
                  arguments: JSON.stringify({
                    flashcards: [{ front: "Q", back: "A" }],
                  }),
                },
              },
            },
          ],
        }),
      } as Response);

      await service.sendRequest("test message");

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs[0]).toBe("https://test-endpoint.com/api");
      expect(callArgs[1]?.method).toBe("POST");
      expect(callArgs[1]?.headers).toMatchObject({
        "Content-Type": "application/json",
        "api-key": "test-api-key",
      });

      const body = JSON.parse(callArgs[1]?.body as string);
      expect(body.function_call).toEqual({ name: "generate_flashcards" });
      expect(body.messages).toHaveLength(2);
      expect(body.messages[0].role).toBe("system");
      expect(body.messages[1].role).toBe("user");
    });

    it("should handle HTTP 401 error", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ error: { message: "Invalid API key" } }),
      } as Response);

      await expect(service.sendRequest("test")).rejects.toThrow(OpenAIServiceError);
    });

    it("should handle HTTP 403 error", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ error: { message: "Access denied" } }),
      } as Response);

      await expect(service.sendRequest("test")).rejects.toThrow(OpenAIServiceError);
    });

    it("should handle HTTP 429 error (rate limit)", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        json: async () => ({ error: { message: "Rate limit exceeded" } }),
      } as Response);

      await expect(service.sendRequest("test")).rejects.toThrow(OpenAIServiceError);
    });

    it("should handle HTTP 503 error (service unavailable)", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        json: async () => ({ error: { message: "Service unavailable" } }),
      } as Response);

      await expect(service.sendRequest("test")).rejects.toThrow(OpenAIServiceError);
    });

    it("should handle network errors", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockRejectedValueOnce(new TypeError("fetch failed"));

      await expect(service.sendRequest("test")).rejects.toThrow(OpenAIServiceError);
    });

    it("should validate response structure (must contain choices array)", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test" }), // Missing choices
      } as Response);

      await expect(service.sendRequest("test")).rejects.toThrow(OpenAIServiceError);
    });

    it("should handle JSON parsing errors", async () => {
      const service = new OpenAIService();

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        redirected: false,
        type: "default" as ResponseType,
        url: "",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      await expect(service.sendRequest("test")).rejects.toThrow();
    });
  });

  describe("parseResponse", () => {
    it("should parse valid response with function_call", () => {
      const service = new OpenAIService();

      const rawResponse = {
        id: "test",
        object: "chat.completion",
        created: 1234567890,
        model: "gpt-4",
        choices: [
          {
            index: 0,
            finish_reason: "function_call",
            message: {
              role: "assistant",
              content: null,
              function_call: {
                name: "generate_flashcards",
                arguments: JSON.stringify({
                  flashcards: [
                    { front: "Question 1", back: "Answer 1" },
                    { front: "Question 2", back: "Answer 2" },
                  ],
                }),
              },
            },
          },
        ],
      };

      const result = service.parseResponse(rawResponse);

      expect(result.flashcards).toHaveLength(2);
      expect(result.flashcards[0].front).toBe("Question 1");
      expect(result.flashcards[0].back).toBe("Answer 1");
    });

    it("should throw error when response is empty", () => {
      const service = new OpenAIService();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.parseResponse({} as any)).toThrow(OpenAIServiceError);
    });

    it("should throw error when choices array is empty", () => {
      const service = new OpenAIService();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.parseResponse({ choices: [] } as any)).toThrow(OpenAIServiceError);
    });

    it("should throw error when function_call is missing", () => {
      const service = new OpenAIService();

      const rawResponse = {
        id: "test",
        object: "chat.completion",
        created: 1234567890,
        model: "gpt-4",
        choices: [
          {
            index: 0,
            finish_reason: "stop",
            message: {
              role: "assistant",
              content: "Some text",
            },
          },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.parseResponse(rawResponse as any)).toThrow(OpenAIServiceError);
    });

    it("should throw error when arguments is invalid JSON", () => {
      const service = new OpenAIService();

      const rawResponse = {
        id: "test",
        object: "chat.completion",
        created: 1234567890,
        model: "gpt-4",
        choices: [
          {
            index: 0,
            finish_reason: "function_call",
            message: {
              role: "assistant",
              function_call: {
                name: "generate_flashcards",
                arguments: "invalid json {",
              },
            },
          },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.parseResponse(rawResponse as any)).toThrow(OpenAIServiceError);
    });

    it("should validate flashcards schema (front: 1-200 chars, back: 1-500 chars)", () => {
      const service = new OpenAIService();

      const rawResponse = {
        id: "test",
        object: "chat.completion",
        created: 1234567890,
        model: "gpt-4",
        choices: [
          {
            index: 0,
            finish_reason: "function_call",
            message: {
              role: "assistant",
              function_call: {
                name: "generate_flashcards",
                arguments: JSON.stringify({
                  flashcards: [
                    { front: "", back: "Answer" }, // Empty front
                  ],
                }),
              },
            },
          },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.parseResponse(rawResponse as any)).toThrow(OpenAIServiceError);
    });

    it("should throw error when flashcards array is empty", () => {
      const service = new OpenAIService();

      const rawResponse = {
        id: "test",
        object: "chat.completion",
        created: 1234567890,
        model: "gpt-4",
        choices: [
          {
            index: 0,
            finish_reason: "function_call",
            message: {
              role: "assistant",
              function_call: {
                name: "generate_flashcards",
                arguments: JSON.stringify({
                  flashcards: [],
                }),
              },
            },
          },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => service.parseResponse(rawResponse as any)).toThrow(OpenAIServiceError);
    });
  });

  describe("generateFlashcards", () => {
    it("should create OpenAIService instance and call sendRequest and parseResponse", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "test",
          choices: [
            {
              index: 0,
              finish_reason: "function_call",
              message: {
                role: "assistant",
                function_call: {
                  name: "generate_flashcards",
                  arguments: JSON.stringify({
                    flashcards: [
                      { front: "Q1", back: "A1" },
                      { front: "Q2", back: "A2" },
                    ],
                  }),
                },
              },
            },
          ],
        }),
      } as Response);

      const result = await generateFlashcards("test source text");

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ front: "Q1", back: "A1" });
      expect(result[1]).toEqual({ front: "Q2", back: "A2" });
    });

    it("should map 401/403 errors to AUTHENTICATION_ERROR", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ error: { message: "Invalid API key" } }),
      } as Response);

      try {
        await generateFlashcards("test");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(OpenAIServiceError);
        if (error instanceof OpenAIServiceError) {
          expect(error.code).toBe("AUTHENTICATION_ERROR");
        }
      }
    });

    it("should map 429 errors to RATE_LIMIT_EXCEEDED", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        json: async () => ({ error: { message: "Rate limit" } }),
      } as Response);

      try {
        await generateFlashcards("test");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(OpenAIServiceError);
        if (error instanceof OpenAIServiceError) {
          expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
        }
      }
    });

    it("should map 503/network errors to SERVICE_UNAVAILABLE", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new TypeError("fetch failed"));

      try {
        await generateFlashcards("test");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(OpenAIServiceError);
        if (error instanceof OpenAIServiceError) {
          expect(error.code).toBe("SERVICE_UNAVAILABLE");
        }
      }
    });

    it("should handle unexpected errors", async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce("Unexpected error");

      await expect(generateFlashcards("test")).rejects.toThrow(OpenAIServiceError);
    });
  });
});
