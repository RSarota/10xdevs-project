# Plan implementacji widoku Dashboard

## 1. Przegląd

Widok dashboardu stanowi centralny punkt aplikacji po zalogowaniu użytkownika. Prezentuje podsumowanie statystyk konta użytkownika, w tym liczbę fiszek, sesje generacji oraz ostatnią aktywność. Dashboard zapewnia szybki dostęp do głównych funkcjonalności aplikacji poprzez intuicyjne linki nawigacyjne.

## 2. Routing widoku

Ścieżka: `/dashboard` (definiowana w pliku routingu Astro: `src/pages/dashboard.astro`).

## 3. Struktura komponentów

- `DashboardPage`
  - `DashboardHeader`
  - `StatisticsOverview`
    - `StatisticsCard`
  - `QuickActionsPanel`
    - `QuickActionButton`
  - `RecentActivityFeed`
    - `ActivityItem`
  - `ToastNotification`

## 4. Szczegóły komponentów

### DashboardPage

- **Opis:** Główny kontener widoku dashboardu, zarządza pobieraniem statystyk użytkownika i stanem całego widoku. Odpowiada za layout i rozmieszczenie sekcji dashboardu.
- **Główne elementy:** Nagłówek strony, sekcja statystyk (karty statystyczne), panel szybkich akcji, feed ostatniej aktywności.
- **Zdarzenia:** 
  - Inicjalizacja widoku – pobieranie statystyk użytkownika
  - Obsługa błędów ładowania danych
- **Walidacja:** Sprawdzenie czy użytkownik jest zalogowany (autoryzacja JWT).
- **Typy:**
  - `UserStatisticsDTO` (z `src/types.ts`)
  - `DashboardViewModel`
- **Propsy:** brak (root page, dane pobierane w hooku).

### DashboardHeader

- **Opis:** Nagłówek widoku zawierający powitanie użytkownika oraz datę ostatniego logowania.
- **Główne elementy:** 
  - `<h1>` z tekstem powitalnym (np. "Witaj, [imię użytkownika]")
  - `<p>` z informacją o ostatniej aktywności
- **Obsługiwane zdarzenia:** brak.
- **Walidacja:** brak.
- **Typy:** `HeaderProps { userName?: string; lastActivity?: string }`.
- **Propsy:** `userName: string | undefined`, `lastActivity: string | undefined`.

### StatisticsOverview

- **Opis:** Kontener prezentujący kluczowe statystyki użytkownika w formie kart. Wyświetla metryki dotyczące fiszek i generacji.
- **Główne elementy:** Grid/Flex container zawierający komponenty `StatisticsCard`.
- **Obsługiwane zdarzenia:** brak.
- **Walidacja:** brak.
- **Typy:** `StatisticsOverviewProps { statistics: UserStatisticsDTO }`.
- **Propsy:** `statistics: UserStatisticsDTO`.

### StatisticsCard

- **Opis:** Pojedyncza karta wyświetlająca konkretną metrykę (np. łączna liczba fiszek, wskaźnik akceptacji AI).
- **Główne elementy:**
  - Ikona reprezentująca typ metryki
  - `<h3>` z nazwą metryki
  - `<p>` z wartością liczbową
  - Opcjonalnie: trend lub dodatkowe informacje
- **Obsługiwane zdarzenia:** brak.
- **Walidacja:** brak.
- **Typy:** `StatisticsCardProps { title: string; value: number | string; icon?: ReactNode; trend?: string }`.
- **Propsy:** `title: string`, `value: number | string`, `icon?: ReactNode`, `trend?: string`.

### QuickActionsPanel

- **Opis:** Panel z przyciskami szybkiego dostępu do głównych funkcjonalności aplikacji (generowanie fiszek, dodawanie ręczne, rozpoczęcie sesji nauki).
- **Główne elementy:** Kontener z komponentami `QuickActionButton`.
- **Obsługiwane zdarzenia:** 
  - Nawigacja do odpowiednich widoków po kliknięciu przycisku
- **Walidacja:** brak.
- **Typy:** `QuickActionsPanelProps { actions: QuickAction[] }`.
- **Propsy:** `actions: QuickAction[]` gdzie `QuickAction = { label: string; path: string; icon?: ReactNode }`.

### QuickActionButton

