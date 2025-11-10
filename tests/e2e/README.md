# E2E Tests - Environment Variables

## Wymagane zmienne środowiskowe

Testy E2E używają zmiennych środowiskowych z pliku `.env.test`. Poniżej znajduje się lista wszystkich zmiennych i ich zastosowanie.

### Wymagane zmienne (krytyczne)

#### `E2E_USERNAME`

- **Opis**: Email użytkownika testowego, który już istnieje w bazie integracyjnej
- **Użycie**: Używany w testach wymagających autoryzacji (logowanie, dashboard, fiszki, profil)
- **Przykład**: `E2E_USERNAME=test@example.com`

#### `E2E_USER_PASSWORD`

- **Opis**: Hasło użytkownika testowego
- **Użycie**: Używany razem z `E2E_USERNAME` do logowania w testach
- **Przykład**: `E2E_USER_PASSWORD=Test1234!`

### Wymagane zmienne dla teardown

#### `E2E_USERNAME_ID`

- **Opis**: ID użytkownika testowego w bazie danych
- **Użycie**: **WYMAGANE** dla automatycznego teardown - używane do usuwania fiszek testowych po zakończeniu testów
- **Status**: **WYMAGANE** dla testów które tworzą fiszki (flashcards tests)
- **Rekomendacja**: Ustaw tę zmienną aby włączyć automatyczne czyszczenie danych testowych

### Zmienne używane przez aplikację (nie bezpośrednio przez testy)

Następujące zmienne są używane przez aplikację podczas uruchamiania serwera deweloperskiego, ale **nie są bezpośrednio używane przez testy E2E**:

#### `SUPABASE_URL`

- **Opis**: URL projektu Supabase
- **Użycie**: Używane przez aplikację do połączenia z bazą danych
- **Status**: **NIE JEST BEZPOŚREDNIO UŻYWANE** w testach E2E (aplikacja używa ich automatycznie)

#### `SUPABASE_KEY`

- **Opis**: Klucz anonimowy Supabase
- **Użycie**: Używane przez aplikację do autoryzacji w Supabase
- **Status**: **NIE JEST BEZPOŚREDNIO UŻYWANE** w testach E2E (aplikacja używa ich automatycznie)

#### `OPENAI_URL`

- **Opis**: URL endpointu OpenAI/Azure OpenAI
- **Użycie**: Używane przez aplikację do generowania fiszek przez AI
- **Status**: **NIE JEST BEZPOŚREDNIO UŻYWANE** w testach E2E (aplikacja używa ich automatycznie)

#### `OPENAI_API_KEY`

- **Opis**: Klucz API OpenAI/Azure OpenAI
- **Użycie**: Używane przez aplikację do autoryzacji w OpenAI
- **Status**: **NIE JEST BEZPOŚREDNIO UŻYWANE** w testach E2E (aplikacja używa ich automatycznie)

## Podsumowanie

### Wymagane dla testów E2E:

- ✅ `E2E_USERNAME` - **WYMAGANE** (autoryzacja)
- ✅ `E2E_USER_PASSWORD` - **WYMAGANE** (autoryzacja)
- ✅ `E2E_USERNAME_ID` - **WYMAGANE** (teardown - automatyczne czyszczenie danych testowych)

### Wymagane dla aplikacji (ale nie bezpośrednio przez testy):

- `SUPABASE_URL` - używane przez aplikację
- `SUPABASE_KEY` - używane przez aplikację
- `OPENAI_URL` - używane przez aplikację
- `OPENAI_API_KEY` - używane przez aplikację

## Uwaga

**Użytkownik zdefiniowany w `E2E_USERNAME` i `E2E_USER_PASSWORD` musi już istnieć w bazie integracyjnej.** Testy zakładają, że użytkownik jest już zarejestrowany i może się zalogować.

## Teardown

Testy automatycznie usuwają wszystkie rekordy użytkownika testowego po zakończeniu każdego testu. Teardown usuwa rekordy z wszystkich tabel przypisanych do użytkownika:

- **flashcards** - przez API endpoint `/api/flashcards/bulk-delete`
- **generations** - przez Supabase REST API
- **generation_error_logs** - przez Supabase REST API

Teardown używa:

- `E2E_USERNAME_ID` - do identyfikacji użytkownika testowego
- `SUPABASE_URL` i `SUPABASE_KEY` - do bezpośrednich zapytań do Supabase REST API
- API endpoints - do usuwania fiszek (wymaga autoryzacji przez storageState)
- **Nie wymaga** `SUPABASE_SERVICE_ROLE_KEY` - teardown używa autoryzowanych żądań API zamiast admin key

Teardown jest implementowany przez `@E2ETeardown` (funkcja `teardownE2E`) w `tests/e2e/utils/e2e-teardown.ts`.

## Przykładowy plik `.env.test`

```env
# Wymagane dla testów E2E
E2E_USERNAME=test@example.com
E2E_USER_PASSWORD=Test1234!

# Wymagane dla teardown (automatyczne czyszczenie danych testowych)
E2E_USERNAME_ID=123e4567-e89b-12d3-a456-426614174000

# Wymagane dla aplikacji (używane automatycznie przez serwer deweloperski)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
OPENAI_URL=https://your-openai-endpoint.openai.azure.com
OPENAI_API_KEY=your-api-key
```
