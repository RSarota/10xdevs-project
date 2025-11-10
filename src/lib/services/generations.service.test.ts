import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import type { SupabaseClient } from "../../db/supabase.client";

// Mock environment variables before importing modules
vi.stubEnv("OPENAI_API_KEY", "test-api-key");
vi.stubEnv("OPENAI_URL", "https://test-endpoint.com/api");

// Mock dependencies
vi.mock("./openai.service");
vi.mock("../utils/hash");

// Import after mocking
let createGeneration: typeof import("./generations.service").createGeneration;
let getGenerations: typeof import("./generations.service").getGenerations;
let getGenerationById: typeof import("./generations.service").getGenerationById;
let logGenerationError: typeof import("./generations.service").logGenerationError;
let generateFlashcards: typeof import("./openai.service").generateFlashcards;
let calculateHash: typeof import("../utils/hash").calculateHash;

beforeAll(async () => {
  const generationsModule = await import("./generations.service");
  createGeneration = generationsModule.createGeneration;
  getGenerations = generationsModule.getGenerations;
  getGenerationById = generationsModule.getGenerationById;
  logGenerationError = generationsModule.logGenerationError;

  const openaiModule = await import("./openai.service");
  generateFlashcards = openaiModule.generateFlashcards;

  const hashModule = await import("../utils/hash");
  calculateHash = hashModule.calculateHash;
});

// Mock Supabase Client
function createMockSupabaseClient() {
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  return {
    from: vi.fn().mockReturnValue(mockQuery),
  } as unknown as SupabaseClient;
}

