import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "../../db/supabase.client";
import {
  getFlashcards,
  getFlashcardById,
  createOne,
  createMany,
  updateFlashcard,
  deleteFlashcard,
  bulkDeleteFlashcards,
  getAllFlashcardIds,
} from "./flashcards.service";
import type { CreateFlashcardCommand } from "../../types";

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

describe("flashcards.service", () => {
  let mockSupabase: SupabaseClient;
  const userId = "user-123";

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  describe("getFlashcards", () => {
    it("should fetch flashcards with pagination", async () => {
      const mockData = [
        {
          id: 1,
          front: "Q1",
          back: "A1",
          user_id: userId,
          type: "manual" as const,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
        {
          id: 2,
          front: "Q2",
          back: "A2",
          user_id: userId,
          type: "manual" as const,
          created_at: "2024-01-02",
          updated_at: "2024-01-02",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 2 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getFlashcards(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_by: "created_at",
        sort_order: "desc",
      });

      expect(result.flashcards).toEqual(mockData);
      expect(result.total).toBe(2);
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", userId);
      expect(mockQuery.range).toHaveBeenCalledWith(0, 9);
    });

    it("should filter by type", async () => {
      const mockData = [
        {
          id: 1,
          front: "Q1",
          back: "A1",
          user_id: userId,
          type: "ai-full" as const,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 1 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getFlashcards(mockSupabase, userId, {
        type: "ai-full",
        page: 1,
        limit: 10,
        sort_by: "created_at",
        sort_order: "desc",
      });

      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", userId);
      expect(mockQuery.eq).toHaveBeenCalledWith("type", "ai-full");
    });

    it("should filter by generation_id", async () => {
      const mockData = [
        {
          id: 1,
          front: "Q1",
          back: "A1",
          user_id: userId,
          type: "ai-full" as const,
          generation_id: 5,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: mockData, error: null, count: 1 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getFlashcards(mockSupabase, userId, {
        generation_id: 5,
        page: 1,
        limit: 10,
        sort_by: "created_at",
        sort_order: "desc",
      });

      expect(mockQuery.eq).toHaveBeenCalledWith("generation_id", 5);
    });

    it("should calculate offset correctly for pagination", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getFlashcards(mockSupabase, userId, {
        page: 3,
        limit: 20,
        sort_by: "created_at",
        sort_order: "desc",
      });

      expect(mockQuery.range).toHaveBeenCalledWith(40, 59);
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
        getFlashcards(mockSupabase, userId, {
          page: 1,
          limit: 10,
          sort_by: "created_at",
          sort_order: "desc",
        })
      ).rejects.toThrow("Błąd podczas pobierania fiszek");
    });

    it("should sort by updated_at ascending", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getFlashcards(mockSupabase, userId, {
        page: 1,
        limit: 10,
        sort_by: "updated_at",
        sort_order: "asc",
      });

      expect(mockQuery.order).toHaveBeenCalledWith("updated_at", { ascending: true });
    });
  });

  describe("getFlashcardById", () => {
    it("should fetch single flashcard by ID", async () => {
      const mockFlashcard = {
        id: 1,
        front: "Q1",
        back: "A1",
        user_id: userId,
        type: "manual" as const,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFlashcard, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getFlashcardById(mockSupabase, userId, 1);

      expect(result).toEqual(mockFlashcard);
      expect(mockQuery.eq).toHaveBeenCalledWith("id", 1);
      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("should return null when flashcard does not exist", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116", message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getFlashcardById(mockSupabase, userId, 999);

      expect(result).toBeNull();
    });

    it("should return null when flashcard belongs to another user", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116", message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getFlashcardById(mockSupabase, userId, 1);

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error", code: "PGRST_ERROR" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await expect(getFlashcardById(mockSupabase, userId, 1)).rejects.toThrow("Błąd podczas pobierania fiszki");
    });
  });

  describe("createOne", () => {
    it("should create manual flashcard without generation_id", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "manual",
      };

      const mockFlashcard = {
        id: 1,
        ...command,
        type: "manual" as const,
        user_id: userId,
        generation_id: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFlashcard, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      const result = await createOne(mockSupabase, userId, command);

      expect(result).toEqual(mockFlashcard);
      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        user_id: userId,
        front: command.front,
        back: command.back,
        type: "manual",
        generation_id: null,
      });
    });

    it("should create ai-full flashcard with generation_id validation", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "ai-full",
        generation_id: 5,
      };

      const mockFlashcard = {
        id: 1,
        ...command,
        type: "ai-full" as const,
        user_id: userId,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      // Mock validateGenerationOwnership (check generation exists)
      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 5 }, error: null }),
      };

      // Mock insert
      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFlashcard, error: null }),
      };

      // Mock get current generation stats
      const mockGenStatsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { accepted_unedited_count: 0, accepted_edited_count: 0 }, error: null }),
      };

      // Mock update stats
      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown) // validateGenerationOwnership
        .mockReturnValueOnce(mockInsertQuery as unknown) // insert flashcard
        .mockReturnValueOnce(mockGenStatsQuery as unknown) // get current stats
        .mockReturnValueOnce(mockUpdateQuery as unknown); // update stats

      const result = await createOne(mockSupabase, userId, command);

      expect(result).toEqual(mockFlashcard);
    });

    it("should update accepted_unedited_count for ai-full flashcard", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "ai-full",
        generation_id: 5,
      };

      const mockFlashcard = {
        id: 1,
        ...command,
        type: "ai-full" as const,
        user_id: userId,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 5 }, error: null }),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFlashcard, error: null }),
      };

      const mockGenStatsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { accepted_unedited_count: 2, accepted_edited_count: 1 }, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown)
        .mockReturnValueOnce(mockInsertQuery as unknown)
        .mockReturnValueOnce(mockGenStatsQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      await createOne(mockSupabase, userId, command);

      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ accepted_unedited_count: 3 });
    });

    it("should update accepted_edited_count for ai-edited flashcard", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "ai-edited",
        generation_id: 5,
      };

      const mockFlashcard = {
        id: 1,
        ...command,
        type: "ai-edited" as const,
        user_id: userId,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 5 }, error: null }),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockFlashcard, error: null }),
      };

      const mockGenStatsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { accepted_unedited_count: 2, accepted_edited_count: 1 }, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown)
        .mockReturnValueOnce(mockInsertQuery as unknown)
        .mockReturnValueOnce(mockGenStatsQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      await createOne(mockSupabase, userId, command);

      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ accepted_edited_count: 2 });
    });

    it("should throw error when generation_id does not exist", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "ai-full",
        generation_id: 999,
      };

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      await expect(createOne(mockSupabase, userId, command)).rejects.toThrow("Generation ID 999 nie istnieje");
    });

    it("should throw error when generation_id belongs to another user", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "ai-full",
        generation_id: 5,
      };

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      await expect(createOne(mockSupabase, userId, command)).rejects.toThrow("Generation ID 5 nie istnieje");
    });

    it("should handle insert errors", async () => {
      const command: CreateFlashcardCommand = {
        front: "Question",
        back: "Answer",
        source: "manual",
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Insert error" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await expect(createOne(mockSupabase, userId, command)).rejects.toThrow("Błąd podczas tworzenia fiszki");
    });
  });

  describe("createMany", () => {
    it("should create multiple flashcards at once", async () => {
      const commands: CreateFlashcardCommand[] = [
        { front: "Q1", back: "A1", source: "manual" },
        { front: "Q2", back: "A2", source: "manual" },
      ];

      const mockFlashcards = [
        {
          id: 1,
          ...commands[0],
          type: "manual" as const,
          user_id: userId,
          generation_id: null,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
        {
          id: 2,
          ...commands[1],
          type: "manual" as const,
          user_id: userId,
          generation_id: null,
          created_at: "2024-01-01",
          updated_at: "2024-01-01",
        },
      ];

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      const result = await createMany(mockSupabase, userId, commands);

      expect(result.flashcards).toEqual(mockFlashcards);
      expect(result.flashcards).toHaveLength(2);
    });

    it("should validate all generation_id before insert", async () => {
      const commands: CreateFlashcardCommand[] = [
        { front: "Q1", back: "A1", source: "ai-full", generation_id: 5 },
        { front: "Q2", back: "A2", source: "ai-full", generation_id: 5 },
      ];

      const mockFlashcards = commands.map((cmd, idx) => ({
        id: idx + 1,
        ...cmd,
        type: cmd.source as const,
        user_id: userId,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      }));

      const mockGenValidationQuery = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [{ id: 5 }], error: null }),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      const mockGenStatsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { accepted_unedited_count: 0, accepted_edited_count: 0 }, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenValidationQuery as unknown) // validate generation_id
        .mockReturnValueOnce(mockInsertQuery as unknown) // insert flashcards
        .mockReturnValueOnce(mockGenStatsQuery as unknown) // get stats for update
        .mockReturnValueOnce(mockUpdateQuery as unknown); // update stats

      await createMany(mockSupabase, userId, commands);

      // Should validate generation_id before insert
      expect(mockSupabase.from).toHaveBeenCalledWith("generations");
    });

    it("should deduplicate generation_id before validation", async () => {
      const commands: CreateFlashcardCommand[] = [
        { front: "Q1", back: "A1", source: "ai-full", generation_id: 5 },
        { front: "Q2", back: "A2", source: "ai-full", generation_id: 5 },
        { front: "Q3", back: "A3", source: "ai-full", generation_id: 5 },
      ];

      const mockFlashcards = commands.map((cmd, idx) => ({
        id: idx + 1,
        ...cmd,
        type: cmd.source as const,
        user_id: userId,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      }));

      const mockGenValidationQuery = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [{ id: 5 }], error: null }),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      const mockGenStatsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { accepted_unedited_count: 0, accepted_edited_count: 0 }, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenValidationQuery as unknown) // validate generation_id
        .mockReturnValueOnce(mockInsertQuery as unknown) // insert flashcards
        .mockReturnValueOnce(mockGenStatsQuery as unknown) // get stats for update
        .mockReturnValueOnce(mockUpdateQuery as unknown); // update stats

      await createMany(mockSupabase, userId, commands);

      // Should only validate unique generation_id (5) once
      expect(mockGenValidationQuery.in).toHaveBeenCalledWith("id", [5]);
    });

    it("should throw error when any generation_id is invalid", async () => {
      const commands: CreateFlashcardCommand[] = [
        { front: "Q1", back: "A1", source: "ai-full", generation_id: 5 },
        { front: "Q2", back: "A2", source: "ai-full", generation_id: 999 },
      ];

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [{ id: 5 }], error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGenQuery as unknown);

      await expect(createMany(mockSupabase, userId, commands)).rejects.toThrow("Generation ID 999 nie istnieje");
    });

    it("should group flashcards per generation_id for statistics", async () => {
      const commands: CreateFlashcardCommand[] = [
        { front: "Q1", back: "A1", source: "ai-full", generation_id: 5 },
        { front: "Q2", back: "A2", source: "ai-full", generation_id: 5 },
        { front: "Q3", back: "A3", source: "ai-edited", generation_id: 5 },
      ];

      const mockFlashcards = commands.map((cmd, idx) => ({
        id: idx + 1,
        ...cmd,
        type: cmd.source as const,
        user_id: userId,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      }));

      const mockGenQuery = {
        select: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [{ id: 5 }], error: null }),
      };

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      const mockGenStatsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: { accepted_unedited_count: 0, accepted_edited_count: 0 }, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGenQuery as unknown)
        .mockReturnValueOnce(mockInsertQuery as unknown)
        .mockReturnValueOnce(mockGenStatsQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      await createMany(mockSupabase, userId, commands);

      // Should update stats: 2 ai-full + 1 ai-edited
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({
        accepted_unedited_count: 2,
        accepted_edited_count: 1,
      });
    });

    it("should return flashcards in same order as input", async () => {
      const commands: CreateFlashcardCommand[] = [
        { front: "Q1", back: "A1", source: "manual" },
        { front: "Q2", back: "A2", source: "manual" },
        { front: "Q3", back: "A3", source: "manual" },
      ];

      const mockFlashcards = commands.map((cmd, idx) => ({
        id: idx + 1,
        ...cmd,
        type: cmd.source as const,
        user_id: userId,
        generation_id: null,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      }));

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      const result = await createMany(mockSupabase, userId, commands);

      expect(result.flashcards[0].front).toBe("Q1");
      expect(result.flashcards[1].front).toBe("Q2");
      expect(result.flashcards[2].front).toBe("Q3");
    });

    it("should handle insert errors", async () => {
      const commands: CreateFlashcardCommand[] = [{ front: "Q1", back: "A1", source: "manual" }];

      const mockInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockResolvedValue({ data: null, error: { message: "Insert error" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockInsertQuery as unknown);

      await expect(createMany(mockSupabase, userId, commands)).rejects.toThrow("Błąd podczas tworzenia fiszek");
    });
  });

  describe("updateFlashcard", () => {
    it("should update front field", async () => {
      const existingFlashcard = {
        id: 1,
        front: "Old",
        back: "Answer",
        user_id: userId,
        type: "manual" as const,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      const updatedFlashcard = { ...existingFlashcard, front: "New" };

      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: existingFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedFlashcard, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGetQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      const result = await updateFlashcard(mockSupabase, userId, 1, { front: "New" });

      expect(result.front).toBe("New");
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ front: "New" });
    });

    it("should update back field", async () => {
      const existingFlashcard = {
        id: 1,
        front: "Question",
        back: "Old",
        user_id: userId,
        type: "manual" as const,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      const updatedFlashcard = { ...existingFlashcard, back: "New" };

      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: existingFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedFlashcard, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGetQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      const result = await updateFlashcard(mockSupabase, userId, 1, { back: "New" });

      expect(result.back).toBe("New");
    });

    it("should update both fields simultaneously", async () => {
      const existingFlashcard = {
        id: 1,
        front: "Old1",
        back: "Old2",
        user_id: userId,
        type: "manual" as const,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };
      const updatedFlashcard = { ...existingFlashcard, front: "New1", back: "New2" };

      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: existingFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedFlashcard, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGetQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      const result = await updateFlashcard(mockSupabase, userId, 1, { front: "New1", back: "New2" });

      expect(result.front).toBe("New1");
      expect(result.back).toBe("New2");
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({ front: "New1", back: "New2" });
    });

    it("should verify ownership before update", async () => {
      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGetQuery as unknown);

      await expect(updateFlashcard(mockSupabase, userId, 1, { front: "New" })).rejects.toThrow("Fiszka nie istnieje");
    });

    it("should throw error when flashcard does not exist", async () => {
      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGetQuery as unknown);

      await expect(updateFlashcard(mockSupabase, userId, 999, { front: "New" })).rejects.toThrow("Fiszka nie istnieje");
    });

    it("should throw error when flashcard belongs to another user", async () => {
      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockGetQuery as unknown);

      await expect(updateFlashcard(mockSupabase, userId, 1, { front: "New" })).rejects.toThrow("Fiszka nie istnieje");
    });

    it("should handle update errors", async () => {
      const existingFlashcard = {
        id: 1,
        front: "Old",
        back: "Answer",
        user_id: userId,
        type: "manual" as const,
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
      };

      const mockGetQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: existingFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Update error" } }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockGetQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      await expect(updateFlashcard(mockSupabase, userId, 1, { front: "New" })).rejects.toThrow(
        "Błąd podczas aktualizacji fiszki"
      );
    });
  });

  describe("deleteFlashcard", () => {
    it("should delete flashcard with ownership verification", async () => {
      const mockDeleteQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        mockResolvedValue: vi.fn().mockResolvedValue({ error: null, count: 1 }),
      };

      const deleteResult = { error: null, count: 1 };
      mockDeleteQuery.delete = vi.fn().mockReturnThis();
      mockDeleteQuery.eq = vi.fn().mockReturnThis();
      vi.mocked(mockDeleteQuery.eq).mockResolvedValue(deleteResult);

      vi.mocked(mockSupabase.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation((col) => {
          if (col === "id") {
            return {
              eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
            };
          }
          return { eq: vi.fn().mockResolvedValue({ error: null, count: 1 }) };
        }),
      } as unknown);

      const result = await deleteFlashcard(mockSupabase, userId, 1);

      expect(result.success).toBe(true);
      expect(result.deletedId).toBe(1);
    });

    it("should return success false when nothing was deleted", async () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation((col) => {
          if (col === "id") {
            return {
              eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
            };
          }
          return { eq: vi.fn().mockResolvedValue({ error: null, count: 0 }) };
        }),
      } as unknown);

      const result = await deleteFlashcard(mockSupabase, userId, 999);

      expect(result.success).toBe(false);
      expect(result.deletedId).toBeUndefined();
    });

    it("should handle delete errors", async () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockImplementation((col) => {
          if (col === "id") {
            return {
              eq: vi.fn().mockResolvedValue({ error: { message: "Delete error" }, count: null }),
            };
          }
          return { eq: vi.fn().mockResolvedValue({ error: { message: "Delete error" }, count: null }) };
        }),
      } as unknown);

      await expect(deleteFlashcard(mockSupabase, userId, 1)).rejects.toThrow("Błąd podczas usuwania fiszki");
    });
  });

  describe("bulkDeleteFlashcards", () => {
    it("should delete multiple flashcards at once", async () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null, count: 3 }),
      } as unknown);

      const result = await bulkDeleteFlashcards(mockSupabase, userId, [1, 2, 3]);

      expect(result.deletedCount).toBe(3);
    });

    it("should deduplicate IDs before deletion", async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null, count: 2 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await bulkDeleteFlashcards(mockSupabase, userId, [1, 2, 2, 3, 3]);

      expect(mockQuery.in).toHaveBeenCalledWith("id", [1, 2, 3]);
    });

    it("should verify ownership (only deletes user's flashcards)", async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null, count: 2 }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await bulkDeleteFlashcards(mockSupabase, userId, [1, 2]);

      expect(mockQuery.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("should return 0 when no flashcards to delete", async () => {
      const result = await bulkDeleteFlashcards(mockSupabase, userId, []);

      expect(result.deletedCount).toBe(0);
    });

    it("should handle delete errors", async () => {
      vi.mocked(mockSupabase.from).mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: { message: "Delete error" }, count: null }),
      } as unknown);

      await expect(bulkDeleteFlashcards(mockSupabase, userId, [1, 2])).rejects.toThrow("Błąd podczas usuwania fiszek");
    });
  });

  describe("getAllFlashcardIds", () => {
    it("should fetch all flashcard IDs for user", async () => {
      const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getAllFlashcardIds(mockSupabase, userId);

      expect(result).toEqual([1, 2, 3]);
    });

    it("should return empty array when no flashcards", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getAllFlashcardIds(mockSupabase, userId);

      expect(result).toEqual([]);
    });

    it("should handle errors", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: null, error: { message: "Database error" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await expect(getAllFlashcardIds(mockSupabase, userId)).rejects.toThrow("Błąd podczas pobierania ID fiszek");
    });
  });
});
