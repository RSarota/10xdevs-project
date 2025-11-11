# Plan implementacji widoku Sesja nauki (Study Session)

## 1. Przegląd

Widok umożliwia zalogowanemu użytkownikowi rozpoczęcie sesji nauki z fiszkami, przeglądanie fiszek zgodnie z algorytmem spaced repetition, ocenianie przyswojenia oraz śledzenie postępów. Zapewnia interaktywny interfejs do nauki metodą powtórek.

## 2. Routing widoku

Ścieżka: `/study` (definiowana w pliku routingu Astro: `src/pages/study.astro`).

## 3. Struktura komponentów

- `StudySessionPage`
  - `StudySessionHeader`
  - `FlashcardView`
  - `RatingControls`
  - `StudySessionProgress`
  - `ToastNotification`

## 4. Szczegóły komponentów

### StudySessionPage

- **Opis:** Kontener widoku, zarządza stanem sesji nauki, pobiera dane z API i koordynuje interakcje między komponentami.
- **Główne elementy:** Nagłówek sesji, komponent `FlashcardView`, `RatingControls`, `StudySessionProgress`, `ToastNotification`.
- **Zdarzenia:**
  - Inicjalizacja widoku – rozpoczęcie nowej sesji przez wywołanie API
  - Zakończenie sesji – aktualizacja `completed_at` w sesji
  - Nawigacja między fiszkami – przejście do kolejnej fiszki po ocenie
- **Walidacja:** Delegowana do komponentów podrzędnych.
- **Typy:**
  - `StudySessionDTO` (z `src/types.ts`)
  - `FlashcardDTO` (z `src/types.ts`)
  - `StartStudySessionResponse` (z `src/types.ts`)
- **Propsy:** Brak (root page).

### StudySessionHeader

- **Opis:** Nagłówek sesji wyświetlający informacje o sesji (liczba fiszek, postęp).
- **Główne elementy:** Tekst z liczbą fiszek, pasek postępu, przycisk zakończenia sesji.
- **Zdarzenia:**
  - `onEndSession()` – zakończenie sesji przedwcześnie
- **Walidacja:** Brak.
- **Typy:**
  - `StudySessionHeaderProps { flashcardsCount: number; currentIndex: number; onEndSession: () => void }`
- **Propsy:** `flashcardsCount`, `currentIndex`, `onEndSession`.

### FlashcardView

- **Opis:** Komponent prezentujący pojedynczą fiszkę z możliwością odsłonięcia odpowiedzi.
- **Główne elementy:** Tekst frontu fiszki, przycisk "Pokaż odpowiedź", tekst backu fiszki (po odsłonięciu).
- **Zdarzenia:**
  - `onReveal()` – odsłonięcie tyłu fiszki
  - `onNext()` – przejście do kolejnej fiszki (po ocenie)
- **Walidacja:** Brak.
- **Typy:**
  - `FlashcardViewProps { flashcard: FlashcardDTO; isRevealed: boolean; onReveal: () => void }`
- **Propsy:** `flashcard`, `isRevealed`, `onReveal`.

### RatingControls

- **Opis:** Komponent z kontrolkami do oceny przyswojenia fiszki (skala 1-5).
- **Główne elementy:** Przyciski lub slider z ocenami 1-5, etykiety opisowe (np. "Bardzo trudne", "Łatwe").
- **Zdarzenia:**
  - `onRatingSelect(rating: number)` – wybór oceny przez użytkownika
- **Walidacja:**
  - `rating`: integer 1-5
- **Typy:**
  - `RatingControlsProps { onRatingSelect: (rating: number) => void; disabled?: boolean }`
- **Propsy:** `onRatingSelect`, `disabled`.

### StudySessionProgress

- **Opis:** Komponent wyświetlający postęp sesji (np. "3/10 fiszek").
- **Główne elementy:** Tekst z liczbą przejrzanych fiszek, wizualny wskaźnik postępu.
- **Zdarzenia:** Brak.
- **Walidacja:** Brak.
- **Typy:**
  - `StudySessionProgressProps { current: number; total: number }`
- **Propsy:** `current`, `total`.

### ToastNotification

- **Opis:** Komponent do wyświetlania komunikatów o sukcesie lub błędach.
- **Główne elementy:** Toast z Shadcn/ui.
- **Zdarzenia:** Automatyczne zamknięcie po określonym czasie.
- **Walidacja:** Brak.
- **Typy:**
  - `ToastProps { message: string; type: 'success' | 'error' }`
- **Propsy:** `message`, `type`.

## 5. Typy

```typescript
interface StudySessionState {
  studySession: StudySessionDTO | null;
  flashcards: FlashcardDTO[];
  currentFlashcardIndex: number;
  isRevealed: boolean;
  isLoading: boolean;
  error: string | null;
}

interface StudySessionPageProps {
  // Brak - root page
}
```

Istniejące typy:

- `StudySessionDTO` – `{ id: number; user_id: string; started_at: string; completed_at: string | null; flashcards_count: number; average_rating: number | null; ... }`
- `FlashcardDTO` – `{ id: number; user_id: string; front: string; back: string; ... }`
- `StartStudySessionResponse` – `{ studySession: StudySessionDTO; flashcards: FlashcardDTO[] }`
- `UpdateSessionFlashcardCommand` – `{ studySessionId: number; flashcardId: number; lastRating: number }`

