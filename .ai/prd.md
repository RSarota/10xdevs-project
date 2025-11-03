# Dokument wymagań produktu (PRD) - 10x-cards

## 1. Przegląd produktu

10x-cards to aplikacja webowa umożliwiająca użytkownikom szybkie tworzenie i zarządzanie fiszkami edukacyjnymi. System wspiera dwa tryby: ręczne tworzenie fiszek oraz automatyczne generowanie przy użyciu modelu językowego (LLM) poprzez API. Celem projektu jest dostarczenie prostego, dostępnego narzędzia wspierającego naukę metodą powtórek (spaced repetition).

## 2. Problem użytkownika

Tworzenie fiszek edukacyjnych jest czasochłonne i wymaga dużego zaangażowania. Użytkownicy często rezygnują z tej metody nauki, mimo jej wysokiej skuteczności. Aplikacja 10x-cards ma na celu:

- Skrócenie czasu potrzebnego na tworzenie fiszek.
- Ułatwienie zarządzania materiałem do nauki.
- Zwiększenie dostępności metody spaced repetition.

## 3. Wymagania funkcjonalne

### 3.1. Generowanie fiszek przez AI

- Użytkownik wkleja tekst (od 1000 do 10 000 znaków).
- Aplikacja przesyła tekst do modelu LLM przez API.
- Model zwraca propozycje fiszek (przód–tył).
- Użytkownik może zaakceptować, edytować lub odrzucić każdą fiszkę.
- Zatwierdzone fiszki są zapisywane w bazie danych.

### 3.2. Ręczne tworzenie i edycja fiszek

- Formularz do ręcznego dodawania fiszek.
- Widok listy „Moje fiszki” z opcją edycji i usuwania.

### 3.3. Uwierzytelnianie i konta użytkowników

- Rejestracja, logowanie
- Możliwość usunięcia konta i powiązanych danych.
- Dane logowania przechowywane w bezpieczny sposób.

### 3.4. Sesja nauki (powtórki)

- Integracja z prostym algorytmem spaced repetition.
- Widok sesji nauki: przód fiszki → interakcja → tył → ocena → kolejna fiszka.

### 3.5. Historia sesji nauki

- Użytkownik może przeglądać historię swoich sesji nauki.
- Historia zawiera datę sesji, liczbę fiszek, ocenę przyswojenia.
- Widok historii dostępny z poziomu konta użytkownika.

### 3.6. Prywatność i bezpieczeństwo

- Fiszki są dostępne tylko dla zalogowanego użytkownika.
- Brak możliwości współdzielenia fiszek.
- Dane przechowywane zgodnie z obowiązującymi przepisami.

### 3.7. Statystyki i logi

- Zbieranie danych o liczbie wygenerowanych fiszek i decyzjach użytkownika (akceptacja/odrzucenie).
- Logi zapisywane w bazie danych.

## 4. Granice produktu

### 4.1. Poza zakresem MVP

- Aplikacja mobilna.
- Gamifikacja.
- Publiczne API.
- Współdzielenie fiszek.
- Zaawansowane wyszukiwanie.
- Rozbudowany system powiadomień.
- Panel administratora.
- Zaawansowane analityki.

## 5. Historyjki użytkowników

### US-001

Tytuł: Rejestracja konta
Opis: Jako nowy użytkownik chcę się zarejestrować i potwierdzić adres e-mail, aby mieć dostęp do własnych fiszek i móc korzystać z generowania fiszek przez AI.
Kryteria akceptacji:

- Formularz rejestracyjny zawiera pola na adres e-mail i hasło.
- Po wypełnieniu formularza użytkownik otrzymuje e-mail z linkiem aktywacyjnym.
- Kliknięcie linku aktywuje konto.
- Użytkownik otrzymuje potwierdzenie rejestracji i może się zalogować.

### US-002

Tytuł: Logowanie do aplikacji  
Opis: Jako zarejestrowany użytkownik chcę móc się zalogować, aby mieć dostęp do moich fiszek i historii generowania.  
Kryteria akceptacji:

