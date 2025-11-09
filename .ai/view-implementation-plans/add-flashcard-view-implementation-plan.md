# Plan implementacji widoku Ręczne dodawanie fiszki (AddFlashcard)

## 1. Przegląd

Widok umożliwia zalogowanemu użytkownikowi ręczne tworzenie nowych fiszek poprzez wypełnienie pól „Przód” i „Tył”. Zapewnia walidację długości tekstu oraz dodaje fiszkę do bazy.

## 2. Routing widoku

Ścieżka: `/add-flashcard` (definiowana w pliku routingu Astro: `src/pages/add-flashcard.astro`).

## 3. Struktura komponentów

- `AddFlashcardPage`
  - `AddFlashcardForm`
  - `ToastNotification`

## 4. Szczegóły komponentów

### AddFlashcardPage

- Opis: Kontener widoku, zarządza stanem formularza i wywołuje hook do wysłania danych do API.
- Główne elementy: nagłówek, komponent `AddFlashcardForm`, `ToastNotification`.
- Zdarzenia:
  - Inicjalizacja widoku – reset formularza
- Walidacja: delegowana do `AddFlashcardForm`.
- Typy:
  - `CreateFlashcardCommand` (z `src/types.ts`)
- Propsy: brak (root page).

### AddFlashcardForm

- Opis: Formularz z dwoma polami: „Przód” i „Tył” oraz przyciskiem zapisu.
- Główne elementy: `<input>` dla frontu, `<textarea>` dla tyłu, `<button>` „Zapisz”.
- Zdarzenia:
  - `onChange(field, value)` – aktualizacja stanu formularza
  - `onSubmit()` – walidacja i wywołanie akcji stworzenia fiszki
- Walidacja inline:
  - `front.trim().length > 0 && <= 200`
  - `back.trim().length > 0 && <= 500`
- Typy:
  - `AddFlashcardFormData { front: string; back: string }`
  - `AddFlashcardFormProps { onSubmit: (data: AddFlashcardFormData) => void }`
- Propsy: `onSubmit`.

### ToastNotification

- Opis: Komponent do wyświetlania komunikatów o sukcesie lub błędach.
- Główne elementy: toast z Shadcn/ui.
- Zdarzenia: automatyczne zamknięcie po określonym czasie.
- Walidacja: brak.
- Typy:
  - `ToastProps { message: string; type: 'success' | 'error' }`
- Propsy: `message`, `type`.

## 5. Typy

```typescript
interface AddFlashcardFormData {
  front: string;
  back: string;
}

interface AddFlashcardFormProps {
  onSubmit: (data: AddFlashcardFormData) => void;
}
```

Istniejące typy:

- `CreateFlashcardCommand` – `{ front: string; back: string; source: 'manual'; generation_id?: null }`.

## 6. Zarządzanie stanem

### Custom hook: `useAddFlashcard()`

Zwraca:

```typescript
{
  formData: AddFlashcardFormData;
  errors: Partial<Record<keyof AddFlashcardFormData, string>>;
  loading: boolean;
  submit: (data: AddFlashcardFormData) => Promise<void>;
}
```

Logika:

- Utrzymuje stan pól formularza i błędów
- Waliduje dane przed wysłaniem
- Wysyła `CreateFlashcardCommand` do `/api/flashcards`
- Ustawia `loading` i resetuje `errors`

## 7. Integracja API

- Endpoint: POST `/api/flashcards`
- Request Body: `CreateFlashcardCommand`
- Response: FlashcardDTO
- Headers: `Authorization: Bearer {token}`

## 8. Interakcje użytkownika

1. Użytkownik wypełnia pola „Przód” i „Tył”.
2. Formularz waliduje długość tekstu inline.
3. Kliknięcie „Zapisz” → wywołanie hooku `submit` → pokazanie loadera.
4. Po sukcesie → toast sukcesu → nawigacja do `/my-flashcards`.
5. W przypadku błędu walidacji → komunikaty inline.
6. Błąd API → toast błędu.

## 9. Warunki i walidacja

- Autoryzacja JWT; przekierowanie do `/login` jeśli brak tokenu.
- `front.trim().length > 0 && <= 200`
- `back.trim().length > 0 && <= 500`

## 10. Obsługa błędów

- 400 Bad Request → wyświetlenie inline errors.
- 401 Unauthorized → redirect do `/login`, toast.
- 500 Server Error / network → toast błędu i możliwość retry.

## 11. Kroki implementacji

1. Utworzyć plik `src/pages/add-flashcard.astro`.
2. Zaimplementować `AddFlashcardPage` w `src/components/add-flashcard`.
3. Stworzyć `AddFlashcardForm` i podłączyć `useAddFlashcard()`.
4. Dodać `ToastNotification`.
5. Dodać logikę routingu po sukcesie.
6. Dodać style Tailwind i Shadcn/ui.
7. Przetestować scenariusze: poprawne dane, walidacja, błędy API.