- **Opis:** Pojedynczy przycisk reprezentujący szybką akcję.
- **Główne elementy:**
  - `<button>` lub `<Link>` z Astro/React Router
  - Ikona akcji
  - Tekst opisujący akcję
- **Obsługiwane zdarzenia:** 
  - `onClick()` – nawigacja do docelowego widoku
- **Walidacja:** brak.
- **Typy:** `QuickActionButtonProps { label: string; path: string; icon?: ReactNode; onClick: () => void }`.
- **Propsy:** `label: string`, `path: string`, `icon?: ReactNode`, `onClick: () => void`.

### RecentActivityFeed

- **Opis:** Lista prezentująca ostatnie aktywności użytkownika (ostatnie generacje, dodane fiszki).
- **Główne elementy:** 
  - Nagłówek sekcji
  - Lista komponentów `ActivityItem`
  - Komunikat "Brak aktywności" gdy lista jest pusta
- **Obsługiwane zdarzenia:** brak.
- **Walidacja:** brak.
- **Typy:** `RecentActivityFeedProps { activities: ActivityViewModel[] }`.
- **Propsy:** `activities: ActivityViewModel[]`.

### ActivityItem

- **Opis:** Pojedynczy element reprezentujący aktywność użytkownika.
- **Główne elementy:**
  - Ikona typu aktywności
  - Opis aktywności
  - Timestamp (data i godzina)
- **Obsługiwane zdarzenia:** brak.
- **Walidacja:** brak.
- **Typy:** `ActivityItemProps { type: 'generation' | 'flashcard' | 'session'; description: string; timestamp: string }`.
- **Propsy:** `type: 'generation' | 'flashcard' | 'session'`, `description: string`, `timestamp: string`.

### ToastNotification

- **Opis:** Komponent do wyświetlania komunikatów o błędach/sukcesie.
- **Główne elementy:** Toast z Shadcn/ui.
- **Obsługiwane zdarzenia:** Automatyczne zamykanie po określonym czasie.
- **Walidacja:** brak.
- **Typy:** `ToastProps { message: string; type: 'success' | 'error' | 'info' }`.
- **Propsy:** `message: string`, `type: 'success' | 'error' | 'info'`.

## 5. Typy

### Istniejące typy (z `src/types.ts`):
- `UserStatisticsDTO` – dane statystyk użytkownika z API

```typescript
interface UserStatisticsDTO {
  flashcards: {
    total: number;
    by_type: Record<FlashcardType, number>;
  };
  generations: {
    total_sessions: number;
    total_generated: number;
    total_accepted: number;
    acceptance_rate: number;
    edit_rate: number;
  };
}
```

### Nowe typy (ViewModels):

```typescript
// Model widoku dla dashboardu
interface DashboardViewModel {
  statistics: UserStatisticsDTO;
  userName?: string;
  lastActivity?: string;
  recentActivities: ActivityViewModel[];
}

// Model aktywności użytkownika
interface ActivityViewModel {
  id: string;
  type: 'generation' | 'flashcard' | 'session';
  description: string;
  timestamp: string; // ISO 8601 format
}

// Model szybkiej akcji
interface QuickAction {
  label: string;
  path: string;
  icon?: ReactNode;
}

// Props dla komponentów
interface HeaderProps {
  userName?: string;
  lastActivity?: string;
}

interface StatisticsOverviewProps {
  statistics: UserStatisticsDTO;
}

interface StatisticsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  trend?: string;
}

interface QuickActionsPanelProps {
  actions: QuickAction[];
}

interface QuickActionButtonProps {
  label: string;
  path: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface RecentActivityFeedProps {
  activities: ActivityViewModel[];
}

interface ActivityItemProps {
  type: 'generation' | 'flashcard' | 'session';
  description: string;
  timestamp: string;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}
```

## 6. Zarządzanie stanem

### Custom Hook: `useDashboard()`

Hook zarządzający stanem dashboardu i pobieraniem danych.

