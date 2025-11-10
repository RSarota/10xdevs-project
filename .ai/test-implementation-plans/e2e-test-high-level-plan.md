# Wysokopoziomowy plan testów E2E - 10x-cards

## 1. Przegląd

Plan testów E2E dla aplikacji 10x-cards obejmuje wszystkie kluczowe funkcjonalności zdefiniowane w PRD. Testy będą implementowane przy użyciu Playwright z wykorzystaniem wzorca Page Object Model.

## 2. Mapowanie User Stories do scenariuszy testowych

### 2.1. Autoryzacja i zarządzanie kontem

#### US-001: Rejestracja konta

**Scenariusze testowe:**

- ✅ Rejestracja z poprawnymi danymi
- ✅ Rejestracja z nieprawidłowym formatem e-maila
- ✅ Rejestracja z hasłem nie spełniającym wymagań
- ✅ Rejestracja z niezgodnymi hasłami
- ✅ Rejestracja z już istniejącym e-mailem
- ✅ Weryfikacja wyświetlenia komunikatu o wysłaniu e-maila aktywacyjnego
- ✅ Przekierowanie do strony logowania po rejestracji

#### US-002: Logowanie do aplikacji

**Scenariusze testowe:**

- ✅ Logowanie z poprawnymi danymi
- ✅ Logowanie z nieprawidłowym e-mailem
- ✅ Logowanie z nieprawidłowym hasłem
- ✅ Logowanie z niepotwierdzonym kontem (e-mail nie aktywowany)
- ✅ Przekierowanie do dashboardu po udanym logowaniu
- ✅ Link do odzyskiwania hasła
- ✅ Link do rejestracji

#### US-010: Usunięcie konta

**Scenariusze testowe:**

- ✅ Wyświetlenie opcji usunięcia konta w profilu
- ✅ Potwierdzenie usunięcia konta (modal)
- ✅ Anulowanie usunięcia konta
- ✅ Weryfikacja usunięcia konta i danych
- ✅ Przekierowanie po usunięciu konta

### 2.2. Generowanie fiszek przez AI

#### US-003: Generowanie fiszek przy użyciu AI

**Scenariusze testowe:**

- ✅ Generowanie fiszek z tekstem w zakresie 1000-10000 znaków
- ✅ Próba generowania z tekstem poniżej 1000 znaków
- ✅ Próba generowania z tekstem powyżej 10000 znaków
- ✅ Wyświetlenie stanu ładowania podczas generowania
- ✅ Wyświetlenie propozycji fiszek po generowaniu
- ✅ Obsługa błędu API (symulacja)
- ✅ Wyświetlenie komunikatu błędu

#### US-004: Przegląd i zatwierdzanie propozycji fiszek

**Scenariusze testowe:**

- ✅ Wyświetlenie listy propozycji fiszek
- ✅ Zatwierdzenie pojedynczej fiszki
- ✅ Odrzucenie pojedynczej fiszki
- ✅ Edycja propozycji fiszki
- ✅ Zapisanie zaakceptowanych fiszek
- ✅ Statystyki zaakceptowanych/odrzuconych fiszek
- ✅ Reset formularza po zapisaniu

### 2.3. Ręczne zarządzanie fiszkami

#### US-007: Ręczne tworzenie fiszek

**Scenariusze testowe:**

- ✅ Utworzenie fiszki z poprawnymi danymi
- ✅ Walidacja pola "Przód" (max 200 znaków)
- ✅ Walidacja pola "Tył" (max 500 znaków)
- ✅ Wyświetlenie licznika znaków
- ✅ Próba zapisania z przekroczonym limitem znaków
- ✅ Próba zapisania z pustymi polami
- ✅ Przekierowanie do listy fiszek po zapisaniu

#### US-005: Edycja fiszek

**Scenariusze testowe:**

- ✅ Otwarcie modala edycji fiszki
- ✅ Edycja treści fiszki
- ✅ Zapisanie zmian
- ✅ Anulowanie edycji
- ✅ Walidacja podczas edycji (limity znaków)

