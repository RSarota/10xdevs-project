# Notatki dotyczące integracji z ts-fsrs

## 1. Biblioteka open source

**Nazwa:** `ts-fsrs` (Free Spaced Repetition Scheduler)  
**Repozytorium:** https://github.com/open-spaced-repetition/ts-fsrs  
**Instalacja:** `npm install ts-fsrs`

## 2. Dlaczego FSRS zamiast SM-2?

- **Nowoczesny algorytm:** FSRS jest oparty na modelu DSR (Difficulty, Stability, Retrievability) i jest bardziej zaawansowany niż klasyczny SM-2
- **Lepsze wyniki:** Badania pokazują, że FSRS osiąga lepsze wyniki w optymalizacji interwałów powtórek
- **Aktywnie rozwijany:** Projekt jest częścią społeczności Open Spaced Repetition
- **TypeScript native:** Pełne wsparcie dla TypeScript, co idealnie pasuje do stacku projektu

## 3. Mapowanie pól użytkownika do FSRS

Użytkownik ocenia fiszki w skali 1-5, które są konwertowane do Rating enum FSRS:

- **1 (Bardzo trudne)** → `Rating.Again` (1)
- **2 (Trudne)** → `Rating.Hard` (2)
- **3 (Średnie)** → `Rating.Good` (3)
- **4 (Dobre)** → `Rating.Good` (3)
- **5 (Łatwe)** → `Rating.Easy` (4)

## 4. Struktura danych FSRS

Biblioteka ts-fsrs używa następujących pól w obiekcie Card:

```typescript
interface Card {
  due: Date; // Data następnej powtórki
  stability: number; // Stabilność (zastępuje ease_factor z SM-2)
  difficulty: number; // Trudność (0-1)
  elapsed_days: number; // Dni od ostatniej powtórki
  scheduled_days: number; // Zaplanowany interwał
  reps: number; // Liczba powtórek
  lapses: number; // Liczba błędów
  state: number; // Stan: New=0, Learning=1, Review=2, Relearning=3
  last_review?: Date; // Data ostatniej powtórki
}
```

## 5. Główne funkcje biblioteki

### 5.1. Tworzenie nowej karty

```typescript
import { createEmptyCard } from "ts-fsrs";

const newCard = createEmptyCard();
// Zwraca kartę z domyślnymi wartościami dla nowej fiszki
```

### 5.2. Aktualizacja karty po ocenie

```typescript
import { FSRS, Rating } from "ts-fsrs";

const fsrs = new FSRS();
const result = fsrs.repeat(currentCard, new Date(), Rating.Good);
// result.card zawiera zaktualizowaną kartę
// result.log zawiera informacje o zmianach
```

## 6. Konfiguracja FSRS

FSRS można skonfigurować przy inicjalizacji:

```typescript
import { FSRS, createEmptyCard } from "ts-fsrs";

// Domyślna konfiguracja
const fsrs = new FSRS();

// Lub z własnymi parametrami (opcjonalnie)
const fsrs = new FSRS({
  request_retention: 0.9, // Docelowa retencja (0-1)
  maximum_interval: 36500, // Maksymalny interwał w dniach
  w: [
    /* wektor wag */
  ], // Zaawansowane parametry
});
```

## 7. Integracja z bazą danych

Pola w tabeli `session_flashcards` są mapowane bezpośrednio z obiektu Card FSRS:

- `next_review_at` ← `card.due`
- `stability` ← `card.stability`
- `difficulty` ← `card.difficulty`
- `review_count` ← `card.reps`
- `lapses` ← `card.lapses`
- `state` ← `card.state`
- `last_review` ← `card.last_review`
- `elapsed_days` ← `card.elapsed_days`
- `scheduled_days` ← `card.scheduled_days`

## 8. Zalety użycia ts-fsrs

1. **Brak potrzeby implementacji algorytmu** - gotowe rozwiązanie
2. **Sprawdzone i przetestowane** - używane w wielu projektach
3. **Regularne aktualizacje** - algorytm jest ciągle ulepszany
4. **Dokumentacja** - pełna dokumentacja API
5. **TypeScript support** - pełne typy TypeScript
6. **Lekka biblioteka** - minimalne zależności

## 9. Migracja z SM-2 (jeśli potrzebna)

Jeśli w przyszłości będzie potrzeba migracji istniejących danych z SM-2 do FSRS:

1. Dla istniejących fiszek można użyć `createEmptyCard()` i rozpocząć od nowa
2. Lub można spróbować oszacować początkowe wartości FSRS na podstawie istniejących danych SM-2
3. FSRS może działać równolegle z danymi SM-2 (różne kolumny w bazie)

## 10. Testowanie

Biblioteka ts-fsrs jest dobrze przetestowana, ale warto przetestować:

- Konwersję ocen użytkownika do Rating enum
- Mapowanie danych z/do bazy danych
- Obsługę błędów biblioteki
- Graniczne przypadki (pierwsza powtórka, wiele błędów, itp.)
