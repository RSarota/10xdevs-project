# Plan implementacji widoku Panel administratora (Admin)

## 1. Przegląd

Widok przeznaczony dla administratora, umożliwia przeglądanie logów błędów generacji oraz zarządzanie użytkownikami.

## 2. Routing widoku

Ścieżka: `/admin` (definiowana w pliku routingu Astro: `src/pages/admin.astro`).

## 3. Struktura komponentów

- `AdminPage`
  - `ErrorLogsSection`
    - `ErrorLogList`
      - `ErrorLogItem`
    - `PaginationControls`
  - `UserManagementSection`
    - `UsersTable`
      - `UserRow`
      - `ActionsModal`
  - `ToastNotification`

## 4. Szczegóły komponentów

### AdminPage

- Opis: Kontener widoku, ładuje dane logów błędów i listę użytkowników, zarządza stanem.
- Główne elementy: zakładki lub sekcje `ErrorLogsSection` i `UserManagementSection`.
- Zdarzenia:
  - onTabChange – zmiana widoku sekcji
  - onRefresh – odświeżenie danych
- Walidacja: brak.
- Typy:
  - `GenerationErrorDTO` (z `src/types.ts`)
  - `UserDTO` (profil użytkownika)
- Propsy: brak (root page).

### ErrorLogsSection

- Opis: Sekcja prezentująca logi błędów generacji.
- Główne elementy: `ErrorLogList`, `PaginationControls`.
- Zdarzenia:
  - `onPageChange(page)` – ładowanie kolejnej strony logów
- Walidacja: brak.
- Typy:
  - `ErrorLogsSectionProps { logs: GenerationErrorDTO[]; totalPages: number; currentPage: number; onPageChange: (p: number) => void }`
- Propsy: `logs`, `totalPages`, `currentPage`, `onPageChange`.

### ErrorLogList

- Opis: Lista logów błędów.
- Główne elementy: mapowanie `ErrorLogItem`.
- Zdarzenia: brak.
- Walidacja: brak.
- Typy:
  - `ErrorLogListProps { logs: GenerationErrorDTO[] }`
- Propsy: `logs`.

### ErrorLogItem

- Opis: Pojedynczy wpis błędu (kod, wiadomość, data).
- Główne elementy: kod błędu, `error_message`, `created_at`.
- Zdarzenia: brak.
- Walidacja: brak.
- Typy:
  - `ErrorLogItemProps { log: GenerationErrorDTO }`
- Propsy: `log`.

### UserManagementSection

- Opis: Sekcja zarządzania użytkownikami.
- Główne elementy: `UsersTable`, przycisk odświeżania.
- Zdarzenia:
  - `onRefreshUsers()`
- Walidacja: brak.
- Typy:
  - `UserManagementSectionProps { users: UserDTO[]; onRefresh: () => void }`
- Propsy: `users`, `onRefresh`.

### UsersTable

- Opis: Tabela z listą użytkowników.
- Główne elementy: nagłówki kolumn (email, data rejestracji, akcje), wiersze `UserRow`.
- Zdarzenia: brak.
- Walidacja: brak.
- Typy:
  - `UsersTableProps { users: UserDTO[] }`
- Propsy: `users`.

### UserRow

- Opis: Wiersz tabeli z danymi użytkownika i akcjami (usuń, zmień rolę).
- Główne elementy: email, data rejestracji, przyciski akcji.
- Zdarzenia:
  - `onDelete(userId)`, `onRoleChange(userId, newRole)`
- Walidacja: brak.
- Typy:
  - `UserRowProps { user: UserDTO; onDelete: (id: string) => void; onRoleChange: (id: string, role: string) => void }`
- Propsy: `user`, `onDelete`, `onRoleChange`.

### ActionsModal

- Opis: Modal do potwierdzania usunięcia lub zmiany roli.
- Główne elementy: tekst potwierdzenia, przyciski `Tak`, `Nie`.
- Zdarzenia: `onConfirm()`, `onCancel()`.
- Walidacja: brak.
- Typy:
  - `ActionsModalProps { isOpen: boolean; message: string; onConfirm: () => void; onCancel: () => void }`
- Propsy: `isOpen`, `message`, `onConfirm`, `onCancel`.

### ToastNotification

- Opis: Komponent do wyświetlania komunikatów.
- Główne elementy: toast z Shadcn/ui.
- Zdarzenia: automatyczne zamknięcie.
- Validation: brak.
- Typy: `ToastProps { message: string; type: 'success' | 'error' | 'info' }`.
- Propsy: `message`, `type`.

## 5. Typy

```typescript
interface HistoryItemViewModel {
  /* ... */
}
// Wykorzystujemy:
// GenerationErrorDTO
// UserDTO
interface AdminViewModel {
  logs: GenerationErrorDTO[];
  users: UserDTO[];
  totalPages: number;
  currentPage: number;
}
```

## 6. Zarządzanie stanem

### Custom hook: `useAdmin()`

Zwraca:

```typescript
{
  logs: GenerationErrorDTO[];
  users: UserDTO[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  fetchLogs: (page: number) => Promise<void>;
  fetchUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  changeUserRole: (id: string, role: string) => Promise<void>;
}
```

Logika:

- Obsługa paginacji logów
- Pobieranie listy użytkowników
- Wykonywanie akcji admina

## 7. Integracja API

- GET `/api/generation-errors?page={p}&limit={n}`
- GET `/api/users`
- DELETE `/api/users/{id}`
- PATCH `/api/users/{id}` body `{ role: string }`

## 8. Interakcje użytkownika

1. Zmiana zakładki między logami i użytkownikami.
2. Nawigacja stroną logów → paginacja.
3. Kliknięcie „Usuń” przy użytkowniku → `ActionsModal` → akcja.
4. Kliknięcie „Zmień rolę” → `ActionsModal` → akcja.

## 9. Warunki i walidacja

- Autoryzacja JWT i rola admina; weryfikacja middleware.
- Paginacja: `page >= 1`, `limit <= 50`.

## 10. Obsługa błędów

- 401 Unauthorized → redirect `/login`.
- 403 Forbidden → redirect `/dashboard`, toast `Brak uprawnień`.
- 500 Server Error → toast `<message>`.

## 11. Kroki implementacji

1. Utworzyć `src/pages/admin.astro`.
2. Zaimplementować `useAdmin()` w `src/hooks/useAdmin.ts`.
3. Stworzyć `AdminPage` z sekcjami.
4. Zbudować `ErrorLogsSection` i `ErrorLogItem`.
5. Zbudować `UserManagementSection`, `UsersTable`, `UserRow`, `ActionsModal`.
6. Dodać `ToastNotification`.
7. Obsłużyć middleware jako ochronę dla adminów.
8. Dodać style Tailwind i Shadcn/ui.
9. Przetestować scenariusze paginacji, akcji i błędów.
