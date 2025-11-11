import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useStudySession } from "./useStudySession";
import type { FlashcardDTO, StudySessionDTO } from "@/types";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe("useStudySession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockStudySession: StudySessionDTO = {
    id: 1,
    user_id: "user-123",
    started_at: "2024-01-10T00:00:00Z",
    completed_at: null,
    flashcards_count: 2,
    average_rating: null,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  };

  const mockFlashcards: FlashcardDTO[] = [
    {
      id: 1,
      user_id: "user-123",
      front: "Q1",
      back: "A1",
      type: "manual",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      user_id: "user-123",
      front: "Q2",
      back: "A2",
      type: "manual",
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
    },
  ];

  describe("initial state", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useStudySession());

      expect(result.current.studySession).toBeNull();
      expect(result.current.flashcards).toEqual([]);
      expect(result.current.currentFlashcardIndex).toBe(0);
      expect(result.current.isRevealed).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isRating).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasSessionEnded).toBe(false);
      expect(result.current.currentFlashcard).toBeNull();
    });
  });

  describe("startSession", () => {
    it("should start a study session successfully", async () => {
      const mockResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toEqual(mockStudySession);
        expect(result.current.flashcards).toEqual(mockFlashcards);
        expect(result.current.currentFlashcardIndex).toBe(0);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });

      expect(result.current.currentFlashcard).toEqual(mockFlashcards[0]);
    });

    it("should handle API errors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal Server Error", message: "Server error" }),
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });

    it("should handle 401 unauthorized", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      } as Response);

      // Mock window.location.href
      delete (window as { location?: { href?: string } }).location;
      window.location = { href: "" } as Location;

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(window.location.href).toBe("/auth/login");
    });

    it("should handle network errors", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe("revealFlashcard", () => {
    it("should reveal the current flashcard", async () => {
      const mockResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      act(() => {
        result.current.revealFlashcard();
      });

      expect(result.current.isRevealed).toBe(true);
    });
  });

  describe("rateFlashcard", () => {
    it("should rate flashcard and move to next", async () => {
      const startResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      const updateResponse = {
        message: "Sesja została zaktualizowana",
        sessionFlashcard: {
          id: 1,
          study_session_id: 1,
          flashcard_id: 1,
          last_rating: 4,
          review_count: 1,
        },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => startResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updateResponse,
        } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      act(() => {
        result.current.revealFlashcard();
      });

      await act(async () => {
        await result.current.rateFlashcard(4);
      });

      await waitFor(() => {
        expect(result.current.currentFlashcardIndex).toBe(1);
        expect(result.current.isRevealed).toBe(false);
        expect(result.current.isRating).toBe(false);
      });

      expect(result.current.currentFlashcard).toEqual(mockFlashcards[1]);
    });

    it("should handle rating errors", async () => {
      const startResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => startResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: "Internal Server Error" }),
        } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      act(() => {
        result.current.revealFlashcard();
      });

      await act(async () => {
        await result.current.rateFlashcard(4);
      });

      await waitFor(() => {
        expect(result.current.isRating).toBe(false);
      });
    });

    it("should end session when all flashcards are rated", async () => {
      const startResponse = {
        studySession: { ...mockStudySession, flashcards_count: 1 },
        flashcards: [mockFlashcards[0]],
      };

      const updateResponse = {
        message: "Sesja została zaktualizowana",
        sessionFlashcard: {
          id: 1,
          study_session_id: 1,
          flashcard_id: 1,
          last_rating: 5,
          review_count: 1,
        },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => startResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => updateResponse,
        } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      act(() => {
        result.current.revealFlashcard();
      });

      await act(async () => {
        await result.current.rateFlashcard(5);
      });

      await waitFor(() => {
        expect(result.current.hasSessionEnded).toBe(true);
      });
    });
  });

  describe("nextFlashcard", () => {
    it("should move to next flashcard", async () => {
      const mockResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      act(() => {
        result.current.revealFlashcard();
      });

      expect(result.current.isRevealed).toBe(true);

      act(() => {
        result.current.nextFlashcard();
      });

      expect(result.current.currentFlashcardIndex).toBe(1);
      expect(result.current.isRevealed).toBe(false);
      expect(result.current.currentFlashcard).toEqual(mockFlashcards[1]);
    });
  });

  describe("endSession", () => {
    it("should end study session", async () => {
      const startResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      const completeResponse = {
        message: "Sesja zakończona",
        studySession: { ...mockStudySession, completed_at: new Date().toISOString() },
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => startResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => completeResponse,
        } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      await act(async () => {
        await result.current.endSession();
      });

      await waitFor(() => {
        expect(result.current.hasSessionEnded).toBe(true);
      });
    });

    it("should handle end session errors", async () => {
      const startResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => startResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: "Internal Server Error" }),
        } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      await act(async () => {
        await result.current.endSession();
      });

      await waitFor(() => {
        expect(result.current.hasSessionEnded).toBe(true);
      });
    });

    it("should not end session if no session exists", async () => {
      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.endSession();
      });

      expect(result.current.hasSessionEnded).toBe(false);
    });
  });

  describe("resetSession", () => {
    it("should reset session to initial state", async () => {
      const mockResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      act(() => {
        result.current.revealFlashcard();
      });

      act(() => {
        result.current.resetSession();
      });

      expect(result.current.studySession).toBeNull();
      expect(result.current.flashcards).toEqual([]);
      expect(result.current.currentFlashcardIndex).toBe(0);
      expect(result.current.isRevealed).toBe(false);
      expect(result.current.hasSessionEnded).toBe(false);
    });
  });

  describe("currentFlashcard", () => {
    it("should return current flashcard based on index", async () => {
      const mockResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.currentFlashcard).toEqual(mockFlashcards[0]);
      });

      act(() => {
        result.current.nextFlashcard();
      });

      expect(result.current.currentFlashcard).toEqual(mockFlashcards[1]);
    });

    it("should return null when index is out of bounds", async () => {
      const mockResponse = {
        studySession: mockStudySession,
        flashcards: mockFlashcards,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const { result } = renderHook(() => useStudySession());

      await act(async () => {
        await result.current.startSession();
      });

      await waitFor(() => {
        expect(result.current.studySession).toBeTruthy();
      });

      // Move beyond last flashcard
      act(() => {
        result.current.nextFlashcard();
        result.current.nextFlashcard();
      });

      expect(result.current.currentFlashcard).toBeNull();
    });
  });
});
