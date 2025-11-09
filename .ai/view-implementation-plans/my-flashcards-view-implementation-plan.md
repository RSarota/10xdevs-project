# Plan implementacji widoku Moje fiszki (/my-flashcards)

## 1. Przegląd

Widok prezentuje listę wszystkich fiszek użytkownika, umożliwia filtrowanie, sortowanie, paginację lub infinite scroll oraz wykonywanie operacji CRUD: edycji, usuwania i akceptacji zasugerowanych fiszek AI.

## 2. Routing widoku

Ścieżka: `/my-flashcards` (definiowana w `src/pages/my-flashcards.astro`).

## 3. Struktura komponentów

- `MyFlashcardsPage`
  - `FilterSortControls`
  - `FlashcardsList`
    - `FlashcardItem`
  - `PaginationControls` / `InfiniteScroll`
  - `ConfirmationModal`
  - `ToastNotification`

## 4. Szczegóły komponentów

### MyFlashcardsPage

- Opis: Kontener widoku, ładuje listę fiszek według parametrów filtrowania/paginacji, zarządza stanem i wywołuje akcje CRUD.
- Główne elementy: `FilterSortControls`, `FlashcardsList`, kontrolki paginacji lub infinite scroll.
- Zdarzenia: `onFilterChange`, `onSortChange`, `onPageChange`, `onDelete(id)`, `onEdit(id, data)`.
- Walidacja: brak w samym widoku, delegacja do komponentów dzieci.
- Typy:
  - `FlashcardDTO` (z `src/types.ts`)
  - `BulkDeleteFlashcardsCommand`, `UpdateFlashcardCommand`
- Propsy: brak (root page).

### FilterSortControls

- Opis: Formularz wyboru filtra (typ, generation_id) i sortowania (pole, kierunek).
- Główne elementy: `<select>` dla typu (`manual`, `ai-full`, `ai-edited`, `all`), `<select>` sort_by i sort_order.
- Zdarzenia: `onChange(filters)`.
- Walidacja: brak.
- Typy: `FilterSortProps { filters: FlashcardsFilters; onChange: (f: FlashcardsFilters) => void }`.
- Propsy: `filters: FlashcardsFilters`, `onChange`.

### FlashcardsList

- Opis: Lista renderująca elementy `FlashcardItem`.
- Główne elementy: `<ul>` / `<div>` kontener, mapowanie `items.map`.
- Zdarzenia: przekazanie callbacków `onEdit`, `onDelete` do `FlashcardItem`.
- Walidacja: brak.
- Typy: `FlashcardsListProps { items: FlashcardDTO[]; onEdit: (id: number) => void; onDelete: (id: number) => void }`.

### FlashcardItem

- Opis: Pojedyncza karta fiszki z frontem i tyłem oraz przyciskami edycji i usunięcia.
- Główne elementy: tekst front/back, przyciski `Edit`, `Delete`.
- Zdarzenia: `onEdit()`, `onDelete()`.
- Walidacja: brak.
- Typy: `FlashcardItemProps { flashcard: FlashcardDTO; onEdit: (id: number) => void; onDelete: (id: number) => void }`.
- Propsy: `flashcard`, `onEdit`, `onDelete`.

### PaginationControls / InfiniteScroll

- Opis: Kontrolka wyboru strony lub automatyczne ładowanie kolejnych fiszek.
- Główne elementy: przyciski `Poprzednia`, `Następna` lub trigger scroll.
- Zdarzenia: `onPageChange(page: number)`.
- Walidacja: brak.
- Typy: `PaginationProps { page: number; totalPages: number; onChange: (p: number) => void }`.
- Propsy: `page`, `totalPages`, `onChange`.

### ConfirmationModal

- Opis: Modal potwierdzający usunięcie fiszki.
- Główne elementy: tekst potwierdzenia, przyciski `Tak`, `Nie`.
- Zdarzenia: `onConfirm()`, `onCancel()`.
- Walidacja: brak.
- Typy: `ConfirmationModalProps { isOpen: boolean; onConfirm: () => void; onCancel: () => void; message: string }`.
- Propsy: `isOpen`, `message`, `onConfirm`, `onCancel`.

### ToastNotification

- Opis: Komponent do wyświetlania toastów o sukcesie/błędzie.
- Główne elementy: komunikat, typ (`success`/`error`).
- Zdarzenia: automatyczne zamknięcie.
- Walidacja: brak.
- Typy: `ToastProps { message: string; type: 'success' | 'error' }`.
- Propsy: `message`, `type`.

## 5. Typy

### Nowe typy:

```typescript
interface FlashcardsFilters {
  type?: FlashcardType;
  generation_id?: number;
  page: number;
  limit: number;
  sort_by: "created_at" | "updated_at";
  sort_order: "asc" | "desc";
}
```

### Istniejące typy z `src/types.ts`:

- `FlashcardDTO`
- `CreateFlashcardCommand`
- `BulkDeleteFlashcardsCommand`
- `UpdateFlashcardCommand`

## 6. Zarządzanie stanem

### Custom hook: `useFlashcards()`

Zwraca:

```typescript
{
  items: FlashcardDTO[];
  loading: boolean;
  error: Error | null;
  filters: FlashcardsFilters;
  totalPages: number;
  setFilters: (f: FlashcardsFilters) => void;
  deleteFlashcard: (id: number) => Promise<void>;
  updateFlashcard: (id: number, data: UpdateFlashcardCommand) => Promise<void>;
  fetchPage: (page: number) => Promise<void>;
}
```

## 7. Integracja API

- GET `/api/flashcards?type=&generation_id=&page=&limit=&sort_by=&sort_order=`
- DELETE `/api/flashcards/{id}`
- PATCH `/api/flashcards/{id}` z `UpdateFlashcardCommand`
- POST `/api/flashcards/bulk-delete` z `BulkDeleteFlashcardsCommand`

## 8. Interakcje użytkownika

1. Użytkownik wybiera filtr lub sortowanie → lista odświeża się.
2. Kliknięcie ikony edycji przy fiszce → otwarcie formularza edycji (np. inline lub modal).
3. Zapisanie zmian → wywołanie PATCH; odświeżenie listy i toast.
4. Kliknięcie ikony usunięcia → otwarcie `ConfirmationModal`.
5. Potwierdzenie usunięcia → wywołanie DELETE; odświeżenie listy i toast.
6. Przewinięcie do końca listy (infinite scroll) lub zmiana strony → ładowanie kolejnych fiszek.

## 9. Warunki i walidacja

- Autoryzacja JWT – redirect do `/login` jeśli brak tokenu.
- `filters.page >=1`, `limit <=100`.
- W edycji: `front.trim().length >0 && ≤200`, `back.trim().length >0 && ≤500`.

## 10. Obsługa błędów

- 401 → redirect do `/login`, toast.
- 400 → inline validation errors.
- 404 (brak fiszki) → toast error.
- 500/Network → toast error + możliwość retry.

## 11. Kroki implementacji

1. Utworzyć `src/pages/my-flashcards.astro` i folder komponentów `src/components/my-flashcards`.
2. Zaimplementować `useFlashcards()` w `src/hooks/useFlashcards.ts`.
3. Stworzyć komponent `FilterSortControls`.
4. Stworzyć `FlashcardsList` i `FlashcardItem`.
5. Stworzyć `PaginationControls` lub zaimplementować infinite scroll.
6. Dodać `ConfirmationModal` i `ToastNotification`.
7. Obsłużyć integrację z API w hooku i komponentach.
8. Dodać style Tailwind i Shadcn/ui.
9. Przetestować scenariusze poprawne i błędy.
