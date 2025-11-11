import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@/db/supabase.client";
import { startStudySession, updateSessionFlashcard, getStudyHistory, completeStudySession } from "./study.service";
import type { FlashcardDTO, StudySessionDTO, SessionFlashcardDTO, UpdateSessionFlashcardCommand } from "@/types";

// Mock FSRS helpers
vi.mock("@/lib/fsrs/helpers", () => ({
  getFsrsInstance: vi.fn(() => ({
    next: vi.fn((card, now) => ({
      card: {
        ...card,
        due: new Date(now.getTime() + 86400000), // +1 day
        stability: card.stability * 1.5,
        reps: card.reps + 1,
      },
      log: {
        review: now,
        elapsed_days: 1,
        scheduled_days: 1,
      },
    })),
  })),
  createInitialCard: vi.fn(() => ({
    due: new Date(Date.now() + 86400000),
    stability: 0.4,
    difficulty: 0.3,
    reps: 0,
    lapses: 0,
    state: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
  })),
  mapSessionFlashcardToCard: vi.fn((record) => ({
    due: new Date(record.next_review_at),
    stability: record.stability,
    difficulty: record.difficulty,
    elapsed_days: record.elapsed_days,
    scheduled_days: record.scheduled_days,
    learning_steps: 0,
    reps: record.review_count,
    lapses: record.lapses,
    state: record.state,
    last_review: record.last_review ? new Date(record.last_review) : undefined,
  })),
  mapFsrsResultToUpdatePayload: vi.fn((result) => ({
    next_review_at: result.card.due.toISOString(),
    stability: result.card.stability,
    difficulty: result.card.difficulty,
    review_count: result.card.reps,
    lapses: result.card.lapses,
    state: result.card.state,
    last_review: result.log.review.toISOString(),
    elapsed_days: result.log.elapsed_days,
    scheduled_days: result.log.scheduled_days,
  })),
  convertUserRatingToFsrs: vi.fn((rating) => {
    if (rating <= 1) return 1; // Rating.Again
    if (rating === 2) return 2; // Rating.Hard
    if (rating >= 5) return 4; // Rating.Easy
    return 3; // Rating.Good
  }),
}));

// Mock Supabase Client
function createMockSupabaseClient() {
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };

  return {
    from: vi.fn().mockReturnValue(mockQuery),
  } as unknown as SupabaseClient;
}

