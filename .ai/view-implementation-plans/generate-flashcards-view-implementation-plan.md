# Plan implementacji widoku Generowanie Fiszek (GenerateFlashcards)

## 1. Przegląd

Widok umożliwia zalogowanemu użytkownikowi wklejenie długiego tekstu (1000–10000 znaków), wysłanie go do API generującego propozycje fiszek oraz przegląd i przyjęcie/edycję/odrzucenie każdej propozycji.

## 2. Routing widoku

Ścieżka: `/generate-flashcards` (definiowana w pliku routingu Astro: `src/pages/generate-flashcards.astro` lub React Router w SPA).

## 3. Struktura komponentów

- `GenerateFlashcardsPage`
  - `FlashcardsForm`
  - `FlashcardsLoader`
  - `ProposalsList`
    - `ProposalItem`
    - `ProposalEditorModal`
  - `ToastNotification`

## 4. Szczegóły komponentów

### GenerateFlashcardsPage

- Opis: Kontener widoku, zarządza stanem i wywołuje hook do generowania fiszek.
- Elementy: nagłówek, komponenty formularza/loadera/listy.
- Zdarzenia: wywołanie `onGenerate(sourceText)`.
- Walidacja: długość tekstu (1000–10000), nie puste.
- Typy:
  - `GenerateFlashcardsRequest` (pole `source_text`: string)
  - `GenerationResponse`
- Propsy: brak (root page).

### FlashcardsForm

- Opis: Formularz z `textarea` i przyciskiem.
- Elementy: `<textarea>`, `<button>Generuj</button>`.
- Zdarzenia: `onChange(text)`, `onSubmit()`.
- Walidacja inline: licznik znaków, blokada przy nieprawidłowej długości.
- Typy: `FormProps { onSubmit: (text: string) => void }`.

### FlashcardsLoader

- Opis: Spinner lub progress bar wyświetlany podczas oczekiwania na odpowiedź.
- Elementy: komponent loadera z Shadcn/ui.
- Propsy: `loading: boolean`.

### ProposalsList

- Opis: Lista wygenerowanych propozycji.
- Elementy: kontener listy, mapowanie `ProposalItem`.
- Zdarzenia: `onAccept(id)`, `onEdit(id)`, `onReject(id)`.
- Typy: `ProposalViewModel { temporary_id: string; front: string; back: string; status: 'pending' }`.
- Propsy: `proposals: ProposalViewModel[]`, callbacki.

### ProposalItem

- Opis: Pojedyncza propozycja z przyciskami akceptacji/edycji/odrzucenia.
- Elementy: front/back, ikony akcji.
- Zdarzenia: `handleAccept()`, `handleEdit()`, `handleReject()`.
- Typy: `ProposalViewModel`.
- Propsy: pojedynczy proposal, callbacki.

### ProposalEditorModal

- Opis: Modal umożliwiający edycję front/back przed akceptacją.
- Elementy: inputy z limitem znaków, przycisk zatwierdź/anuluj.
- Zdarzenia: `onSave(editedProposal)`, `onCancel()`.
- Walidacja: front ≤200, back ≤500.
- Typy: `ProposalViewModel`.
- Propsy: `proposal`, callbacks.

### ToastNotification

- Opis: Komponent do wyświetlania komunikatów o błędach/sukcesie.
- Elementy: toast z Shadcn/ui.
- Propsy: `message: string`, `type: 'success'|'error'`.

## 5. Typy

- `GenerateFlashcardsRequest { source_text: string }`
- `ProposalDTO { front: string; back: string }`
- `GenerationResponse { generation_id: number; proposals: ProposalDTO[]; }`
- `ProposalViewModel { temporary_id: string; front: string; back: string; status: 'pending'|'accepted'|'edited'|'rejected' }`

## 6. Zarządzanie stanem

- Custom hook `useGenerateFlashcards()` zwracający `{ generate, loading, error, proposals }`.
- Hook utrzymuje lokalny stan inputu i listy propozycji.

## 7. Integracja API

- Wywołanie POST `/api/generations` z ciałem `GenerateFlashcardsRequest`.
- Odpowiedź mapowana na `ProposalViewModel[]` (dodanie `temporary_id`).
- W przypadku błędu: rzucenie wyjątku, ustawienie `error` w hooku.

## 8. Interakcje użytkownika

1. Wklejenie/ wpisanie tekstu → walidacja.
2. Kliknięcie „Generuj” → pokazanie loadera.
3. Po otrzymaniu propozycji → wyświetlenie listy.
4. Akceptacja: oznaczenie proposal i przekazanie do POST `/api/flashcards` w widoku listy fiszek.
5. Edycja: otwarcie `ProposalEditorModal`, zapis edycji, status `edited`.
6. Odrzucenie: usunięcie itemu z listy.

## 9. Warunki i walidacja

- `source_text.length >= 1000 && <= 10000`
- `front.trim().length > 0 && <= 200`
- `back.trim().length > 0 && <= 500`
- Blokada przycisku Generuj, Zapisz w edycji.

## 10. Obsługa błędów

- Błędy walidacji formularza: komunikaty inline.
- Błąd API: toast error.
- Timeout: komunikat o nieosiągnięciu usługi.

## 11. Kroki implementacji

1. Utworzyć plik `src/pages/generate-flashcards.astro` (wrapping React lub Astro komponent).
2. Zaimplementować `GenerateFlashcardsPage` i podłączyć custom hook.
3. Zbudować `FlashcardsForm` z walidacją.
4. Dodać komponent loadera (`FlashcardsLoader`).
5. Stworzyć `ProposalsList` i `ProposalItem`.
6. Stworzyć `ProposalEditorModal` z walidacją inputów.
7. Zaimplementować `useGenerateFlashcards` (fetch + state).
8. Obsłużyć toast notifications.
9. Przetestować scenariusze: poprawny input, błędy walidacji, błąd API.