#### US-006: Usuwanie fiszek

**Scenariusze testowe:**

- ✅ Wyświetlenie opcji usunięcia w liście fiszek
- ✅ Otwarcie modala potwierdzenia
- ✅ Potwierdzenie usunięcia
- ✅ Anulowanie usunięcia
- ✅ Weryfikacja usunięcia fiszki z listy

### 2.4. Przeglądanie i zarządzanie fiszkami

**Scenariusze testowe:**

- ✅ Wyświetlenie listy wszystkich fiszek
- ✅ Filtrowanie fiszek
- ✅ Sortowanie fiszek
- ✅ Paginacja listy fiszek
- ✅ Stan pusty (brak fiszek)
- ✅ Odświeżanie listy
- ✅ Nawigacja do dodawania/generowania fiszek z pustej listy

### 2.5. Dashboard

**Scenariusze testowe:**

- ✅ Wyświetlenie statystyk użytkownika
- ✅ Wyświetlenie liczby fiszek
- ✅ Wyświetlenie historii generacji
- ✅ Szybkie akcje (linki do głównych funkcji)
- ✅ Ostatnia aktywność
- ✅ Stan pusty dla nowego użytkownika
- ✅ Odświeżanie danych

### 2.6. Profil użytkownika

**Scenariusze testowe:**

- ✅ Wyświetlenie danych profilu
- ✅ Zmiana hasła
- ✅ Walidacja formularza profilu
- ✅ Zapisanie zmian w profilu
- ✅ Historia sesji nauki (jeśli zaimplementowana)

### 2.7. Sesja nauki (spaced repetition)

#### US-008: Sesja nauki z algorytmem powtórek

**Scenariusze testowe:**

- ✅ Rozpoczęcie sesji nauki
- ✅ Wyświetlenie przodu fiszki
- ✅ Odkrycie tyłu fiszki
- ✅ Ocena przyswojenia (różne opcje)
- ✅ Przejście do kolejnej fiszki
- ✅ Zakończenie sesji
- ✅ Podsumowanie sesji

#### US-011: Historia sesji nauki

**Scenariusze testowe:**

- ✅ Wyświetlenie historii sesji
- ✅ Dane sesji (data, liczba fiszek, ocena)
- ✅ Filtrowanie/sortowanie historii
- ✅ Dostęp z poziomu profilu

### 2.8. Bezpieczeństwo i prywatność

#### US-009: Bezpieczny dostęp do danych

**Scenariusze testowe:**

- ✅ Brak dostępu do dashboardu bez logowania
- ✅ Przekierowanie do logowania dla niezalogowanych
- ✅ Dostęp tylko do własnych fiszek
- ✅ Brak możliwości dostępu do fiszek innych użytkowników (test API)

### 2.9. Panel administratora

**Scenariusze testowe:**

- ✅ Dostęp tylko dla administratorów
- ✅ Wyświetlenie logów błędów generacji
- ✅ Zarządzanie użytkownikami
- ✅ Filtrowanie i przeglądanie danych administracyjnych

### 2.10. Nawigacja i UX

**Scenariusze testowe:**

- ✅ Nawigacja między stronami
- ✅ Responsywność na różnych rozdzielczościach
- ✅ Działanie linków w nawigacji
- ✅ Wylogowanie
- ✅ Przekierowania po akcjach

## 3. Priorytetyzacja testów

### Priorytet 1 (Krytyczne - MVP)

1. **Autoryzacja:**
   - Rejestracja i logowanie
   - Weryfikacja e-maila
   - Ochrona tras wymagających autoryzacji

2. **Generowanie fiszek przez AI:**
   - Generowanie z poprawnym tekstem
   - Przegląd i zatwierdzanie propozycji
   - Zapisanie zaakceptowanych fiszek

3. **Ręczne zarządzanie fiszkami:**
   - Tworzenie fiszki
   - Edycja fiszki
   - Usuwanie fiszki
   - Lista fiszek

