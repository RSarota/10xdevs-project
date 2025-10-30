# API Endpoint Implementation Plan: Get All Flashcards

## 1. Przegląd punktu końcowego
Endpoint GET /api/flashcards umożliwia pobranie wszystkich fiszek przypisanych do uwierzytelnionego użytkownika. Endpoint filtruje dane za pomocą opcjonalnych parametrów zapytania i stosuje paginację oraz sortowanie.

## 2. Szczegóły żądania
- **Metoda HTTP:** GET
- **Struktura URL:** `/api/flashcards`
- **Parametry:** 
  - **Wymagane:** Brak parametrów obowiązkowych (poza tokenem autoryzacyjnym w nagłówkach).
  - **Opcjonalne:** 
    - `type` – filtracja typów fiszek (`ai-full`, `ai-edited`, `manual`)
    - `generation_id` – filtracja według identyfikatora sesji generacji
    - `page` – numer strony (domyślnie 1)
    - `limit` – ilość rekordów na stronę (domyślnie 50, maksymalnie 100)
    - `sort_by` – pole sortowania (`created_at`, `updated_at`; domyślnie `created_at`)
    - `sort_order` – kolejność sortowania (`asc` lub `desc`; domyślnie `desc`)
- **Nagłówki:** 
  - `Authorization: Bearer {token}`

## 3. Wykorzystywane typy
- **FlashcardDTO:** Reprezentuje rekord z tabeli `flashcards` (zdefiniowany w `src/types.ts`).
- **UserStatisticsDTO:** (jeśli wymagane dodatkowo przy pobieraniu statystyk) - nie dotyczy bezpośrednio tego endpointa, ale jest dostępny.
- Brak modeli Command, ponieważ endpoint jest typu GET i nie przyjmuje ciała żądania.

## 4. Przepływ danych
1. Klient wysyła żądanie GET do `/api/flashcards` wraz z nagłówkiem `Authorization`.
2. Serwer weryfikuje token i identyfikuje użytkownika.
3. Parametry zapytania są walidowane przy użyciu Zod.
4. Logika biznesowa jest delegowana do serwisu (np. `flashcardsService`) w folderze `src/lib/services`, który buduje zapytanie SQL z filtrami, paginacją i sortowaniem.
5. Dane są pobierane z bazy danych (`flashcards`) stosownie do indeksów i pól.
6. Serwis zwraca listę fiszek oraz informacje o paginacji, które następnie są przesyłane w odpowiedzi.

## 5. Względy bezpieczeństwa
- Uwierzytelnienie: Wymagane sprawdzenie tokena w nagłówku `Authorization`.
- Autoryzacja: Upewnienie się, że użytkownik pobiera tylko swoje dane (RLS lub filtracja po user_id).

## 6. Obsługa błędów
- **401 Unauthorized:** Brak lub nieprawidłowy token autoryzacyjny.
- **400 Bad Request:** Nieprawidłowe dane w parametrach zapytania (np. niewłaściwe wartości `sort_by`, `sort_order`, `limit` lub `page`).
- **500 Internal Server Error:** Błąd w serwerze lub w logice biznesowej.
- W przypadku braku wyników zwrócenie 200 z pustą listą danych.

## 7. Rozważania dotyczące wydajności
- Implementacja paginacji, aby uniknąć przeciążenia serwera przy pobieraniu dużych ilości danych.
- Wykorzystywanie indeksów w bazie danych (m.in. `user_id`, `type`, `generation_id`, `created_at` i `updated_at`) dla szybkiego wykonywania zapytań.

## 8. Etapy wdrożenia
1. **Utworzenie pliku endpointa:**
   - Utworzyć plik w `src/pages/api/flashcards.ts`.
2. **Walidacja i autoryzacja:**
   - Skonfigurować sprawdzanie tokena oraz walidację parametrów przy użyciu Zod.
3. **Implementacja logiki biznesowej:**
   - Wyodrębnić logikę pobierania danych do serwisu w `src/lib/services/flashcards.service.ts`.
   - Zaimplementować funkcję przyjmującą filtry, paginację i sortowanie.
4. **Interakcja z bazą danych:**
   - Zbudować zapytanie SQL do pobierania rekordów z tabeli `flashcards` z uwzględnieniem limitów i offsetu.
5. **Obsługa błędów:**
   - Zaimplementować mechanizmy obsługi błędów, logowania oraz zwracania odpowiednich kodów statusu.
7. **Dokumentacja:**
   - Uaktualnić dokumentację API, aby zawierała nowy endpoint oraz opisy parametrów, modeli danych i przykładów odpowiedzi.