- Po podaniu prawidłowych danych użytkownik zostaje zalogowany.
- Błędne dane wyświetlają komunikat o nieprawidłowych danych.

### US-003

Tytuł: Generowanie fiszek przy użyciu AI  
Opis: Jako zalogowany użytkownik chcę wkleić tekst i wygenerować propozycje fiszek, aby zaoszczędzić czas na ręcznym tworzeniu.  
Kryteria akceptacji:

- Pole tekstowe przyjmuje od 1000 do 10 000 znaków.
- Po kliknięciu przycisku generowania aplikacja komunikuje się z API.
- Użytkownik otrzymuje listę propozycji fiszek.
- W przypadku błędu API wyświetlany jest komunikat.

### US-004

Tytuł: Przegląd i zatwierdzanie propozycji fiszek  
Opis: Jako użytkownik chcę przeglądać wygenerowane fiszki i decydować, które dodać do mojego zestawu.  
Kryteria akceptacji:

- Lista fiszek zawiera opcje: zatwierdź, edytuj, odrzuć.
- Zatwierdzone fiszki są zapisywane w bazie danych.

### US-005

Tytuł: Edycja fiszek  
Opis: Jako użytkownik chcę edytować moje fiszki, aby poprawić błędy lub dostosować treść.  
Kryteria akceptacji:

- Widok listy fiszek zawiera opcję edycji.
- Zmiany są zapisywane po zatwierdzeniu.

### US-006

Tytuł: Usuwanie fiszek  
Opis: Jako użytkownik chcę usuwać zbędne fiszki, aby zachować porządek.  
Kryteria akceptacji:

- Widok listy fiszek zawiera opcję usunięcia.
- Usunięcie wymaga potwierdzenia.
- Fiszka zostaje trwale usunięta.

### US-007

Tytuł: Ręczne tworzenie fiszek  
Opis: Jako użytkownik chcę ręcznie tworzyć fiszki, aby dodawać własny materiał.  
Kryteria akceptacji:

- Formularz zawiera pola „Przód” i „Tył”.
- Pole „Przód” akceptuje maksymalnie 200 znaków.
- Pole „Tył” akceptuje maksymalnie 500 znaków.
- W przypadku przekroczenia limitu znaków użytkownik otrzymuje komunikat o błędzie.
- Po zapisaniu fiszka pojawia się na liście „Moje fiszki”.

### US-008

Tytuł: Sesja nauki z algorytmem powtórek  
Opis: Jako użytkownik chcę uczyć się fiszek zgodnie z algorytmem spaced repetition.  
Kryteria akceptacji:

- Widok sesji nauki prezentuje fiszki zgodnie z harmonogramem.
- Użytkownik ocenia przyswojenie po każdej fiszce.

### US-009

Tytuł: Bezpieczny dostęp do danych  
Opis: Jako użytkownik chcę mieć pewność, że moje fiszki są prywatne i bezpieczne.  
Kryteria akceptacji:

- Tylko zalogowany użytkownik ma dostęp do swoich fiszek.
- Brak dostępu do fiszek innych użytkowników.

### US-010

Tytuł: Usunięcie konta  
Opis: Jako użytkownik chcę mieć możliwość usunięcia mojego konta i danych.  
Kryteria akceptacji:

- Widoczna opcja usunięcia konta.
- Operacja wymaga potwierdzenia.
- Konto i dane zostają usunięte.

### US-011

Tytuł: Historia sesji nauki  
Opis: Jako użytkownik chcę mieć dostęp do historii moich sesji nauki, aby śledzić postępy.  
Kryteria akceptacji:

- Widok historii zawiera datę sesji, liczbę fiszek i ocenę przyswojenia.
- Historia jest dostępna z poziomu konta użytkownika.

## 6. Metryki sukcesu

- Co najmniej 75% nowych fiszek tworzonych przez użytkowników pochodzi z generowania AI.
- Co najmniej 75% wygenerowanych przez AI fiszek jest akceptowanych przez użytkowników.