describe("study.service", () => {
  let mockSupabase: SupabaseClient;
  const userId = "user-123";

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    vi.clearAllMocks();
  });

  describe("startStudySession", () => {
    it("should create session with new flashcards", async () => {
      const mockFlashcards: FlashcardDTO[] = [
        {
          id: 1,
          user_id: userId,
          front: "Q1",
          back: "A1",
          type: "manual",
          generation_id: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          user_id: userId,
          front: "Q2",
          back: "A2",
          type: "manual",
          generation_id: null,
          created_at: "2024-01-02T00:00:00Z",
          updated_at: "2024-01-02T00:00:00Z",
        },
      ];

      const mockStudySession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: null,
        flashcards_count: 2,
        average_rating: null,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-10T00:00:00Z",
      };

      // Mock flashcards query
      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      // Mock session_flashcards query (empty - no previous state)
      const mockSessionFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      // Mock study_sessions insert
      const mockSessionInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      // Mock session_flashcards insert
      const mockSessionFlashcardsInsertQuery = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionInsertQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsInsertQuery as unknown);

      const result = await startStudySession(mockSupabase, userId);

      expect(result.studySession).toEqual(mockStudySession);
      expect(result.flashcards).toHaveLength(2);
      expect(result.flashcards[0].id).toBe(1);
      expect(result.flashcards[1].id).toBe(2);
    });

    it("should prioritize due flashcards over new ones", async () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 86400000); // 1 day ago

      // Create enough flashcards to reach the limit, so we can test prioritization
      const mockFlashcards: FlashcardDTO[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        user_id: userId,
        front: `Q${i + 1}`,
        back: `A${i + 1}`,
        type: "manual" as const,
        generation_id: null,
        created_at: `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
        updated_at: `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
      }));

      // Flashcard 1 has previousState with due date (should be prioritized)
      const mockPreviousState: SessionFlashcardDTO = {
        id: 1,
        study_session_id: 1,
        flashcard_id: 1,
        next_review_at: pastDate.toISOString(), // Due
        last_rating: 3,
        review_count: 1,
        stability: 0.5,
        difficulty: 0.3,
        lapses: 0,
        state: 2,
        last_review: pastDate.toISOString(),
        elapsed_days: 1,
        scheduled_days: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      const mockStudySession: StudySessionDTO = {
        id: 2,
        user_id: userId,
        started_at: now.toISOString(),
        completed_at: null,
        flashcards_count: 20, // Limit is 20
        average_rating: null,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      // Mock session_flashcards query with proper structure including study_sessions join
      const mockSessionFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: [
            {
              ...mockPreviousState,
              study_sessions: { user_id: userId },
            },
          ],
          error: null,
        }),
      };

      const mockSessionInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockSessionFlashcardsInsertQuery = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionInsertQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsInsertQuery as unknown);

      const result = await startStudySession(mockSupabase, userId);

      // Should have 20 flashcards (limit)
      expect(result.flashcards).toHaveLength(20);
      // First flashcard should be the due one (id: 1)
      expect(result.flashcards[0].id).toBe(1);
      // Remaining 19 should be new flashcards (ids 2-20, sorted by created_at)
      expect(result.flashcards[1].id).toBe(2);
    });

    it("should throw error when no flashcards exist", async () => {
      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockFlashcardsQuery as unknown);

      await expect(startStudySession(mockSupabase, userId)).rejects.toThrow("Brak fiszek przypisanych do użytkownika");
    });

    it("should add new flashcards when no previous state exists", async () => {
      const now = new Date();
      const mockFlashcards: FlashcardDTO[] = [
        {
          id: 1,
          user_id: userId,
          front: "Q1",
          back: "A1",
          type: "manual",
          generation_id: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
        },
      ];

      const mockStudySession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: now.toISOString(),
        completed_at: null,
        flashcards_count: 1,
        average_rating: null,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      };

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      const mockSessionFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      const mockSessionInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockSessionFlashcardsInsertQuery = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionInsertQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsInsertQuery as unknown);

      const result = await startStudySession(mockSupabase, userId);

      expect(result.flashcards).toHaveLength(1);
      expect(result.flashcards[0].id).toBe(1);
    });

    it("should limit flashcards to 20 per session", async () => {
      const mockFlashcards: FlashcardDTO[] = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        user_id: userId,
        front: `Q${i + 1}`,
        back: `A${i + 1}`,
        type: "manual" as const,
        generation_id: null,
        created_at: `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
        updated_at: `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
      }));

      const mockStudySession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: null,
        flashcards_count: 20,
        average_rating: null,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-10T00:00:00Z",
      };

      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockFlashcards, error: null }),
      };

      const mockSessionFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      const mockSessionInsertQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockSessionFlashcardsInsertQuery = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsQuery as unknown)
        .mockReturnValueOnce(mockSessionInsertQuery as unknown)
        .mockReturnValueOnce(mockSessionFlashcardsInsertQuery as unknown);

      const result = await startStudySession(mockSupabase, userId);

      expect(result.flashcards).toHaveLength(20);
    });

    it("should handle database errors when fetching flashcards", async () => {
      const mockFlashcardsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Database error" },
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockFlashcardsQuery as unknown);

      await expect(startStudySession(mockSupabase, userId)).rejects.toThrow(
        "Nie udało się pobrać fiszek do sesji nauki"
      );
    });
  });

  describe("updateSessionFlashcard", () => {
    const mockStudySession: StudySessionDTO = {
      id: 1,
      user_id: userId,
      started_at: "2024-01-10T00:00:00Z",
      completed_at: null,
      flashcards_count: 2,
      average_rating: null,
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z",
    };

    const mockSessionFlashcard: SessionFlashcardDTO = {
      id: 1,
      study_session_id: 1,
      flashcard_id: 1,
      next_review_at: new Date().toISOString(),
      last_rating: null,
      review_count: 0,
      stability: 0.4,
      difficulty: 0.3,
      lapses: 0,
      state: 0,
      last_review: null,
      elapsed_days: 0,
      scheduled_days: 0,
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z",
    };

    it("should update flashcard rating and recalculate FSRS values", async () => {
      const command: UpdateSessionFlashcardCommand = {
        studySessionId: 1,
        flashcardId: 1,
        lastRating: 4,
      };

      const updatedSessionFlashcard: SessionFlashcardDTO = {
        ...mockSessionFlashcard,
        last_rating: 4,
        review_count: 1,
        stability: 0.6,
        updated_at: new Date().toISOString(),
      };

      const mockSessionQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockFlashcardQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSessionFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedSessionFlashcard, error: null }),
      };

      const mockRatingsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockResolvedValue({
          data: [{ last_rating: 4 }, { last_rating: 5 }],
          error: null,
        }),
      };

      const mockSessionUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockSessionQuery as unknown)
        .mockReturnValueOnce(mockFlashcardQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown)
        .mockReturnValueOnce(mockRatingsQuery as unknown)
        .mockReturnValueOnce(mockSessionUpdateQuery as unknown);

      const result = await updateSessionFlashcard(mockSupabase, userId, command);

      expect(result.last_rating).toBe(4);
      expect(result.review_count).toBe(1);
    });

    it("should calculate average rating correctly", async () => {
      const command: UpdateSessionFlashcardCommand = {
        studySessionId: 1,
        flashcardId: 1,
        lastRating: 3,
      };

      const updatedSessionFlashcard: SessionFlashcardDTO = {
        ...mockSessionFlashcard,
        last_rating: 3,
        review_count: 1,
        updated_at: new Date().toISOString(),
      };

      const mockSessionQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockFlashcardQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSessionFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedSessionFlashcard, error: null }),
      };

      const mockRatingsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockResolvedValue({
          data: [{ last_rating: 3 }, { last_rating: 4 }],
          error: null,
        }),
      };

      const mockSessionUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockSessionQuery as unknown)
        .mockReturnValueOnce(mockFlashcardQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown)
        .mockReturnValueOnce(mockRatingsQuery as unknown)
        .mockReturnValueOnce(mockSessionUpdateQuery as unknown);

      await updateSessionFlashcard(mockSupabase, userId, command);

      // Verify average rating calculation (3 + 4) / 2 = 3.5
      expect(mockSessionUpdateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          average_rating: 3.5,
        })
      );
    });

    it("should auto-complete session when all flashcards are rated", async () => {
      const command: UpdateSessionFlashcardCommand = {
        studySessionId: 1,
        flashcardId: 1,
        lastRating: 5,
      };

      const updatedSessionFlashcard: SessionFlashcardDTO = {
        ...mockSessionFlashcard,
        last_rating: 5,
        review_count: 1,
        updated_at: new Date().toISOString(),
      };

      const mockSessionQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockFlashcardQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockSessionFlashcard, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedSessionFlashcard, error: null }),
      };

      const mockRatingsQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        not: vi.fn().mockResolvedValue({
          data: [{ last_rating: 5 }, { last_rating: 4 }], // 2 ratings = flashcards_count
          error: null,
        }),
      };

      const mockSessionUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockSessionQuery as unknown)
        .mockReturnValueOnce(mockFlashcardQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown)
        .mockReturnValueOnce(mockRatingsQuery as unknown)
        .mockReturnValueOnce(mockSessionUpdateQuery as unknown);

      await updateSessionFlashcard(mockSupabase, userId, command);

      // Verify session is completed when all flashcards are rated
      expect(mockSessionUpdateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          completed_at: expect.any(String),
        })
      );
    });

    it("should throw error for invalid rating", async () => {
      const command: UpdateSessionFlashcardCommand = {
        studySessionId: 1,
        flashcardId: 1,
        lastRating: 6, // Invalid
      };

      await expect(updateSessionFlashcard(mockSupabase, userId, command)).rejects.toThrow(
        "Ocena musi być w zakresie 1-5"
      );
    });

    it("should throw error when session does not exist", async () => {
      const command: UpdateSessionFlashcardCommand = {
        studySessionId: 999,
        flashcardId: 1,
        lastRating: 4,
      };

      const mockSessionQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockSessionQuery as unknown);

      await expect(updateSessionFlashcard(mockSupabase, userId, command)).rejects.toThrow(
        "Sesja nauki nie istnieje lub nie należy do użytkownika"
      );
    });

    it("should throw error when flashcard not found in session", async () => {
      const command: UpdateSessionFlashcardCommand = {
        studySessionId: 1,
        flashcardId: 999,
        lastRating: 4,
      };

      const mockSessionQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStudySession, error: null }),
      };

      const mockFlashcardQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockSessionQuery as unknown)
        .mockReturnValueOnce(mockFlashcardQuery as unknown);

      await expect(updateSessionFlashcard(mockSupabase, userId, command)).rejects.toThrow(
        "Fiszka nie została znaleziona w tej sesji"
      );
    });
  });

  describe("getStudyHistory", () => {
    it("should fetch study history with pagination", async () => {
      const mockSessions: StudySessionDTO[] = [
        {
          id: 1,
          user_id: userId,
          started_at: "2024-01-10T00:00:00Z",
          completed_at: "2024-01-10T01:00:00Z",
          flashcards_count: 10,
          average_rating: 4.0,
          created_at: "2024-01-10T00:00:00Z",
          updated_at: "2024-01-10T01:00:00Z",
        },
        {
          id: 2,
          user_id: userId,
          started_at: "2024-01-09T00:00:00Z",
          completed_at: "2024-01-09T01:00:00Z",
          flashcards_count: 5,
          average_rating: 3.5,
          created_at: "2024-01-09T00:00:00Z",
          updated_at: "2024-01-09T01:00:00Z",
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: mockSessions,
          count: 2,
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getStudyHistory(mockSupabase, userId, {
        page: 1,
        limit: 20,
        sortBy: "started_at",
        sortOrder: "desc",
      });

      expect(result.studySessions).toHaveLength(2);
      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(20);
      expect(result.pagination?.total).toBe(2);
    });

    it("should use default pagination values", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          count: 0,
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      const result = await getStudyHistory(mockSupabase, userId);

      expect(result.pagination?.page).toBe(1);
      expect(result.pagination?.limit).toBe(20);
    });

    it("should limit max page size to 100", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: [],
          count: 0,
          error: null,
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      await getStudyHistory(mockSupabase, userId, { limit: 200 });

      expect(mockQuery.range).toHaveBeenCalledWith(0, 99); // Limited to 100
    });

    it("should handle database errors gracefully", async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        range: vi.fn().mockResolvedValue({
          data: null,
          count: null,
          error: { message: "Database error" },
        }),
      };

      vi.mocked(mockSupabase.from).mockReturnValue(mockQuery as unknown);

      // Implementation logs error but doesn't throw - returns empty array
      const result = await getStudyHistory(mockSupabase, userId);

      expect(result.studySessions).toEqual([]);
      expect(result.pagination?.total).toBe(0);
    });
  });

  describe("completeStudySession", () => {
    it("should complete study session", async () => {
      // First query: check if session exists (not completed yet)
      const mockIncompleteSession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: null,
        flashcards_count: 10,
        average_rating: 4.0,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-10T00:00:00Z",
      };

      // Second query: update session to completed
      const mockCompletedSession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: "2024-01-10T01:00:00Z",
        flashcards_count: 10,
        average_rating: 4.0,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-10T01:00:00Z",
      };

      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockIncompleteSession, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockCompletedSession, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockSelectQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      const result = await completeStudySession(mockSupabase, userId, 1);

      expect(result.completed_at).toBeTruthy();
      expect(mockUpdateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          completed_at: expect.any(String),
          updated_at: expect.any(String),
        })
      );
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith("id", 1);
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("should use provided completedAt timestamp", async () => {
      const completedAt = "2024-01-10T02:00:00Z";
      // First query: check if session exists (not completed yet)
      const mockIncompleteSession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: null,
        flashcards_count: 10,
        average_rating: 4.0,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-10T00:00:00Z",
      };

      // Second query: update session with provided timestamp
      const mockCompletedSession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: completedAt,
        flashcards_count: 10,
        average_rating: 4.0,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: completedAt,
      };

      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockIncompleteSession, error: null }),
      };

      const mockUpdateQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockCompletedSession, error: null }),
      };

      vi.mocked(mockSupabase.from)
        .mockReturnValueOnce(mockSelectQuery as unknown)
        .mockReturnValueOnce(mockUpdateQuery as unknown);

      await completeStudySession(mockSupabase, userId, 1, completedAt);

      expect(mockUpdateQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          completed_at: completedAt,
          updated_at: completedAt,
        })
      );
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith("id", 1);
      expect(mockUpdateQuery.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("should throw error when session does not exist", async () => {
      // First query: check if session exists - returns error
      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "Not found" } }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockSelectQuery as unknown);

      await expect(completeStudySession(mockSupabase, userId, 999)).rejects.toThrow(
        "Sesja nauki nie istnieje lub nie należy do użytkownika"
      );
    });

    it("should return existing session if already completed", async () => {
      // Session that is already completed
      const mockCompletedSession: StudySessionDTO = {
        id: 1,
        user_id: userId,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: "2024-01-10T01:00:00Z",
        flashcards_count: 10,
        average_rating: 4.0,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-01-10T01:00:00Z",
      };

      const mockSelectQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockCompletedSession, error: null }),
      };

      vi.mocked(mockSupabase.from).mockReturnValueOnce(mockSelectQuery as unknown);

      const result = await completeStudySession(mockSupabase, userId, 1);

      expect(result.completed_at).toBeTruthy();
      expect(result.completed_at).toBe("2024-01-10T01:00:00Z");
      // Should not call update since session is already completed
      expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    });
  });
});
