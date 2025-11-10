import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "../../db/supabase.client";
import { getErrors } from "./generation-errors.service";

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

describe("generation-errors.service", () => {
  let mockSupabase: SupabaseClient;
  const userId = "user-123";

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  describe("getErrors", () => {
    it("should calculate offset correctly for pagination", async () => {
      const mockData = [
        {
          id: 1,
          user_id: userId,
          source_text_hash: "hash1",
          source_text_length: 1000,
          error_code: "API_TIMEOUT",
          error_message: "Timeout",
          created_at: "2024-01-01",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 1 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getErrors(mockSupabase, userId, {
        page: 3,
        limit: 20,
      });

      expect(mockQuery.range).toHaveBeenCalledWith(40, 59);
    });

    it("should filter by error_code when provided", async () => {
      const mockData = [
        {
          id: 1,
          user_id: userId,
          source_text_hash: "hash1",
          source_text_length: 1000,
          error_code: "API_TIMEOUT",
          error_message: "Timeout",
          created_at: "2024-01-01",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 1 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
        error_code: "API_TIMEOUT",
      });

      expect(mockQuery.eq).toHaveBeenCalledWith("error_code", "API_TIMEOUT");
    });

    it("should not filter by error_code when not provided", async () => {
      const mockData = [
        {
          id: 1,
          user_id: userId,
          source_text_hash: "hash1",
          source_text_length: 1000,
          error_code: "API_TIMEOUT",
          error_message: "Timeout",
          created_at: "2024-01-01",
        },
        {
          id: 2,
          user_id: userId,
          source_text_hash: "hash2",
          source_text_length: 2000,
          error_code: "NETWORK_ERROR",
          error_message: "Network error",
          created_at: "2024-01-02",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 2 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
      });

      // Should not call eq with error_code
      const eqCalls = mockQuery.eq.mock.calls;
      const errorCodeCall = eqCalls.find((call) => call[0] === "error_code");
      expect(errorCodeCall).toBeUndefined();
    });

    it("should sort by created_at DESC (newest first)", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
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

      await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
      });

      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("should calculate total_pages correctly", async () => {
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        user_id: userId,
        source_text_hash: `hash${i}`,
        source_text_length: 1000,
        error_code: "API_TIMEOUT",
        error_message: "Timeout",
        created_at: "2024-01-01",
      }));

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 25 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
      });

      expect(result.pagination.total_pages).toBe(3); // Math.ceil(25/10)
    });

    it("should return correct pagination structure", async () => {
      const mockData = [
        {
          id: 1,
          user_id: userId,
          source_text_hash: "hash1",
          source_text_length: 1000,
          error_code: "API_TIMEOUT",
          error_message: "Timeout",
          created_at: "2024-01-01",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 1 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
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
        getErrors(mockSupabase, userId, {
          page: 1,
          limit: 10,
        })
      ).rejects.toThrow("Błąd podczas pobierania logów błędów");
    });

    it("should return empty array when no errors", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getErrors(mockSupabase, userId, {
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });
});
