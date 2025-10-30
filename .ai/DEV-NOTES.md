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
- [ ] **GET** `/api/flashcards/{id}` - Pobierz pojedynczą fiszkę
- [ ] **POST** `/api/flashcards` - Utwórz fiszkę/fiszki (single lub bulk, manual lub AI-generated)
- [ ] **PATCH** `/api/flashcards/{id}` - Zaktualizuj istniejącą fiszkę
- [ ] **DELETE** `/api/flashcards/{id}` - Usuń pojedynczą fiszkę
- [ ] **POST** `/api/flashcards/bulk-delete` - Usuń wiele fiszek jednocześnie

### 🟢 AI Generation (3 endpointy)

- [ ] **POST** `/api/generations` - Wygeneruj propozycje fiszek przy użyciu AI
- [ ] **GET** `/api/generations` - Pobierz historię generacji użytkownika
- [ ] **GET** `/api/generations/{id}` - Pobierz szczegóły konkretnej sesji generacji

### 🟡 Error Logs & Monitoring (1 endpoint)

- [ ] **GET** `/api/generation-errors` - Pobierz logi błędów generacji (admin/debugging)

### 🟣 Statistics & Analytics (1 endpoint)

- [ ] **GET** `/api/users/me/statistics` - Pobierz statystyki użytkownika

---

## 📊 Podsumowanie

- ✅ **Zaimplementowane:** 1 / 11 endpointów (9%)
- ⏳ **Do zrobienia:** 10 endpointów

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

