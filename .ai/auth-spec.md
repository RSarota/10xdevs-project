# Specyfikacja modułu autoryzacji (Rejestracja, Logowanie, Odzyskiwanie Hasła)

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1. Podział stron i layoutów

- W projekcie Astro strony są definiowane w folderze `src/pages`. Wprowadzamy nowe strony dedykowane funkcjom autoryzacyjnym:
  - `/auth/register` — strona rejestracji
  - `/auth/login` — strona logowania
  - `/auth/forgot-password` — strona inicjowania odzyskiwania hasła
  - opcjonalnie `/auth/reset-password` — strona ustawiania nowego hasła (po weryfikacji tokenu)
- Layouty są podzielone na dwie kategorie:
  - Layouty dla autoryzowanych (główny layout aplikacji) pozostają niezmienione
  - Layouty dla stron autoryzacyjnych — prostsza wersja, bez dodatkowych elementów interfejsu dostępnych po zalogowaniu (np. pasek nawigacyjny dla użytkowników)

### 1.2. Komponenty interfejsu (Client-side React)

- Formularze rejestracji, logowania i odzyskiwania hasła zostaną zaimplementowane jako komponenty React umieszczone w `src/components/auth` lub `src/components/ui`.
- Każdy formularz będzie zawierał:
  - Pola do wprowadzania danych (np. e-mail, hasło, potwierdzenie hasła)
  - Walidację po stronie klienta — weryfikację poprawności formatu, długości haseł, zgodności danych itp.
  - Dynamiczne komunikaty błędów i wskazówki (np. „Podaj poprawny adres e-mail” lub „Hasło musi zawierać minimum 8 znaków”)
- Komponenty będą komunikowały się z backendem poprzez wywołania API (`fetch`/`axios`), przekazując dane w formacie JSON, a następnie wyświetlały zwrócone komunikaty o błędach lub sukcesie.

### 1.3. Scenariusze użytkownika

- Rejestracja:
  - Użytkownik wypełnia formularz rejestracyjny.
  - Natychmiastowa walidacja pól (np. format e-maila).
  - Po zatwierdzeniu dane są przesyłane do endpointu API.
  - Po rejestracji użytkownik otrzyma e-mail z linkiem aktywacyjnym. Konto zostanie aktywowane dopiero po potwierdzeniu adresu e-mail.
- Logowanie:
  - Formularz logowania waliduje obecność wymaganych pól.
  - Po przesłaniu danych następuje próba autoryzacji; w przypadku nieprawidłowych danych wyświetlany jest komunikat: „Nieprawidłowy e-mail lub hasło”.
- Odzyskiwanie hasła:
  - Użytkownik podaje e-mail.
  - System wysyła link resetujący hasło (przez Supabase Auth).
  - Na dedykowanej stronie użytkownik wpisuje nowe hasło, z odpowiednią walidacją.
- Usuwanie konta:
  - Endpoint: `DELETE /auth/delete-account`
  - Opis: Umożliwia usunięcie konta użytkownika wraz z powiązanymi danymi. Operacja wymaga uwierzytelnienia oraz potwierdzenia (np. przesłania tokenu lub dodatkowego potwierdzenia w ciele żądania).

## 2. LOGIKA BACKENDOWA

### 2.1. Struktura endpointów API

- Endpointy API odpowiedzialne za obsługę autoryzacji znajdują się w folderze `src/pages/api/auth/`:
  - `register.ts` — obsługa rejestracji użytkownika
  - `login.ts` — obsługa logowania
  - `logout.ts` — obsługa wylogowania użytkownika
  - `forgot-password.ts` — inicjowanie procesu odzyskiwania hasła
  - opcjonalnie `reset-password.ts` — finalizacja resetu hasła
- Wszystkie endpointy korzystają z istniejącego klienta Supabase (`src/db/supabase.client.ts`).

### 2.2. Walidacja danych wejściowych

- Walidacja odbywa się na dwóch poziomach:
  - Po stronie klienta w komponentach React, aby zapewnić szybką informację zwrotną dla użytkownika.
  - Po stronie serwera w endpointach API przed przetworzeniem danych. Weryfikacja obejmuje:
    - Poprawność formatu e-maila
    - Minimalną długość hasła oraz kryteria złożoności
    - Spójność danych (np. porównanie hasła i potwierdzenia hasła)
- W przypadku wykrycia błędów endpointy zwracają uporządkowany komunikat błędu w formacie JSON, który front-end potrafi wyświetlić.

### 2.3. Obsługa wyjątków

- Każdy endpoint zawiera mechanizmy `try-catch` umożliwiające przechwycenie nieoczekiwanych błędów.
- W przypadku błędów — logowanie do systemu monitoringu oraz zwracanie przyjaznych komunikatów (bez ujawniania szczegółów implementacyjnych).
- Obsługa specyficznych błędów Supabase Auth (np. duplikat adresu e-mail, nieprawidłowe hasło).

### 2.4. Renderowanie stron (SSR) i konfiguracja Astro

- Serwer renderowany przez Astro (zgodnie z konfiguracją w `astro.config.mjs`) będzie dynamicznie dostosowywał widok w zależności od stanu autoryzacji użytkownika.
- Strony autoryzacyjne będą renderowane po stronie serwera z uproszczonym layoutem, integrując się z mechanizmami routingu Astro.

## 3. SYSTEM AUTENTYKACJI

### 3.1. Wykorzystanie Supabase Auth

- Cała logika autentykacji (rejestracja, logowanie, wylogowywanie, odzyskiwanie hasła) opiera się na mechanizmach Supabase Auth.
- Integracja przebiega poprzez wywołania metod takich jak:
  - `supabase.auth.signUp` przy rejestracji
  - `supabase.auth.signIn` przy logowaniu
  - `supabase.auth.api.resetPasswordForEmail` przy inicjacji odzyskiwania hasła
  - `supabase.auth.signOut` przy wylogowaniu

### 3.2. Integracja interfejsu z backendem

- Interfejs użytkownika (React) komunikuje się z endpointami API napisanymi w Astro.
- Sesje użytkowników są zarządzane przy użyciu ciasteczek (`cookies`) z Supabase Auth.
- Mechanizm SSR pozwala na ochronę stron przed nieautoryzowanym dostępem (np. przekierowanie na stronę logowania, gdy sesja wygaśnie).

### 3.3. Kontrakty i interfejsy

- Wspólne typy i interfejsy (np. `User`, `AuthResponse`, `AuthError`) definiowane są w `src/types.ts` i wykorzystywane po stronie serwera i klienta, gwarantując spójność danych.
- Kontrakty odpowiedzi API przewidują pola:
  - `success`: boolean
  - `data`: obiekt (w przypadku powodzenia)
  - `error`: string lub obiekt błędów

## Kluczowe wnioski

- Rozdzielenie odpowiedzialności: frontend (React/Astro) zajmuje się formularzowaniem i walidacją, backend (endpointy API) przetwarza logikę i komunikuje się z Supabase Auth.
- Dwupoziomowa walidacja: błędy wychwytywane zarówno po stronie klienta, jak i serwera.
- Integracja z Supabase: wykorzystanie natywnych mechanizmów autoryzacyjnych Supabase.
- SSR: dynamiczne dostosowanie widoków do stanu autoryzacji użytkownika.