### Priorytet 2 (Wysoki)

4. **Dashboard:**
   - Wyświetlenie statystyk
   - Szybkie akcje

5. **Profil:**
   - Edycja profilu
   - Usunięcie konta

### Priorytet 3 (Średni)

6. **Sesja nauki:**
   - Przeprowadzenie sesji
   - Historia sesji

7. **Panel administratora:**
   - Logi błędów
   - Zarządzanie użytkownikami

## 4. Struktura testów

### 4.1. Organizacja plików

```
tests/e2e/
├── auth/
│   ├── registration.spec.ts
│   ├── login.spec.ts
│   └── account-deletion.spec.ts
├── flashcards/
│   ├── ai-generation.spec.ts
│   ├── manual-creation.spec.ts
│   ├── editing.spec.ts
│   ├── deletion.spec.ts
│   └── list-view.spec.ts
├── dashboard/
│   └── dashboard.spec.ts
├── profile/
│   └── profile.spec.ts
├── learning-session/
│   ├── session-flow.spec.ts
│   └── session-history.spec.ts
├── admin/
│   └── admin-panel.spec.ts
├── navigation/
│   └── navigation.spec.ts
└── fixtures/
    ├── auth.setup.ts
    └── test-data.ts
```

### 4.2. Page Object Models (struktura)

```
tests/e2e/pages/
├── LandingPage.ts
├── LoginPage.ts
├── RegisterPage.ts
├── DashboardPage.ts
├── GenerateFlashcardsPage.ts
├── AddFlashcardPage.ts
├── MyFlashcardsPage.ts
├── ProfilePage.ts
├── LearningSessionPage.ts
└── AdminPage.ts
```

## 5. Wymagania techniczne

### 5.1. Konfiguracja Playwright

- ✅ Chromium/Desktop Chrome (zgodnie z regułami)
- ✅ Browser contexts dla izolacji
- ✅ Trace viewer dla debugowania
- ✅ Screenshots przy błędach
- ✅ Parallel execution

### 5.2. Setup i Teardown

- ✅ Global setup dla przygotowania danych testowych
- ✅ Authentication state reuse
- ✅ Cleanup po testach
- ✅ Mockowanie API (jeśli potrzebne)

### 5.3. Test Data

- ✅ Fixtures dla użytkowników testowych
- ✅ Generator danych testowych
- ✅ Cleanup danych po testach

## 6. Metryki sukcesu testów

### 6.1. Pokrycie funkcjonalne

- ✅ Wszystkie krytyczne ścieżki użytkownika
- ✅ Obsługa błędów i edge cases

## 7. Następne kroki

1. **Faza 1: Przygotowanie infrastruktury**
   - Konfiguracja Playwright
   - Utworzenie struktury folderów
   - Setup fixtures i helpers

2. **Faza 2: Implementacja Page Object Models**
   - Definicja selektorów `data-testid`
   - Implementacja Page Objects
   - Helpers i utilities

3. **Faza 3: Implementacja testów Priorytet 1**
   - Autoryzacja
   - Generowanie fiszek AI
   - Ręczne zarządzanie fiszkami

4. **Faza 4: Implementacja testów Priorytet 2**
   - Dashboard
   - Profil

5. **Faza 5: Implementacja testów Priorytet 3**
   - Sesja nauki
   - Panel administratora

6. **Faza 6: Optymalizacja i maintenance**
   - Refaktoryzacja
   - Dodanie testów wizualnych (screenshots)
   - CI/CD integration

## 8. Uwagi

- Testy powinny być niezależne i możliwe do uruchomienia w dowolnej kolejności
- Użycie fixtures dla wspólnych operacji (logowanie, tworzenie danych)
- Mockowanie zewnętrznych API (Azure OpenAI) dla stabilności testów
- Testy powinny być deterministyczne i powtarzalne
- Wykorzystanie API testing dla walidacji backendu
- Implementacja visual regression testing dla kluczowych widoków