## 6. Zarządzanie stanem

### Custom hook: `useStudySession()`

Zwraca:

```typescript
{
  studySession: StudySessionDTO | null;
  flashcards: FlashcardDTO[];
  currentFlashcardIndex: number;
  isRevealed: boolean;
  isLoading: boolean;
  error: string | null;
  startSession: () => Promise<void>;
  revealFlashcard: () => void;
  rateFlashcard: (rating: number) => Promise<void>;
  endSession: () => Promise<void>;
  nextFlashcard: () => void;
}
```

Logika:

- Utrzymuje stan sesji, fiszek, aktualnego indeksu i widoczności odpowiedzi
- `startSession()` – wywołuje POST `/api/study/start`, aktualizuje stan
- `revealFlashcard()` – ustawia `isRevealed = true`
- `rateFlashcard(rating)` – wywołuje PUT `/api/study/update`, przechodzi do kolejnej fiszki
- `endSession()` – aktualizuje sesję (ustawia `completed_at`), nawiguje do historii
- `nextFlashcard()` – zwiększa `currentFlashcardIndex`, resetuje `isRevealed`

## 7. Integracja API

### 7.1. POST /api/study/start

- **Endpoint:** POST `/api/study/start`
- **Request Body:** `{ userId?: string }` (opcjonalnie w developmencie)
- **Response:** `StartStudySessionResponse`
- **Headers:** `Authorization: Bearer {token}`

### 7.2. PUT /api/study/update

- **Endpoint:** PUT `/api/study/update`
- **Request Body:** `UpdateSessionFlashcardCommand`
- **Response:** `{ message: string; sessionFlashcard: SessionFlashcardDTO }`
- **Headers:** `Authorization: Bearer {token}`

### 7.3. PUT /api/study/complete (opcjonalnie)

- **Endpoint:** PUT `/api/study/complete` (lub użycie istniejącego endpointu aktualizacji)
- **Request Body:** `{ studySessionId: number; completedAt: string }`
- **Response:** `{ message: string }`
- **Headers:** `Authorization: Bearer {token}`

## 8. Interakcje użytkownika

1. Użytkownik wchodzi na `/study` → automatyczne rozpoczęcie sesji (wywołanie `startSession()`)
2. Wyświetlenie pierwszej fiszki (tylko front) → użytkownik widzi `FlashcardView` z przyciskiem "Pokaż odpowiedź"
3. Kliknięcie "Pokaż odpowiedź" → odsłonięcie tyłu fiszki, wyświetlenie `RatingControls`
4. Wybór oceny (1-5) → wywołanie `rateFlashcard(rating)` → aktualizacja przez API → przejście do kolejnej fiszki
5. Powtórzenie kroków 2-4 dla kolejnych fiszek
6. Po przejściu wszystkich fiszek → automatyczne zakończenie sesji → nawigacja do `/study/history`
7. Opcjonalnie: użytkownik może zakończyć sesję przedwcześnie przez przycisk w `StudySessionHeader`

## 9. Warunki i walidacja

- **Autoryzacja JWT:** Przekierowanie do `/login` jeśli brak tokena
- **Walidacja oceny:** `rating` musi być integer 1-5
- **Walidacja sesji:** Weryfikacja, że sesja należy do użytkownika (po stronie backendu)

## 10. Obsługa błędów

- **400 Bad Request:** Wyświetlenie toast z komunikatem błędu walidacji
- **401 Unauthorized:** Redirect do `/login`, toast z komunikatem
- **404 Not Found:** Toast z komunikatem "Sesja nie została znaleziona"
- **500 Server Error / network:** Toast błędu z możliwością retry

## 11. Kroki implementacji

1. Utworzyć plik `src/pages/study.astro`
2. Zaimplementować `StudySessionPage` w `src/components/study/StudySessionPage.tsx`
3. Stworzyć komponenty:
   - `StudySessionHeader` w `src/components/study/StudySessionHeader.tsx`
   - `FlashcardView` w `src/components/study/FlashcardView.tsx`
   - `RatingControls` w `src/components/study/RatingControls.tsx`
   - `StudySessionProgress` w `src/components/study/StudySessionProgress.tsx`
4. Zaimplementować hook `useStudySession` w `src/hooks/useStudySession.ts`
5. Dodać `ToastNotification` (użyć istniejącego komponentu lub Shadcn/ui)
6. Dodać logikę routingu po zakończeniu sesji (nawigacja do `/study/history`)
7. Dodać style Tailwind i Shadcn/ui
8. Przetestować scenariusze:
   - Rozpoczęcie sesji
   - Przeglądanie fiszek
   - Ocenianie fiszek
   - Zakończenie sesji
   - Obsługa błędów API

## 12. Dodatkowe uwagi

- **Animacje:** Rozważyć dodanie płynnych przejść między fiszkami (fade in/out)
- **Dostępność:** Zapewnić odpowiednie etykiety ARIA dla kontrolek oceny
- **Responsywność:** Zapewnić responsywny design dla urządzeń mobilnych
- **Optymistyczne aktualizacje:** Rozważyć optymistyczne aktualizacje UI przed potwierdzeniem z API (dla lepszego UX)
