# Plan implementacji widoku Profil użytkownika (Profile)

## 1. Przegląd

Widok pozwala użytkownikowi na przegląd i edycję danych konta oraz przegląd historii sesji generacji i nauki.

## 2. Routing widoku

Ścieżka: `/profile` (definiowana w pliku routingu Astro: `src/pages/profile.astro`).

## 3. Struktura komponentów

- `ProfilePage`
  - `ProfileForm`
  - `HistoryList`
    - `HistoryItem`
  - `ToastNotification`

## 4. Szczegóły komponentów

### ProfilePage
- Opis: Kontener widoku, ładuje dane profilu i historię, zarządza stanem oraz wywołuje akcje aktualizacji i usunięcia konta.
- Główne elementy: nagłówek, `ProfileForm`, `HistoryList`, przycisk usunięcia konta.
- Zdarzenia:
  - Inicjalizacja widoku – pobranie danych profilu i historii
  - onDeleteAccount – wywołanie usunięcia konta
- Walidacja: brak (delegowana do form i modali).
- Typy:
  - `UserProfileDTO` (mail, imię)
  - `HistoryItemViewModel`
- Propsy: brak (root page).

### ProfileForm
- Opis: Formularz edycji adresu e-mail i zmiany hasła.
- Główne elementy: `<input type="email">` dla e-mail, `<input type="password">` dla hasła, `<input>` dla potwierdzenia hasła, `<button>` „Zapisz zmiany”.
- Zdarzenia:
  - `onChange(field, value)` – aktualizacja stanu form
  - `onSubmit()` – walidacja i wywołanie aktualizacji
- Walidacja inline:
  - email musi być poprawnym adresem
  - nowe hasło ≥8 znaków, co najmniej jedna wielka litera, jedna cyfra
  - potwierdzenie hasła musi się zgadzać
- Typy:
  - `ProfileFormData { email: string; password?: string; confirmPassword?: string }`
  - `ProfileFormProps { onSubmit: (data: ProfileFormData) => void }`
- Propsy: `onSubmit`.

### HistoryList
- Opis: Lista z historią sesji generacji i nauki.
- Główne elementy: mapowanie `HistoryItem`.
- Zdarzenia: brak.
- Walidacja: brak.
- Typy:
  - `HistoryListProps { items: HistoryItemViewModel[] }`
- Propsy: `items`.

### HistoryItem
- Opis: Pojedynczy wpis historii z datą, typem i wynikami.
- Główne elementy: data, opis, liczba fiszek, ocena przyswojenia.
- Zdarzenia: brak.
- Walidacja: brak.
- Typy:
  - `HistoryItemViewModel { id: string; type: 'generation' | 'session'; date: string; count: number; score?: number }`
- Propsy: `item`.

### ToastNotification
- Opis: Komponent do wyświetlania komunikatów o błędach i sukcesach.
- Główne elementy: toast z Shadcn/ui.
- Zdarzenia: automatyczne zamknięcie.
- Walidacja: brak.
- Typy: `ToastProps { message: string; type: 'success' | 'error' }`.
- Propsy: `message`, `type`.

## 5. Typy

```typescript
interface ProfileFormData {
  email: string;
  password?: string;
  confirmPassword?: string;
}

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
}

interface HistoryItemViewModel {
  id: string;
  type: 'generation' | 'session';
  date: string;
  count: number;
  score?: number;
}
```

Istniejące typy:
- `UserProfileDTO` – dane konta (email, name) pobrane z API lub Supabase.

## 6. Zarządzanie stanem

### Custom hook: `useProfile()`
Zwraca:
```typescript
{
  profile: UserProfileDTO | null;
  history: HistoryItemViewModel[];
  loading: boolean;
  error: Error | null;
  updateProfile: (data: ProfileFormData) => Promise<void>;
  deleteAccount: () => Promise<void>;
}
```

Logika:
- Pobiera profil i historię przy inicjalizacji
- Zarządza stanami loading i error
- Realizuje update i delete z API

## 7. Integracja API

- GET `/api/users/me` – pobranie profilu
- PATCH `/api/users/me` z body `{ email, password }` – aktualizacja danych
- DELETE `/api/users/me` – usunięcie konta

## 8. Interakcje użytkownika

1. Edycja e-maila/hasła → walidacja inline.
2. Kliknięcie „Zapisz zmiany” → loader, API, toast sukcesu lub błędu.
3. Kliknięcie „Usuń konto” → confirmation modal, usunięcie, redirect do `/login`.
4. Przewijanie historii → statyczne listowanie.

## 9. Warunki i walidacja

- Autoryzacja JWT; brak tokenu → redirect `/login`.
- `email` must be valid format.
- `password` rules: ≥8 znaków, wielka litera, cyfra.
- `confirmPassword === password`.

## 10. Obsługa błędów

- 400 Bad Request → inline errors.
- 401 Unauthorized → redirect `/login`, toast.
- 403 Forbidden → toast `Brak uprawnień`.
- 500 Server Error → toast `Błąd serwera, spróbuj później`.

## 11. Kroki implementacji

1. Utworzyć `src/pages/profile.astro`.
2. Zaimplementować `ProfilePage` i `useProfile()`.
3. Stworzyć `ProfileForm` z walidacją.
4. Dodać `HistoryList` i `HistoryItem`.
5. Dodać modal potwierdzenia usunięcia konta.
6. Dodać `ToastNotification`.
7. Dodać style Tailwind i Shadcn/ui.
8. Przetestować scenariusze: update, delete, błędy.
