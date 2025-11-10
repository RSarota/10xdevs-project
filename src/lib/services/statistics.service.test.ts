import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "../../db/supabase.client";
import { getUserStatistics } from "./statistics.service";

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

describe("statistics.service", () => {
  let mockSupabase: SupabaseClient;
  const userId = "user-123";

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  describe("getUserStatistics", () => {
    it("should count flashcards by type", async () => {
      const flashcardsData: { type: string }[] = [
        { type: "manual" },
        { type: "manual" },
        { type: "ai-full" },
        { type: "ai-edited" },
        { type: "ai-full" },
      ];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.flashcards.by_type.manual).toBe(2);
      expect(result.flashcards.by_type["ai-full"]).toBe(2);
      expect(result.flashcards.by_type["ai-edited"]).toBe(1);
    });

    it("should calculate total flashcards count", async () => {
      const flashcardsData: { type: string }[] = [{ type: "manual" }, { type: "ai-full" }, { type: "ai-edited" }];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.flashcards.total).toBe(3);
    });

    it("should aggregate generation statistics (SUM generated_count, accepted_unedited_count, accepted_edited_count)", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [
        { generated_count: 10, accepted_unedited_count: 5, accepted_edited_count: 2 },
        { generated_count: 15, accepted_unedited_count: 3, accepted_edited_count: 4 },
        { generated_count: 20, accepted_unedited_count: 8, accepted_edited_count: 1 },
      ];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.total_generated).toBe(45); // 10 + 15 + 20
      expect(result.generations.total_accepted).toBe(23); // (5+3+8) + (2+4+1) = 16 + 7
    });

    it("should calculate total_sessions (COUNT generations)", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [
        { generated_count: 10, accepted_unedited_count: 5, accepted_edited_count: 2 },
        { generated_count: 15, accepted_unedited_count: 3, accepted_edited_count: 4 },
      ];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.total_sessions).toBe(2);
    });

    it("should calculate total_generated (SUM generated_count)", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [
        { generated_count: 10, accepted_unedited_count: 5, accepted_edited_count: 2 },
        { generated_count: 20, accepted_unedited_count: 3, accepted_edited_count: 4 },
      ];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.total_generated).toBe(30);
    });

    it("should calculate total_accepted (SUM accepted_unedited_count + accepted_edited_count)", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [
        { generated_count: 10, accepted_unedited_count: 5, accepted_edited_count: 2 },
        { generated_count: 20, accepted_unedited_count: 3, accepted_edited_count: 4 },
      ];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.total_accepted).toBe(14); // (5+3) + (2+4)
    });

    it("should calculate acceptance_rate with protection against division by zero", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [{ generated_count: 100, accepted_unedited_count: 50, accepted_edited_count: 20 }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      // acceptance_rate = (70/100) * 100 = 70
      expect(result.generations.acceptance_rate).toBe(70);
    });

    it("should return 0 for acceptance_rate when total_generated is 0", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [{ generated_count: 0, accepted_unedited_count: 0, accepted_edited_count: 0 }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.acceptance_rate).toBe(0);
    });

    it("should calculate edit_rate with protection against division by zero", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [{ generated_count: 100, accepted_unedited_count: 50, accepted_edited_count: 20 }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      // edit_rate = (20/70) * 100 = 28.57... rounded to 2 decimals = 28.57
      expect(result.generations.edit_rate).toBe(28.57);
    });

    it("should return 0 for edit_rate when total_accepted is 0", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [{ generated_count: 100, accepted_unedited_count: 0, accepted_edited_count: 0 }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.edit_rate).toBe(0);
    });

    it("should round to 2 decimal places (Math.round(* 100) / 100)", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [{ generated_count: 3, accepted_unedited_count: 1, accepted_edited_count: 1 }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      // acceptance_rate = (2/3) * 100 = 66.666... rounded = 66.67
      expect(result.generations.acceptance_rate).toBe(66.67);
    });

    it("should return correct UserStatisticsDTO structure", async () => {
      const flashcardsData: { type: string }[] = [{ type: "manual" }, { type: "ai-full" }];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [{ generated_count: 10, accepted_unedited_count: 5, accepted_edited_count: 2 }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result).toHaveProperty("flashcards");
      expect(result).toHaveProperty("generations");
      expect(result.flashcards).toHaveProperty("total");
      expect(result.flashcards).toHaveProperty("by_type");
      expect(result.generations).toHaveProperty("total_sessions");
      expect(result.generations).toHaveProperty("total_generated");
      expect(result.generations).toHaveProperty("total_accepted");
      expect(result.generations).toHaveProperty("acceptance_rate");
      expect(result.generations).toHaveProperty("edit_rate");
    });

    it("should handle empty data (0 flashcards, 0 generations)", async () => {
      const flashcardsData: { type: string }[] = [];
      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.flashcards.total).toBe(0);
      expect(result.flashcards.by_type.manual).toBe(0);
      expect(result.flashcards.by_type["ai-full"]).toBe(0);
      expect(result.flashcards.by_type["ai-edited"]).toBe(0);
      expect(result.generations.total_sessions).toBe(0);
      expect(result.generations.total_generated).toBe(0);
      expect(result.generations.total_accepted).toBe(0);
      expect(result.generations.acceptance_rate).toBe(0);
      expect(result.generations.edit_rate).toBe(0);
    });

    it("should handle database errors for flashcards", async () => {
      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockFlashcardsQuery as unknown);

      await expect(getUserStatistics(mockSupabase, userId)).rejects.toThrow("Błąd podczas pobierania statystyk fiszek");
    });

    it("should handle database errors for generations", async () => {
      const flashcardsData: { type: string }[] = [{ type: "manual" }];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      await expect(getUserStatistics(mockSupabase, userId)).rejects.toThrow(
        "Błąd podczas pobierania statystyk generacji"
      );
    });

    it("should handle null values in generation counts", async () => {
      const flashcardsData: { type: string }[] = [];

      const generationsData: {
        generated_count: number | null;
        accepted_unedited_count: number | null;
        accepted_edited_count: number | null;
      }[] = [
        { generated_count: null, accepted_unedited_count: null, accepted_edited_count: null },
        { generated_count: 10, accepted_unedited_count: 5, accepted_edited_count: 2 },
      ];

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: flashcardsData, error: null }),
      };

      const mockGenerationsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: generationsData, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockGenerationsQuery as unknown);

      const result = await getUserStatistics(mockSupabase, userId);

      expect(result.generations.total_generated).toBe(10);
      expect(result.generations.total_accepted).toBe(7); // 5 + 2
    });
  });
});
