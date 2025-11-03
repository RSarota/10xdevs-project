# Schemat bazy danych PostgreSQL – 10x-cards

## 1. Tabele i kolumny

### a. Tabela: flashcards

- **id** – PRIMARY KEY, typ: BIGSERIAL
- **user_id** – FOREIGN KEY odwołujący się do tabeli użytkowników (zarządzanej przez Supabase), typ: UUID
- **generation_id** – (opcjonalnie) FOREIGN KEY do tabeli generations, typ: BIGINT
- **type** – typ fiszki, ograniczony do wartości: ai-full, ai-edited, manual. Może być zdefiniowany jako kolumna typu ENUM lub ograniczony TEXT
- **front** – tekst przodu fiszki, typ: VARCHAR(200) dla wszystkich fiszek (manual i AI-generated)
- **back** – tekst tyłu fiszki, typ: VARCHAR(500) dla wszystkich fiszek (manual i AI-generated)
- **created_at** – timestamp z informacją o dacie utworzenia, domyślnie ustawiany na aktualny czas
- **updated_at** – timestamp z informacją o ostatniej modyfikacji, aktualizowany przy każdej zmianie rekordu

### b. Tabela: generations

- **id** – PRIMARY KEY, typ: BIGSERIAL
- **user_id** – FOREIGN KEY odwołujący się do tabeli użytkowników (zarządzanej przez Supabase), typ: UUID
- **generated_count** – liczba fiszek wygenerowanych w procesie, typ: INTEGER
- **accepted_unedited_count** – liczba zaakceptowanych fiszek bez edycji, typ: INTEGER
- **accepted_edited_count** – liczba zaakceptowanych fiszek po edycji, typ: INTEGER
- **source_text_hash** – hash tekstu źródłowego (np. SHA256), typ: VARCHAR(64)
- **source_text_length** – długość tekstu źródłowego w znakach, typ: INTEGER
- **generation_duration** – czas trwania generowania w milisekundach, typ: INTEGER
- **created_at** – timestamp z informacją o dacie utworzenia, domyślnie ustawiany na aktualny czas
- **updated_at** – timestamp z informacją o ostatniej modyfikacji, aktualizowany przy każdej zmianie rekordu

### c. Tabela: generation_error_logs

- **id** – PRIMARY KEY, typ: BIGSERIAL
- **user_id** – FOREIGN KEY odwołujący się do tabeli użytkowników (zarządzanej przez Supabase), typ: UUID
- **source_text_hash** – hash tekstu źródłowego (np. SHA256), typ: VARCHAR(64)
- **source_text_length** – długość tekstu źródłowego w znakach, typ: INTEGER
- **error_code** – kod błędu (np. API_TIMEOUT, INVALID_RESPONSE), typ: VARCHAR(50)
- **error_message** – szczegółowy komunikat błędu, typ: TEXT
- **created_at** – timestamp z informacją o dacie utworzenia, domyślnie ustawiany na aktualny czas

## 2. Relacje między tabelami

- Tabela flashcards ma relację wiele-do-jednego z tabelą użytkowników – każdy użytkownik może mieć wiele fiszek.
- Jeśli fiszka pochodzi z operacji AI, wpis w tabeli flashcards może wskazywać poprzez kolumnę generation_id na rekord w tabeli generations. Jeden rekord generacji może być powiązany z wieloma fiszkami (wszystkie fiszki wygenerowane w jednej operacji).
- Tabela generations ma relację wiele-do-jednego z tabelą użytkowników – każdy użytkownik może mieć wiele procesów generowania.
- Tabela generation_error_logs ma relację wiele-do-jednego z tabelą użytkowników – każdy użytkownik może mieć wiele błędów generowania.

## 3. Indeksy

### Tabela flashcards

- Indeks na kolumnie user_id do przyspieszenia zapytań filtrowanych po użytkowniku.
- Indeks na kolumnie type do ułatwienia filtrowania rekordów według typu fiszki.
- Indeks na kolumnie generation_id do szybkiego znajdowania fiszek z danego procesu generowania.
- Indeks na kolumnach created_at i updated_at do sortowania i filtrowania wg. dat.

### Tabela generations

- Indeks na kolumnie user_id do przyspieszenia zapytań filtrowanych po użytkowniku.
- Indeks na kolumnie source_text_hash do szybkiego wyszukiwania duplikatów generowania.
- Indeks na kolumnie created_at do sortowania i analizy historii generowania.

### Tabela generation_error_logs

- Indeks na kolumnie user_id do przyspieszenia zapytań filtrowanych po użytkowniku.
- Indeks na kolumnie error_code do analizy typów błędów.
- Indeks na kolumnie created_at do sortowania i analizy historii błędów.

## 4. Zasady PostgreSQL (RLS)

- W tabeli flashcards wdrożyć politykę row-level security (RLS) zapewniającą, że użytkownik ma dostęp jedynie do swoich danych (np. poprzez porównanie user_id rekordu z identyfikatorem użytkownika sesji).
- W tabeli generations wdrożyć RLS, aby statystyki generowania były widoczne tylko dla użytkownika, który je wygenerował.
- W tabeli generation_error_logs wdrożyć RLS, aby logi błędów były widoczne tylko dla użytkownika, którego dotyczą.

## 5. Dodatkowe uwagi projektowe

- Definicja tabeli users nie jest zawarta w tym schemacie, gdyż zarządzana jest przez Supabase. Klucz user_id w innych tabelach musi być zgodny z kluczem głównym tabeli users (UUID).
- Jeśli wybieramy typ ENUM dla kolumny type, należy utworzyć typ ENUM z wartościami: ai-full, ai-edited, manual.
- Tabela generations przechowuje statystyki dotyczące każdej operacji generowania fiszek przez AI, co pozwala na monitorowanie metryk sukcesu produktu (np. procent akceptacji fiszek).
- Tabela generation_error_logs służy do śledzenia problemów z generowaniem, co ułatwia debugowanie i monitorowanie stabilności integracji z API AI.
- Hash tekstu źródłowego (source_text_hash) pozwala na identyfikację powtarzających się prób generowania z tego samego tekstu oraz optymalizację kosztów (możliwość cache'owania).
- Czas trwania generowania (generation_duration) umożliwia monitorowanie wydajności API i identyfikację problemów z czasem odpowiedzi.
- Schemat został zaprojektowany z myślą o prostocie na etapie MVP, z możliwością późniejszej rozbudowy, np. o dodatkowe metadane czy indeksy funkcjonalne dla bardziej złożonych zapytań.
- Projekt uwzględnia skalowalność oraz wydajność dzięki odpowiedniemu indeksowaniu kluczowych kolumn i wdrożeniu RLS.
