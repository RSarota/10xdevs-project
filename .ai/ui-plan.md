# Architektura UI dla 10x-cards

## 1. Przegląd struktury UI

Architektura interfejsu użytkownika dla 10x-cards została podzielona na logiczne, oddzielne widoki, które odpowiadają kluczowym funkcjonalnościom aplikacji. Struktura została zaprojektowana tak, aby wspierać wyraźny podział między generowaniem fiszek a ich późniejszym zarządzaniem, a także zapewniać intuicyjną nawigację i responsywność dzięki Tailwind CSS oraz komponentom Shadcn/ui. Zastosowane podejście wspiera operacje CRUD, mechanizm lazy loading/infinite scroll oraz bezpieczną autoryzację z użyciem JWT.

## 2. Lista widoków

### 2.1. Ekran logowania i rejestracji

- **Ścieżka widoku:** `/login` oraz `/register`
- **Główny cel:** Umożliwienie użytkownikom logowania do systemu lub utworzenia nowego konta.
- **Kluczowe informacje:** Formularz wprowadzania adresu e-mail, hasła, walidacja poprawności danych oraz komunikaty błędów.
- **Kluczowe komponenty:** Formularz, pola input z walidacją inline, przyciski akcji, link do odzyskiwania hasła.
- **UX, dostępność i bezpieczeństwo:** Formularze zgodne z WCAG AA, możliwość wprowadzenia przez klawiaturę, obsługa błędów inline oraz komunikatów toast przy sukcesie/porazce, zabezpieczenie danych transmisyjnych.

### 2.2. Dashboard użytkownika

- **Ścieżka widoku:** `/dashboard`
- **Główny cel:** Przegląd statystyk konta, dostęp do nawigacji po innych funkcjonalnościach oraz szybki dostęp do najważniejszych operacji.
- **Kluczowe informacje:** Podsumowanie statystyk (liczba fiszek, sesje generacji, ostatnia aktywność), skróty do głównych sekcji.
- **Kluczowe komponenty:** Karty informacyjne, wykresy/statystyki, szybkie linki, nagłówek profilu.
- **UX, dostępność i bezpieczeństwo:** Czytelny layout, responsywność, elementy interaktywne zgodne z zasadami a11y oraz autoryzacja widoku dla zalogowanych użytkowników.

### 2.3. Widok generowania fiszek

- **Ścieżka widoku:** `/generate-flashcards`
- **Główny cel:** Umożliwienie użytkownikowi wprowadzenia długiego tekstu, przesłanie go do API generującego propozycje fiszek oraz prezentacja wyników.
- **Kluczowe informacje:** Pole tekstowe do wklejenia długiego tekstu (od 1000 do 10 000 znaków), przycisk generowania, wskaźnik postępu pracy, podsumowanie wyników (propozycje fiszek).
- **Kluczowe komponenty:** Formularz z tekstowym edytorem lub textarea, przycisk akcji, loader, lista propozycji (z możliwością edycji/akceptacji od razu po generacji).
- **UX, dostępność i bezpieczeństwo:** Walidacja długości tekstu, obsługa błędów (np. przekroczenie limitu, problemy z API), komunikaty toast dla błędów i sukcesu oraz zabezpieczenie transmisji danych.

### 2.4. Widok listy fiszek z funkcjonalnością zarządzania

- **Ścieżka widoku:** `/my-flashcards`
- **Główny cel:** Przegląd, edycja oraz usuwanie istniejących fiszek zgodnie z operacjami CRUD.
- **Kluczowe informacje:** Lista fiszek (z podziałem na typy: `manual`, `ai-full`, `ai-edited`), opcje sortowania, filtrowania, paginacji lub infinite scroll.
- **Kluczowe komponenty:** Tabela/lista fiszek, przyciski edycji/usunięcia, modal potwierdzenia, mechanizm lazy loading/infinite scroll.
- **UX, dostępność i bezpieczeństwo:** Intuicyjna nawigacja w obrębie listy, responsywność, pełna kontrola nad operacjami CRUD, mechanizm inline wyświetlania błędów oraz powiadomień toast, autoryzacja operacji edycji/usunięcia.

### 2.5. Widok ręcznego dodawania fiszki

- **Ścieżka widoku:** `/add-flashcard`
- **Główny cel:** Umożliwienie użytkownikowi manualnego tworzenia nowej fiszki.
- **Kluczowe informacje:** Formularz umożliwiający wprowadzenie dwóch głównych pól – "przód" (max 200 znaków) oraz "tył" (max 500 znaków), z odpowiednią walidacją oraz instrukcjami dla użytkownika.
- **Kluczowe komponenty:** Formularz z polami input (lub textarea w zależności od potrzeb), przycisk zapisu, komunikaty walidacyjne (inline) oraz powiadomienie toast przy pomyślnym dodaniu.
- **UX, dostępność i bezpieczeństwo:** Intuicyjny i prosty formularz zgodny z WCAG AA, wsparcie dla obsługi klawiaturą i odczytu ekranowego, sprawdzanie limitów znaków, zabezpieczenie danych przesyłanych do backendu.

### 2.6. Panel użytkownika

