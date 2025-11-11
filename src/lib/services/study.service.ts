import type { SupabaseClient } from "@/db/supabase.client";
import type {
  FlashcardDTO,
  GetStudyHistoryResponse,
  SessionFlashcardDTO,
  StartStudySessionResponse,
  StudySessionDTO,
  UpdateSessionFlashcardCommand,
} from "@/types";
import {
  getFsrsInstance,
  createInitialCard,
  mapSessionFlashcardToCard,
  mapFsrsResultToUpdatePayload,
  convertUserRatingToFsrs,
} from "@/lib/fsrs/helpers";

const SESSION_FLASHCARD_LIMIT = 20;

interface StudySelection {
  flashcard: FlashcardDTO;
  previousState?: SessionFlashcardDTO;
}

function assertSupabaseError<T>(data: T | null, error: { message: string } | null, message: string): asserts data is T {
  if (error || !data) {
    throw new Error(message || error?.message || "Supabase query failed");
  }
}

function sortByDateAsc(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}

export async function startStudySession(supabase: SupabaseClient, userId: string): Promise<StartStudySessionResponse> {
  const { data: flashcards, error: flashcardsError } = await supabase
    .from("flashcards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  assertSupabaseError(flashcards, flashcardsError, "Nie udało się pobrać fiszek do sesji nauki");

  if (flashcards.length === 0) {
    throw new Error("Brak fiszek przypisanych do użytkownika");
  }

  const { data: sessionStateRows, error: sessionStateError } = await supabase
    .from("session_flashcards")
    .select("*, study_sessions!inner(user_id)")
    .eq("study_sessions.user_id", userId)
    .order("created_at", { ascending: false });

  if (sessionStateError) {
    console.warn(
      "[study] Failed to fetch previous session state",
      JSON.stringify({
        userId,
        message: sessionStateError.message,
        details: sessionStateError.details,
        hint: sessionStateError.hint,
      })
    );
  }

  const safeSessionStateRows = Array.isArray(sessionStateRows) ? sessionStateRows : [];

  const latestStateByFlashcard = new Map<number, SessionFlashcardDTO>();
  safeSessionStateRows.forEach((row) => {
    if (latestStateByFlashcard.has(row.flashcard_id)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { study_sessions, ...rest } = row as unknown as SessionFlashcardDTO & { study_sessions?: unknown };
    latestStateByFlashcard.set(rest.flashcard_id, rest);
  });

  const now = new Date();

  const dueSelections: StudySelection[] = [];
  const newSelections: StudySelection[] = [];
  const upcomingSelections: StudySelection[] = [];

  flashcards.forEach((flashcard) => {
    const previousState = latestStateByFlashcard.get(flashcard.id);
    if (!previousState) {
      newSelections.push({ flashcard });
      return;
    }

    const nextReviewDate = new Date(previousState.next_review_at);
    if (nextReviewDate <= now) {
      dueSelections.push({ flashcard, previousState });
      return;
    }

    upcomingSelections.push({ flashcard, previousState });
  });

  dueSelections.sort((a, b) => {
    const dateA = new Date(a.previousState?.next_review_at ?? now);
    const dateB = new Date(b.previousState?.next_review_at ?? now);
    return sortByDateAsc(dateA, dateB);
  });

  upcomingSelections.sort((a, b) => {
    const dateA = new Date(a.previousState?.next_review_at ?? now);
    const dateB = new Date(b.previousState?.next_review_at ?? now);
    return sortByDateAsc(dateA, dateB);
  });

  const selected: StudySelection[] = [];

  const appendSelections = (source: StudySelection[]) => {
    for (const item of source) {
      if (selected.length >= SESSION_FLASHCARD_LIMIT) {
        break;
      }
      selected.push(item);
    }
  };

  appendSelections(dueSelections);

  if (selected.length < SESSION_FLASHCARD_LIMIT) {
    newSelections.sort((a, b) => sortByDateAsc(new Date(a.flashcard.created_at), new Date(b.flashcard.created_at)));
    appendSelections(newSelections);
  }

  if (selected.length < SESSION_FLASHCARD_LIMIT) {
    appendSelections(upcomingSelections);
  }

  if (selected.length === 0) {
    throw new Error("Brak fiszek do powtórki. Dodaj nowe fiszki lub poczekaj na termin kolejnej powtórki.");
  }

  const nowIso = now.toISOString();
  const { data: studySession, error: sessionError } = await supabase
    .from("study_sessions")
    .insert({
      user_id: userId,
      flashcards_count: selected.length,
      started_at: nowIso,
    })
    .select("*")
    .single();

  assertSupabaseError(studySession, sessionError, "Nie udało się utworzyć sesji nauki");
  const sessionFlashcardsPayload = selected.map(({ flashcard, previousState }) => {
    const baseCard = previousState ? mapSessionFlashcardToCard(previousState) : createInitialCard(now);

    return {
      study_session_id: studySession.id,
      flashcard_id: flashcard.id,
      next_review_at: baseCard.due.toISOString(),
      last_rating: null,
      review_count: baseCard.reps,
      stability: baseCard.stability,
      difficulty: baseCard.difficulty,
      lapses: baseCard.lapses,
      state: baseCard.state,
      last_review: baseCard.last_review ? baseCard.last_review.toISOString() : null,
      elapsed_days: baseCard.elapsed_days,
      scheduled_days: baseCard.scheduled_days,
      created_at: nowIso,
      updated_at: nowIso,
    };
  });

  const { error: insertError } = await supabase.from("session_flashcards").insert(sessionFlashcardsPayload);

  if (insertError) {
    throw new Error(`Nie udało się zainicjalizować fiszek sesji: ${insertError.message}`);
  }

  return {
    studySession,
    flashcards: selected.map((item) => item.flashcard),
  };
}

export async function updateSessionFlashcard(
  supabase: SupabaseClient,
  userId: string,
  command: UpdateSessionFlashcardCommand
): Promise<SessionFlashcardDTO> {
  if (command.lastRating < 1 || command.lastRating > 5) {
    throw new Error("Ocena musi być w zakresie 1-5");
  }

  const { data: studySession, error: sessionError } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("id", command.studySessionId)
    .eq("user_id", userId)
    .single();

  if (sessionError || !studySession) {
    throw new Error("Sesja nauki nie istnieje lub nie należy do użytkownika");
  }

  const { data: sessionFlashcard, error: flashcardError } = await supabase
    .from("session_flashcards")
    .select("*")
    .eq("study_session_id", command.studySessionId)
    .eq("flashcard_id", command.flashcardId)
    .single();

  if (flashcardError || !sessionFlashcard) {
    throw new Error("Fiszka nie została znaleziona w tej sesji");
  }

  const fsrs = getFsrsInstance();
  const now = new Date();
  const fsrsRating = convertUserRatingToFsrs(command.lastRating);
  const currentCard = mapSessionFlashcardToCard(sessionFlashcard);
  // @ts-expect-error - ts-fsrs uses Rating enum which is compatible with the method signature
  const recordLog = fsrs.next(currentCard, now, fsrsRating);
  const updatePayload = mapFsrsResultToUpdatePayload(recordLog);

  const { data: updated, error: updateError } = await supabase
    .from("session_flashcards")
    .update({
      ...updatePayload,
      last_rating: command.lastRating,
      updated_at: now.toISOString(),
    })
    .eq("id", sessionFlashcard.id)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(`Nie udało się zaktualizować fiszki: ${updateError?.message ?? "Nieznany błąd"}`);
  }

  const { data: ratingsData, error: ratingsError } = await supabase
    .from("session_flashcards")
    .select("last_rating")
    .eq("study_session_id", command.studySessionId)
    .not("last_rating", "is", null);

  if (ratingsError) {
    throw new Error(`Nie udało się obliczyć średniej oceny: ${ratingsError.message}`);
  }

  let averageRating: number | null = null;
  if (ratingsData && ratingsData.length > 0) {
    const values = ratingsData.map((entry) => entry.last_rating ?? 0);
    const count = values.length;
    if (count > 0) {
      averageRating = Number((values.reduce((sum, rating) => sum + rating, 0) / count).toFixed(2));
    }
  }

  const allRated = studySession.flashcards_count > 0 && ratingsData?.length === studySession.flashcards_count;

  // Ensure started_at is set before setting completed_at (required by DB constraint)
  const updateData: {
    average_rating: number | null;
    completed_at?: string | null;
    started_at?: string;
    updated_at: string;
  } = {
    average_rating: averageRating,
    updated_at: now.toISOString(),
  };

  if (allRated) {
    updateData.completed_at = now.toISOString();
  } else {
    updateData.completed_at = studySession.completed_at;
  }

  // Set started_at if not already set (shouldn't happen, but safety check)
  if (!studySession.started_at) {
    updateData.started_at = now.toISOString();
  }

  const { error: sessionUpdateError } = await supabase
    .from("study_sessions")
    .update(updateData)
    .eq("id", command.studySessionId);

  if (sessionUpdateError) {
    throw new Error(`Nie udało się zaktualizować sesji: ${sessionUpdateError.message}`);
  }

  return updated as SessionFlashcardDTO;
}

interface GetHistoryParams {
  page?: number;
  limit?: number;
  sortBy?: "started_at" | "completed_at";
  sortOrder?: "asc" | "desc";
}

export async function getStudyHistory(
  supabase: SupabaseClient,
  userId: string,
  params: GetHistoryParams = {}
): Promise<GetStudyHistoryResponse> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? Math.min(params.limit, 100) : 20;
  const sortBy = params.sortBy ?? "started_at";
  const sortOrder = params.sortOrder ?? "desc";
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("study_sessions")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1);

  if (error) {
    console.warn(
      "[study] Failed to fetch study history",
      JSON.stringify({
        userId,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
    );
  }

  return {
    studySessions: (data ?? []) as StudySessionDTO[],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: count ? Math.ceil(count / limit) : 0,
    },
  };
}

export async function completeStudySession(
  supabase: SupabaseClient,
  userId: string,
  studySessionId: number,
  completedAt?: string
): Promise<StudySessionDTO> {
  const timestamp = completedAt ?? new Date().toISOString();

  // First check if session exists and belongs to user
  const { data: existingSession, error: fetchError } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("id", studySessionId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existingSession) {
    throw new Error("Sesja nauki nie istnieje lub nie należy do użytkownika");
  }

  // If already completed, return existing session
  if (existingSession.completed_at) {
    return existingSession as StudySessionDTO;
  }

  const { data, error } = await supabase
    .from("study_sessions")
    .update({
      completed_at: timestamp,
      updated_at: timestamp,
    })
    .eq("id", studySessionId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error("Nie udało się zakończyć sesji nauki");
  }

  return data as StudySessionDTO;
}
