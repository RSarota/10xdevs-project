import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import type { FlashcardDTO, StudySessionDTO } from "@/types";

interface UseStudySessionState {
  studySession: StudySessionDTO | null;
  flashcards: FlashcardDTO[];
  currentFlashcardIndex: number;
  isRevealed: boolean;
  isLoading: boolean;
  isRating: boolean;
  error: string | null;
  hasSessionEnded: boolean;
}

interface UseStudySessionReturn extends UseStudySessionState {
  currentFlashcard: FlashcardDTO | null;
  startSession: () => Promise<void>;
  revealFlashcard: () => void;
  rateFlashcard: (rating: number) => Promise<void>;
  endSession: () => Promise<void>;
  nextFlashcard: () => void;
  resetSession: () => void;
}

const INITIAL_STATE: UseStudySessionState = {
  studySession: null,
  flashcards: [],
  currentFlashcardIndex: 0,
  isRevealed: false,
  isLoading: false,
  isRating: false,
  error: null,
  hasSessionEnded: false,
};

export function useStudySession(): UseStudySessionReturn {
  const [state, setState] = useState<UseStudySessionState>(INITIAL_STATE);

  const currentFlashcard = useMemo(() => {
    return state.flashcards[state.currentFlashcardIndex] ?? null;
  }, [state.flashcards, state.currentFlashcardIndex]);

  const startSession = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      isRating: false,
      error: null,
      hasSessionEnded: false,
      currentFlashcardIndex: 0,
      isRevealed: false,
    }));

    try {
      const response = await fetch("/api/study/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Brak autoryzacji. Przekierowywanie do logowania...",
          }));
          window.location.href = "/auth/login";
          return;
        }

        if (response.status === 404) {
          const payload = await response.json().catch(() => null);
          const message = payload?.message ?? "Brak fiszek do powtórek.";
          toast.info(message);
          setState((prev) => ({
            ...prev,
            studySession: null,
            flashcards: [],
            isLoading: false,
            isRating: false,
            error: message,
            hasSessionEnded: true,
          }));
          return;
        }

        throw new Error("Nie udało się rozpocząć sesji nauki");
      }

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        studySession: data.studySession as StudySessionDTO,
        flashcards: data.flashcards as FlashcardDTO[],
        currentFlashcardIndex: 0,
        isRevealed: false,
        isLoading: false,
        hasSessionEnded: false,
        isRating: false,
      }));

      // optionally notify user about session readiness if needed in the future
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wystąpił błąd podczas rozpoczynania sesji";
      toast.error(message);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isRating: false,
        error: message,
      }));
    }
  }, []);

  const revealFlashcard = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRevealed: true,
    }));
  }, []);

  const nextFlashcard = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentFlashcardIndex + 1;
      const hasEnded = nextIndex >= prev.flashcards.length;

      return {
        ...prev,
        currentFlashcardIndex: nextIndex,
        isRevealed: false,
        hasSessionEnded: hasEnded,
      };
    });
  }, []);

  const rateFlashcard = useCallback(
    async (rating: number) => {
      if (!state.studySession || !currentFlashcard) {
        toast.error("Brak aktywnej sesji nauki");
        return;
      }

      if (state.hasSessionEnded) {
        return;
      }

      if (rating < 1 || rating > 5) {
        toast.error("Ocena musi być w zakresie od 1 do 5");
        return;
      }

      setState((prev) => ({
        ...prev,
        isRating: true,
      }));

      try {
        const response = await fetch("/api/study/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studySessionId: state.studySession.id,
            flashcardId: currentFlashcard.id,
            lastRating: rating,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/auth/login";
            return;
          }

          const payload = await response.json().catch(() => null);
          const message = payload?.message ?? "Nie udało się zapisać oceny";
          throw new Error(message);
        }

        setState((prev) => {
          const isLastCard = prev.currentFlashcardIndex >= prev.flashcards.length - 1;
          return {
            ...prev,
            isRating: false,
            isRevealed: false,
            hasSessionEnded: isLastCard,
            currentFlashcardIndex: isLastCard ? prev.flashcards.length : prev.currentFlashcardIndex,
          };
        });

        if (state.currentFlashcardIndex < state.flashcards.length - 1) {
          nextFlashcard();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Nie udało się zapisać oceny";
        toast.error(message);
        setState((prev) => ({
          ...prev,
          isRating: false,
          error: message,
        }));
      }
    },
    [
      currentFlashcard,
      nextFlashcard,
      state.currentFlashcardIndex,
      state.flashcards.length,
      state.studySession,
      state.hasSessionEnded,
    ]
  );

  const endSession = useCallback(async () => {
    if (!state.studySession) {
      return;
    }

    try {
      const response = await fetch("/api/study/complete", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studySessionId: state.studySession.id,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        const payload = await response.json().catch(() => null);
        const message = payload?.message ?? "Nie udało się zakończyć sesji";
        throw new Error(message);
      }

      // optional toast removed to reduce noise; summary UI handles feedback
    } catch (error) {
      const message = error instanceof Error ? error.message : "Nie udało się zakończyć sesji";
      toast.error(message);
    } finally {
      setState((prev) => ({
        ...prev,
        hasSessionEnded: true,
      }));
    }
  }, [state.studySession]);

  const resetSession = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    ...state,
    currentFlashcard,
    startSession,
    revealFlashcard,
    rateFlashcard,
    endSession,
    nextFlashcard,
    resetSession,
  };
}
