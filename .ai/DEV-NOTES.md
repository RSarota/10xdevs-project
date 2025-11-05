# Development TODO List

## ⚠️ Tymczasowe uproszczenia - Development Mode

Na etapie developmentu:

1. Używamy `DEFAULT_USER_ID` zamiast pełnej autoryzacji Bearer token
2. **RLS (Row Level Security) jest WYŁĄCZONY** - migracja `20251030000000_disable_rls_for_development.sql`
3. Testowy użytkownik i fiszki są automatycznie dodawane przez `supabase/seed.sql`

---

## 📋 API Endpoints - Postęp implementacji

### 🔵 Flashcard Management (6 endpointów)

- [x] **GET** `/api/flashcards` - Pobierz wszystkie fiszki z filtrowaniem, paginacją i sortowaniem
- [x] **GET** `/api/flashcards/{id}` - Pobierz pojedynczą fiszkę
- [x] **POST** `/api/flashcards` - Utwórz fiszkę/fiszki (single lub bulk, manual lub AI-generated)
- [x] **PATCH** `/api/flashcards/{id}` - Zaktualizuj istniejącą fiszkę
- [x] **DELETE** `/api/flashcards/{id}` - Usuń pojedynczą fiszkę
- [x] **POST** `/api/flashcards/bulk-delete` - Usuń wiele fiszek jednocześnie

### 🟢 AI Generation (3 endpointy)

- [x] **POST** `/api/generations` - Wygeneruj propozycje fiszek przy użyciu AI _(Mock AI - zwraca 10 propozycji)_
- [x] **GET** `/api/generations` - Pobierz historię generacji użytkownika _(paginacja, sortowanie)_
- [x] **GET** `/api/generations/{id}` - Pobierz szczegóły konkretnej sesji generacji _(z listą fiszek)_

### 🟡 Error Logs & Monitoring (1 endpoint)

- [x] **GET** `/api/generation-errors` - Pobierz logi błędów generacji _(paginacja, filtrowanie po error_code)_

### 🟣 Statistics & Analytics (1 endpoint)

- [x] **GET** `/api/users/me/statistics` - Pobierz statystyki użytkownika _(fiszki, generacje, wskaźniki)_

---

## 📊 Podsumowanie

- ✅ **Zaimplementowane:** 11 / 11 endpointów (100%) - **KOMPLETNE!** 🎉
  - ✅ **Flashcard Management:** 6 / 6 endpointów (100%) - **KOMPLETNE**
  - ✅ **AI Generation:** 3 / 3 endpointów (100%) - **KOMPLETNE**
  - ✅ **Error Logs:** 1 / 1 endpoint (100%) - **KOMPLETNE**
  - ✅ **Statistics:** 1 / 1 endpoint (100%) - **KOMPLETNE**
- 🚀 **Gotowe do testowania:** Wszystkie endpointy REST API

---

## 📋 Nowo zaimplementowane endpointy

### 1. GET `/api/generations` - Historia generacji

**Pliki:**

- `src/pages/api/generations.ts` (rozszerzenie o GET)
- `src/lib/schemas/generation.schema.ts` (GetGenerationsQuerySchema)
- `src/lib/services/generations.service.ts` (getGenerations)

**Funkcjonalności:**

- ✅ Paginacja (page, limit: 1-50, domyślnie 20)
- ✅ Sortowanie (sort_order: asc/desc, domyślnie desc)
- ✅ Filtrowanie po user_id
- ✅ Walidacja Zod dla query params

### 2. GET `/api/generations/{id}` - Szczegóły generacji

**Pliki:**

- `src/pages/api/generations/[id].ts`
- `src/lib/services/generations.service.ts` (getGenerationById)

**Funkcjonalności:**

- ✅ Szczegóły pojedynczej sesji generacji
- ✅ Lista powiązanych fiszek (type: ai-full, ai-edited)
- ✅ Sortowanie fiszek chronologicznie
- ✅ Walidacja ownership (user_id)
- ✅ Obsługa 404 Not Found