describe("generations.service", () => {
  let mockSupabase: SupabaseClient;
  const userId = "user-123";

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  describe("createGeneration", () => {
    it("should calculate hash of source text", async () => {
      const sourceText = "a".repeat(1000);
      const mockHash = "test-hash-123";

      vi.mocked(calculateHash).mockResolvedValue(mockHash);
      vi.mocked(generateFlashcards).mockResolvedValue([
        { front: "Q1", back: "A1" },
        { front: "Q2", back: "A2" },
      ]);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 1,
            user_id: userId,
            generated_count: 2,
            source_text_hash: mockHash,
            source_text_length: sourceText.length,
            generation_duration: 100,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await createGeneration(mockSupabase, userId, sourceText);

      expect(calculateHash).toHaveBeenCalledWith(sourceText);
    });

    it("should calculate source text length", async () => {
      const sourceText = "a".repeat(2000);

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockResolvedValue([{ front: "Q", back: "A" }]);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 1,
            user_id: userId,
            generated_count: 1,
            source_text_hash: "hash",
            source_text_length: sourceText.length,
            generation_duration: 100,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      const result = await createGeneration(mockSupabase, userId, sourceText);

      expect(result.source_text_length).toBe(2000);
    });

    it("should measure generation duration", async () => {
      const sourceText = "a".repeat(1000);

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return [{ front: "Q", back: "A" }];
      });

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 1,
            user_id: userId,
            generated_count: 1,
            source_text_hash: "hash",
            source_text_length: sourceText.length,
            generation_duration: 10,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      const result = await createGeneration(mockSupabase, userId, sourceText);

      expect(result.generation_duration).toBeGreaterThanOrEqual(0);
    });

    it("should call generateFlashcards with source text", async () => {
      const sourceText = "a".repeat(1000);

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockResolvedValue([
        { front: "Q1", back: "A1" },
        { front: "Q2", back: "A2" },
      ]);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 1,
            user_id: userId,
            generated_count: 2,
            source_text_hash: "hash",
            source_text_length: sourceText.length,
            generation_duration: 100,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await createGeneration(mockSupabase, userId, sourceText);

      expect(generateFlashcards).toHaveBeenCalledWith(sourceText);
    });

    it("should save to database with metadata", async () => {
      const sourceText = "a".repeat(1000);
      const mockHash = "test-hash";

      vi.mocked(calculateHash).mockResolvedValue(mockHash);
      vi.mocked(generateFlashcards).mockResolvedValue([
        { front: "Q1", back: "A1" },
        { front: "Q2", back: "A2" },
      ]);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 1,
            user_id: userId,
            generated_count: 2,
            source_text_hash: mockHash,
            source_text_length: sourceText.length,
            generation_duration: 100,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await createGeneration(mockSupabase, userId, sourceText);

      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        user_id: userId,
        generated_count: 2,
        source_text_hash: mockHash,
        source_text_length: sourceText.length,
        generation_duration: expect.any(Number),
        accepted_unedited_count: 0,
        accepted_edited_count: 0,
      });
    });

    it("should initialize statistics with zeros", async () => {
      const sourceText = "a".repeat(1000);

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockResolvedValue([{ front: "Q", back: "A" }]);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 1,
            user_id: userId,
            generated_count: 1,
            source_text_hash: "hash",
            source_text_length: sourceText.length,
            generation_duration: 100,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await createGeneration(mockSupabase, userId, sourceText);

      const insertCall = mockInsertQuery.insert.mock.calls[0][0];
      expect(insertCall.accepted_unedited_count).toBe(0);
      expect(insertCall.accepted_edited_count).toBe(0);
    });

    it("should return proposals with metadata", async () => {
      const sourceText = "a".repeat(1000);
      const proposals = [
        { front: "Q1", back: "A1" },
        { front: "Q2", back: "A2" },
      ];

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockResolvedValue(proposals);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 5,
            user_id: userId,
            generated_count: 2,
            source_text_hash: "hash",
            source_text_length: sourceText.length,
            generation_duration: 150,
            accepted_unedited_count: 0,
            accepted_edited_count: 0,
            created_at: "2024-01-01T00:00:00Z",
          },
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      const result = await createGeneration(mockSupabase, userId, sourceText);

      expect(result.generation_id).toBe(5);
      expect(result.proposals).toEqual(proposals);
      expect(result.source_text_hash).toBe("hash");
      expect(result.source_text_length).toBe(sourceText.length);
      // generation_duration is calculated from Date.now() difference, so it will be >= 0
      expect(result.generation_duration).toBeGreaterThanOrEqual(0);
      expect(result.created_at).toBe("2024-01-01T00:00:00Z");
    });

    it("should handle database save errors", async () => {
      const sourceText = "a".repeat(1000);

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockResolvedValue([{ front: "Q", back: "A" }]);

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await expect(createGeneration(mockSupabase, userId, sourceText)).rejects.toThrow(
        "Błąd podczas zapisywania generacji"
      );
    });

    it("should handle AI service errors", async () => {
      const sourceText = "a".repeat(1000);

      vi.mocked(calculateHash).mockResolvedValue("hash");
      vi.mocked(generateFlashcards).mockRejectedValue(new Error("AI service error"));

      await expect(createGeneration(mockSupabase, userId, sourceText)).rejects.toThrow("AI service error");
    });
  });

  describe("getGenerations", () => {
    it("should calculate offset correctly for pagination", async () => {
      const mockData = [
        { id: 1, user_id: userId, generated_count: 5, created_at: "2024-01-01" },
        { id: 2, user_id: userId, generated_count: 3, created_at: "2024-01-02" },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 2 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getGenerations(mockSupabase, userId, {
        page: 2,
        limit: 10,
        sort_order: "desc",
      });

      expect(mockQuery.range).toHaveBeenCalledWith(10, 19);
    });

    it("should sort by created_at ascending", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getGenerations(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_order: "asc",
      });

      expect(mockQuery.order).toHaveBeenCalledWith("created_at", { ascending: true });
    });

    it("should sort by created_at descending", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getGenerations(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_order: "desc",
      });

      expect(mockQuery.order).toHaveBeenCalledWith("created_at", { ascending: false });
    });

    it("should filter by user_id (ownership)", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getGenerations(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_order: "desc",
      });

      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("should calculate total_pages correctly", async () => {
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        user_id: userId,
        generated_count: 5,
        created_at: "2024-01-01",
      }));

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 25 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getGenerations(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_order: "desc",
      });

      expect(result.pagination.total_pages).toBe(3); // Math.ceil(25/10)
    });

    it("should return correct pagination structure", async () => {
      const mockData = [{ id: 1, user_id: userId, generated_count: 5, created_at: "2024-01-01" }];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 1 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getGenerations(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_order: "desc",
      });

      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        total_pages: 1,
      });
    });

    it("should handle database errors", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi
          .fn()
          .mockResolvedValue({ data: null, error: { message: "Database error", code: "PGRST_ERROR" }, count: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await expect(
        getGenerations(mockSupabase, userId, {
          page: 1,
          limit: 10,
          sort_order: "desc",
        })
      ).rejects.toThrow("Błąd podczas pobierania generacji");
    });
  });

  describe("getGenerationById", () => {
    it("should fetch generation by ID", async () => {
      const mockGeneration = {
        id: 1,
        user_id: userId,
        generated_count: 5,
        created_at: "2024-01-01",
      };

      const mockFlashcards = [{ id: 1, type: "ai-full" as const, front: "Q1", back: "A1", created_at: "2024-01-01" }];

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockGeneration, error: null }),
      };

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown);

      const result = await getGenerationById(mockSupabase, userId, 1);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.id).toBe(1);
        expect(result.flashcards).toEqual(mockFlashcards);
      }
    });

    it("should verify ownership (generation belongs to user)", async () => {
      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      const result = await getGenerationById(mockSupabase, userId, 1);

      expect(result).toBeNull();
    });

    it("should fetch related flashcards (only ai-full and ai-edited)", async () => {
      const mockGeneration = {
        id: 1,
        user_id: userId,
        generated_count: 5,
        created_at: "2024-01-01",
      };

      const mockFlashcards = [
        { id: 1, type: "ai-full" as const, front: "Q1", back: "A1", created_at: "2024-01-01" },
        { id: 2, type: "ai-edited" as const, front: "Q2", back: "A2", created_at: "2024-01-02" },
      ];

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockGeneration, error: null }),
      };

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown);

      const result = await getGenerationById(mockSupabase, userId, 1);

      expect(mockFlashcardsQuery.in).toHaveBeenCalledWith("type", ["ai-full", "ai-edited"]);
      if (result) {
        expect(result.flashcards).toHaveLength(2);
      }
    });

    it("should sort flashcards by created_at ascending", async () => {
      const mockGeneration = {
        id: 1,
        user_id: userId,
        generated_count: 5,
        created_at: "2024-01-01",
      };

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockGeneration, error: null }),
      };

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown);

      await getGenerationById(mockSupabase, userId, 1);

      expect(mockFlashcardsQuery.order).toHaveBeenCalledWith("created_at", { ascending: true });
    });

    it("should return null when generation does not exist", async () => {
      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      const result = await getGenerationById(mockSupabase, userId, 999);

      expect(result).toBeNull();
    });

    it("should return null when generation belongs to another user", async () => {
      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      const result = await getGenerationById(mockSupabase, userId, 1);

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error", code: "PGRST_ERROR" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      await expect(getGenerationById(mockSupabase, userId, 1)).rejects.toThrow("Błąd podczas pobierania generacji");
    });
  });

  describe("logGenerationError", () => {
    it("should save error to generation_error_logs", async () => {
      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await logGenerationError(mockSupabase, userId, "hash-123", 1000, "API_TIMEOUT", "Timeout error");

      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        user_id: userId,
        source_text_hash: "hash-123",
        source_text_length: 1000,
        error_code: "API_TIMEOUT",
        error_message: "Timeout error",
      });
    });

    it("should not interrupt main flow on logging error", async () => {
      const mockInsertQuery = {
        insert: vi.fn().mockResolvedValue({ data: null, error: { message: "Logging error" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      // Should not throw
      await expect(
        logGenerationError(mockSupabase, userId, "hash-123", 1000, "API_TIMEOUT", "Timeout error")
      ).resolves.not.toThrow();
    });

    it("should log errors to console as fallback", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
        // Intentionally empty for test
      });

      const mockInsertQuery = {
        insert: vi.fn().mockRejectedValue(new Error("Database error")),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await logGenerationError(mockSupabase, userId, "hash-123", 1000, "API_TIMEOUT", "Timeout error");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