- **Ścieżka widoku:** `/profile`
- **Główny cel:** Zarządzanie danymi konta, ustawieniami oraz dostęp do historii sesji nauki.
- **Kluczowe informacje:** Dane profilu, ustawienia personalizacji, historia generacji i sesji nauki.
- **Kluczowe komponenty:** Formularze edycji, lista historii aktywności, sekcja ustawień.
- **UX, dostępność i bezpieczeństwo:** Łatwość edycji danych przy jednoczesnym zachowaniu standardów bezpieczeństwa, potwierdzenia operacji oraz komunikaty inline/toast.

### 2.7. Panel administratora

- **Ścieżka widoku:** `/admin`
- **Główny cel:** Dostęp do administracyjnych funkcji, takich jak przeglądanie logów błędów generacji oraz zarządzanie użytkownikami.
- **Kluczowe informacje:** Lista błędów API, historia generacji, zarządzanie użytkownikami.
- **Kluczowe komponenty:** Tabele z danymi, filtry, przyciski operacyjne (np. usuwanie błędnych wpisów), wykresy statystyk.
- **UX, dostępność i bezpieczeństwo:** Ograniczony dostęp tylko dla administratorów, mechanizm wyświetlania krytycznych błędów inline, paginacja, responsywność oraz zgodność z wytycznymi a11y.

### 2.8. Widok sesji powtórek

- **Ścieżka widoku:** `/session`
- **Główny cel:** Umożliwienie przeprowadzenia sesji nauki zgodnie z algorytmem spaced repetition.
- **Kluczowe informacje:** Kolejność fiszek do nauki, interakcja “przód → tył → ocena” oraz historia sesji.
- **Kluczowe komponenty:** Komponenty do prezentacji fiszek, przyciski interakcyjne do oceny, licznik postępów, modal do oceny lub podsumowania.
- **UX, dostępność i bezpieczeństwo:** Intuicyjne zarządzanie interakcjami, dostępność przy wysokim kontraście, obsługa klawiatury i czytelne komunikaty inline.

## 3. Mapa podróży użytkownika

1. Użytkownik trafia na ekran logowania/rejestracji – wprowadza dane i potwierdza autoryzację.
2. Po zalogowaniu użytkownik trafia do dashboardu, gdzie widzi podsumowanie kluczowych danych oraz skróty do głównych funkcjonalności.
3. Użytkownik wybiera widok generowania fiszek, wkleja długi tekst i inicjuje proces generacji przez API.
4. Po otrzymaniu propozycji, użytkownik przechodzi do widoku listy fiszek, aby zaakceptować, edytować bądź usunąć fiszki.
5. Użytkownik, który preferuje manualne tworzenie fiszki, przechodzi do widoku ręcznego dodawania fiszki i wprowadza dane do formularza.
6. Użytkownik może przejść do panelu swojego profilu w celu zarządzania danymi konta i przeglądu historii.
7. W przypadku roli administratora, dostępny jest dodatkowy panel do monitorowania logów błędów i zarządzania użytkownikami.
8. Użytkownik uruchamia sesję powtórek, gdzie interakcja z fiszkami odbywa się według algorytmu spaced repetition, a wyniki są zapisywane dla późniejszej analizy.

## 4. Układ i struktura nawigacji

- **Layout główny:** Wszystkie widoki, po zalogowaniu, będą opakowane w jedną wspólną strukturę (np. z nagłówkiem, paskiem bocznym oraz głównym panelem zawartości).
- **Menu nawigacyjne:** Intuicyjne menu boczne lub górne, umożliwiające szybkie przełączanie między dashboardem, fiszkami (zarówno generowanymi, jak i dodawanymi manualnie), profilem oraz panelami administracyjnymi (dla admina).
- **Nawigacja responsywna:** Menu przystosowane do urządzeń mobilnych z wykorzystaniem hamburger menu.
- **Wskaźniki stanu:** Komponenty do wyświetlania toast notifications dla komunikatów sukcesu i błędów oraz mechanizm inline do krytycznych błędów.

## 5. Kluczowe komponenty

- **Formularze:** Komponenty formularzy z odpowiednią walidacją (telefon, e-mail, hasło) oraz wsparciem dla obsługi błędów inline.
- **Lista i tabele:** Komponent do wyświetlania list fiszek z opcją paginacji lub lazy loading/infinite scroll.
- **Toast notifications:** Mechanizm wyświetlania komunikatów o operacjach, uwzględniający priorytet komunikatów (sukces vs. błąd).
- **Loader/Spinner:** Komponenty wizualizujące postęp operacji generacji oraz przetwarzania danych.
- **Modal dialogi:** Używane przy potwierdzeniach operacji (np. usuwanie fiszek) oraz wyświetlaniu szczegółowych informacji.
- **Nawigacja:** Pasek boczny/górny z linkami do kluczowych widoków oraz opcją wyszukiwania lub filtrowania danych.
- **Komponenty bezpieczeństwa:** Mechanizmy autoryzacji widoków, oparte na JWT i kontrola dostępu, wyświetlające komunikaty ostrzegawcze w przypadku błędów autoryzacyjnych.