### 3. GET `/api/generation-errors` - Logi błędów

**Pliki:**

- `src/pages/api/generation-errors.ts`
- `src/lib/schemas/generation-error.schema.ts` (GetGenerationErrorsQuerySchema)
- `src/lib/services/generation-errors.service.ts` (getErrors)

**Funkcjonalności:**

- ✅ Paginacja (page, limit: 1-50, domyślnie 20)
- ✅ Filtrowanie po error_code (opcjonalne)
- ✅ Sortowanie po created_at DESC
- ✅ Walidacja Zod

### 4. GET `/api/users/me/statistics` - Statystyki użytkownika

**Pliki:**

- `src/pages/api/users/me/statistics.ts`
- `src/lib/services/statistics.service.ts` (getUserStatistics)

**Funkcjonalności:**

- ✅ Statystyki fiszek (total, by_type: manual/ai-full/ai-edited)
- ✅ Statystyki generacji (total_sessions, total_generated, total_accepted)
- ✅ Wskaźniki (acceptance_rate, edit_rate) w %
- ✅ Zabezpieczenie przed dzieleniem przez 0
- ✅ Zaokrąglanie do 2 miejsc po przecinku

---

## 🤖 Mock AI Service - Tymczasowa implementacja

> **Uwaga:** Endpoint POST `/api/generations` używa obecnie **mock AI service** do symulacji generowania fiszek przez Azure OpenAI.

### Aktualny mock (`src/lib/services/ai.service.ts`):

- ✅ Zwraca zawsze **10 propozycji fiszek**
- ✅ Symuluje opóźnienie sieciowe (100-500ms)
- ✅ Format odpowiedzi: `{ front: string, back: string }[]`

### Co działa:

- ✅ Walidacja input (1000-10000 znaków)
- ✅ Obliczanie SHA-256 hash tekstu źródłowego
- ✅ Pomiar czasu generowania (`generation_duration`)
- ✅ Zapis metadanych do tabeli `generations`
- ✅ Logowanie błędów do `generation_error_logs`

### TODO - Prawdziwa integracja z AI:

- [ ] Skonfigurować Azure OpenAI API
- [ ] Skonfigurować Azure API Management
- [ ] Dodać zmienne środowiskowe (API keys, endpoints)
- [ ] Zastąpić mock prawdziwym wywołaniem API
- [ ] Zaimplementować retry logic z exponential backoff
- [ ] Dodać rate limiting na poziomie aplikacji
- [ ] Zaimplementować caching wyników (opcjonalnie)

---

## 🔐 TODO: Wdrożenie pełnej autoryzacji i bezpieczeństwa

> **Uwaga:** Obecnie wszystkie endpointy używają `DEFAULT_USER_ID` i RLS jest wyłączony. Pełna autoryzacja zostanie wdrożona później.

### Autoryzacja

- [ ] Skonfigurować Supabase Auth w projekcie
- [ ] Stworzyć rejestrację użytkowników (Sign Up)
- [ ] Stworzyć logowanie użytkowników (Sign In)
- [ ] Zaimplementować mechanizm odświeżania tokenów
- [ ] Przywrócić sprawdzanie Authorization header we wszystkich endpointach
- [ ] Usunąć `DEFAULT_USER_ID` z `supabase.client.ts`
- [ ] Zaktualizować frontend do obsługi tokenów
- [ ] Przetestować flow autoryzacji end-to-end

### Bezpieczeństwo

- [ ] **WŁĄCZYĆ RLS** - usunąć migrację `20251030000000_disable_rls_for_development.sql`
- [ ] Sprawdzić wszystkie polityki RLS
- [ ] Usunąć `supabase/seed.sql` (dane testowe)
- [ ] Zaktualizować wszystkie testy
- [ ] Zaktualizować dokumentację API
