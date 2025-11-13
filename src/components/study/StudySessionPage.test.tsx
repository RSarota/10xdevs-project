import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudySessionPage from "./StudySessionPage";
import type { FlashcardDTO, StudySessionDTO } from "@/types";

// Mock the useStudySession hook
vi.mock("@/hooks/useStudySession", () => ({
  useStudySession: vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { useStudySession } from "@/hooks/useStudySession";

const mockFlashcards: FlashcardDTO[] = [
  {
    id: 1,
    user_id: "user-123",
    front: "Question 1",
    back: "Answer 1",
    type: "manual",
    generation_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    user_id: "user-123",
    front: "Question 2",
    back: "Answer 2",
    type: "manual",
    generation_id: null,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

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

describe("StudySessionPage", () => {
  const mockStartSession = vi.fn();
  const mockRevealFlashcard = vi.fn();
  const mockRateFlashcard = vi.fn();
  const mockEndSession = vi.fn();
  const mockNextFlashcard = vi.fn();
  const mockResetSession = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useStudySession).mockReturnValue({
      studySession: null,
      flashcards: [],
      currentFlashcard: null,
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });
  });

  it("should call startSession on mount", () => {
    render(<StudySessionPage />);

    expect(mockStartSession).toHaveBeenCalledTimes(1);
  });

  it("should display loading state when loading", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: null,
      flashcards: [],
      currentFlashcard: null,
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: true,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByTestId("study-session-loading")).toBeInTheDocument();
  });

  it("should display error state when error occurs", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: null,
      flashcards: [],
      currentFlashcard: null,
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: "Failed to load session",
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByTestId("study-session-error")).toBeInTheDocument();
    expect(screen.getByText("Nie udało się załadować sesji")).toBeInTheDocument();
    expect(screen.getByText("Failed to load session")).toBeInTheDocument();
  });

  it("should allow retry when error occurs", async () => {
    const user = userEvent.setup();
    vi.mocked(useStudySession).mockReturnValue({
      studySession: null,
      flashcards: [],
      currentFlashcard: null,
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: "Failed to load session",
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    const retryButton = screen.getByRole("button", { name: /spróbuj ponownie/i });
    await user.click(retryButton);

    expect(mockStartSession).toHaveBeenCalledTimes(2); // Once on mount, once on retry
  });

  it("should display empty state when no flashcards", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: null,
      flashcards: [],
      currentFlashcard: null,
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    // EmptyState might not pass through data-testid, so check by text instead
    expect(screen.getByText("Brak fiszek do powtórek")).toBeInTheDocument();
    expect(screen.getByText("Dodaj nowe fiszki lub poczekaj na termin kolejnej sesji.")).toBeInTheDocument();
  });

  it("should display study session when active", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: mockStudySession,
      flashcards: mockFlashcards,
      currentFlashcard: mockFlashcards[0],
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByTestId("flashcard-view")).toBeInTheDocument();
    expect(screen.getByText("Question 1")).toBeInTheDocument();
  });

  it("should display rating controls when flashcard is revealed", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: mockStudySession,
      flashcards: mockFlashcards,
      currentFlashcard: mockFlashcards[0],
      currentFlashcardIndex: 0,
      isRevealed: true,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByTestId("rating-controls")).toBeInTheDocument();
  });

  it("should display hint when flashcard is not revealed", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: mockStudySession,
      flashcards: mockFlashcards,
      currentFlashcard: mockFlashcards[0],
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByText(/Odsłoń odpowiedź, aby ocenić stopień zapamiętania/i)).toBeInTheDocument();
  });

  it("should disable rating controls when rating", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: mockStudySession,
      flashcards: mockFlashcards,
      currentFlashcard: mockFlashcards[0],
      currentFlashcardIndex: 0,
      isRevealed: true,
      isLoading: false,
      isRating: true,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    const ratingButtons = screen.getAllByRole("button");
    const ratingButton = ratingButtons.find((btn) => btn.textContent?.includes("1 -"));
    expect(ratingButton).toBeDisabled();
  });

  it("should display session completion when session ended", () => {
    const completedSession: StudySessionDTO = {
      ...mockStudySession,
      completed_at: "2024-01-10T01:00:00Z",
    };

    vi.mocked(useStudySession).mockReturnValue({
      studySession: completedSession,
      flashcards: mockFlashcards,
      currentFlashcard: null,
      currentFlashcardIndex: 2,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: true,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByText(/Sesja została zakończona/i)).toBeInTheDocument();
    expect(screen.getByText(/Świetna robota!/i)).toBeInTheDocument();
  });

  it("should allow restarting session after completion", async () => {
    const user = userEvent.setup();
    const completedSession: StudySessionDTO = {
      ...mockStudySession,
      completed_at: "2024-01-10T01:00:00Z",
    };

    vi.mocked(useStudySession).mockReturnValue({
      studySession: completedSession,
      flashcards: mockFlashcards,
      currentFlashcard: null,
      currentFlashcardIndex: 2,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: true,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    const restartButton = screen.getByRole("button", { name: /rozpocznij ponownie/i });
    await user.click(restartButton);

    expect(mockStartSession).toHaveBeenCalled();
  });

  it("should display average rating in header when available", () => {
    const sessionWithRating: StudySessionDTO = {
      ...mockStudySession,
      average_rating: 4.5,
    };

    vi.mocked(useStudySession).mockReturnValue({
      studySession: sessionWithRating,
      flashcards: mockFlashcards,
      currentFlashcard: mockFlashcards[0],
      currentFlashcardIndex: 0,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByText(/Średnia 4.5/i)).toBeInTheDocument();
  });

  it("should display progress correctly", () => {
    vi.mocked(useStudySession).mockReturnValue({
      studySession: mockStudySession,
      flashcards: mockFlashcards,
      currentFlashcard: mockFlashcards[1],
      currentFlashcardIndex: 1,
      isRevealed: false,
      isLoading: false,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      startSession: mockStartSession,
      revealFlashcard: mockRevealFlashcard,
      rateFlashcard: mockRateFlashcard,
      endSession: mockEndSession,
      nextFlashcard: mockNextFlashcard,
      resetSession: mockResetSession,
    });

    render(<StudySessionPage />);

    expect(screen.getByTestId("study-session-progress")).toBeInTheDocument();
  });
});