**Zwracane wartości:**
```typescript
interface UseDashboardReturn {
  statistics: UserStatisticsDTO | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Logika:**
- Pobiera statystyki użytkownika z API przy montowaniu komponentu
- Utrzymuje stan ładowania i błędów
- Zapewnia funkcję `refetch()` do odświeżania danych
- Opcjonalnie: cache danych z czasem wygaśnięcia

**Stan lokalny:**
- `statistics: UserStatisticsDTO | null` – pobrane statystyki
- `loading: boolean` – flaga ładowania
- `error: Error | null` – obiekt błędu
- `recentActivities: ActivityViewModel[]` – ostatnie aktywności (mockowane lub pobrane z API)

## 7. Integracja API

### Endpoint: GET `/api/users/me/statistics`

**Opis:** Pobiera kompleksowe statystyki zalogowanego użytkownika.

**Request:**
- Metoda: `GET`
- Headers: `Authorization: Bearer {token}`
- Body: brak

**Response (200):**
```typescript
{
  flashcards: {
    total: number;
    by_type: {
      manual: number;
      "ai-full": number;
      "ai-edited": number;
    }
  };
  generations: {
    total_sessions: number;
    total_generated: number;
    total_accepted: number;
    acceptance_rate: number;
    edit_rate: number;
  };
}
```

**Obsługa błędów:**
- `401 Unauthorized` – przekierowanie do strony logowania
- `500 Server Error` – wyświetlenie komunikatu toast o błędzie
- Network error – wyświetlenie komunikatu o problemach z połączeniem

**Mapowanie danych:**
- Dane z API (`UserStatisticsDTO`) są bezpośrednio używane w widoku
- Przygotowanie danych dla `StatisticsCard` (ekstrakcja poszczególnych metryk)
- Formatowanie liczb i procentów dla lepszej czytelności

## 8. Interakcje użytkownika

1. **Wejście na dashboard:**
   - Użytkownik po zalogowaniu jest przekierowany na `/dashboard`
   - Automatyczne pobieranie statystyk z API
   - Wyświetlenie loadera podczas ładowania
   - Po załadowaniu: prezentacja statystyk w kartach

2. **Przegląd statystyk:**
   - Użytkownik widzi karty z kluczowymi metrykami:
     - Łączna liczba fiszek
     - Liczba fiszek według typu (manual, ai-full, ai-edited)
     - Liczba sesji generacji AI
     - Wskaźnik akceptacji fiszek AI
     - Wskaźnik edycji fiszek AI
   - Statystyki prezentowane w czytelny, wizualny sposób

3. **Szybkie akcje:**
   - Kliknięcie przycisku "Generuj fiszki" → nawigacja do `/generate-flashcards`
   - Kliknięcie przycisku "Dodaj fiszkę" → nawigacja do `/add-flashcard`
   - Kliknięcie przycisku "Moje fiszki" → nawigacja do `/my-flashcards`
   - Kliknięcie przycisku "Rozpocznij naukę" → nawigacja do `/session`

4. **Przegląd ostatnich aktywności:**
   - Scroll przez listę ostatnich aktywności
   - Każdy element pokazuje typ aktywności, opis i czas

5. **Obsługa błędów:**
   - Wyświetlenie komunikatu błędu w toast
   - Możliwość ponowienia próby załadowania danych (przycisk "Spróbuj ponownie")

## 9. Warunki i walidacja

### Autoryzacja widoku:
- **Warunek:** Użytkownik musi być zalogowany (posiadać ważny JWT token)
- **Weryfikacja:** Middleware Astro sprawdza obecność tokenu
- **Akcja przy niepowodzeniu:** Przekierowanie do `/login`

### Walidacja danych:
- **Statystyki:**
  - Wszystkie wartości liczbowe muszą być `>= 0`
  - Procenty (acceptance_rate, edit_rate) muszą być w zakresie `0-100`
- **Wyświetlanie:**
  - Jeśli `statistics === null` → wyświetl loader
  - Jeśli `statistics.flashcards.total === 0` → wyświetl komunikat zachęcający do stworzenia pierwszej fiszki
  - Jeśli `recentActivities.length === 0` → wyświetl "Brak ostatnich aktywności"

### Stan komponentów:
- Przyciski szybkich akcji zawsze aktywne (bez warunków walidacyjnych)
- Karty statystyk wyświetlają "0" lub "-" gdy brak danych

## 10. Obsługa błędów

### Błędy API:
- **401 Unauthorized:**
  - Wylogowanie użytkownika
  - Przekierowanie do `/login`
  - Toast: "Sesja wygasła. Zaloguj się ponownie."

- **500 Internal Server Error:**
  - Toast error: "Nie udało się załadować statystyk. Spróbuj ponownie."
  - Wyświetlenie przycisku "Spróbuj ponownie"
  - Zachowanie stanu widoku (brak przekierowania)

- **Network Error:**
  - Toast error: "Brak połączenia z serwerem. Sprawdź połączenie internetowe."
  - Wyświetlenie przycisku "Spróbuj ponownie"

### Obsługa timeout:
- Ustawienie timeout na 10 sekund dla wywołania API
- Po przekroczeniu: traktowanie jak network error

### Fallback UI:
- W przypadku błędu ładowania statystyk:
  - Wyświetlenie szkieletów kart (skeleton loaders)
  - Komunikat o błędzie w miejscu danych
  - Zachowanie funkcjonalności szybkich akcji (nawigacja nadal działa)

### Walidacja response:
- Sprawdzenie struktury odpowiedzi z API
- Jeśli struktura nieprawidłowa → traktowanie jak błąd serwera
- Logowanie błędów walidacji do console (dev mode)

## 11. Kroki implementacji

1. **Utworzenie struktury plików:**
   - Utworzyć `src/pages/dashboard.astro`
   - Utworzyć `src/components/dashboard/DashboardPage.tsx`
   - Utworzyć folder `src/components/dashboard/` dla komponentów pomocniczych

2. **Implementacja custom hooka:**
   - Stworzyć `src/hooks/useDashboard.ts`
   - Zaimplementować logikę pobierania statystyk z API
   - Dodać obsługę stanów: loading, error, data
   - Zaimplementować funkcję `refetch()`

3. **Budowa głównego kontenera:**
   - Zaimplementować `DashboardPage` jako główny komponent React
   - Podłączyć `useDashboard()` hook
   - Zaimplementować routing protection (sprawdzenie autoryzacji)

4. **Implementacja sekcji nagłówka:**
   - Stworzyć `DashboardHeader` komponent
   - Wyświetlić powitanie użytkownika
   - Dodać informację o ostatniej aktywności

5. **Implementacja sekcji statystyk:**
   - Stworzyć `StatisticsOverview` komponent
   - Stworzyć `StatisticsCard` komponent (reużywalny)
   - Zaimplementować mapowanie danych z `UserStatisticsDTO` na karty
   - Dodać ikony i styling dla każdej karty

6. **Implementacja panelu szybkich akcji:**
   - Stworzyć `QuickActionsPanel` komponent
   - Stworzyć `QuickActionButton` komponent
   - Zdefiniować listę akcji (generate, add, my-flashcards, session)
   - Zaimplementować nawigację po kliknięciu

7. **Implementacja feedu aktywności:**
   - Stworzyć `RecentActivityFeed` komponent
   - Stworzyć `ActivityItem` komponent
   - Zaimplementować mockowanie danych aktywności (tymczasowo) lub pobieranie z API
   - Dodać formatowanie timestampów

8. **Obsługa błędów:**
   - Dodać `ToastNotification` do widoku
   - Zaimplementować wyświetlanie błędów API
   - Dodać przycisk "Spróbuj ponownie" przy błędach
   - Zaimplementować przekierowanie przy 401

9. **Styling i responsywność:**
   - Zastosować Tailwind CSS dla layoutu
   - Zaimplementować responsywny grid dla kart statystyk
   - Zapewnić mobile-first design
   - Wykorzystać komponenty Shadcn/ui (Card, Button, itp.)

10. **Testy i walidacja:**
    - Przetestować scenariusz poprawnego ładowania danych
    - Przetestować scenariusze błędów (401, 500, network error)
    - Przetestować nawigację z szybkich akcji
    - Przetestować responsywność na różnych urządzeniach
    - Sprawdzić dostępność (a11y) – kontrast, nawigacja klawiaturą

11. **Integracja z layoutem:**
    - Upewnić się, że dashboard używa głównego layoutu aplikacji
    - Zintegrować z nawigacją (menu boczne/górne)
    - Dodać breadcrumbs lub wskaźnik aktywnej strony

12. **Optymalizacja:**
    - Zaimplementować cache dla statystyk (opcjonalnie)
    - Dodać lazy loading dla komponentów jeśli potrzebne
    - Zoptymalizować rerenderowanie komponentów

