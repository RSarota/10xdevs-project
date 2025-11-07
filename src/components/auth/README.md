# Komponenty Autoryzacji

Ten folder zawiera komponenty React odpowiedzialne za interfejs użytkownika procesu autoryzacji (logowanie, rejestracja, odzyskiwanie hasła).

## Komponenty

### LoginForm

Formularz logowania użytkownika.

**Funkcjonalność:**
- Walidacja adresu e-mail i hasła po stronie klienta
- Wyświetlanie błędów walidacji i komunikatów z API
- Stan ładowania podczas wysyłania żądania
- Link do strony odzyskiwania hasła
- Link do strony rejestracji

**Użycie:**
```tsx
import { LoginForm } from "@/components/auth";

<LoginForm onSuccess={() => window.location.href = "/dashboard"} />
```

### RegisterForm

Formularz rejestracji nowego użytkownika.

**Funkcjonalność:**
- Walidacja imienia, e-maila i hasła
- Sprawdzanie siły hasła (minimum 8 znaków, wielka/mała litera, cyfra)
- Weryfikacja zgodności hasła i jego potwierdzenia
- Wyświetlanie komunikatu o wysłaniu e-maila aktywacyjnego
- Link do strony logowania

**Użycie:**
```tsx
import { RegisterForm } from "@/components/auth";

<RegisterForm onSuccess={() => console.log("Rejestracja zakończona")} />
```

### ForgotPasswordForm

Formularz inicjowania procesu odzyskiwania hasła.

**Funkcjonalność:**
- Walidacja adresu e-mail
- Wyświetlanie komunikatu o wysłaniu linku resetującego
- Możliwość ponownego wysłania e-maila
- Link powrotny do strony logowania

**Użycie:**
```tsx
import { ForgotPasswordForm } from "@/components/auth";

<ForgotPasswordForm onSuccess={() => console.log("E-mail wysłany")} />
```

### ResetPasswordForm

Formularz ustawiania nowego hasła po kliknięciu w link z e-maila.

**Funkcjonalność:**
- Ekstrakcja tokenu z URL
- Walidacja nowego hasła (minimum 8 znaków, wielka/mała litera, cyfra)
- Weryfikacja zgodności hasła i jego potwierdzenia
- Obsługa wygasłego lub nieprawidłowego tokenu
- Automatyczne przekierowanie do strony logowania po sukcesie

**Użycie:**
```tsx
import { ResetPasswordForm } from "@/components/auth";

<ResetPasswordForm onSuccess={() => window.location.href = "/auth/login"} />
```

## Walidacja

Wszystkie formularze zawierają dwupoziomową walidację:
1. **Walidacja po stronie klienta** - natychmiastowa informacja zwrotna dla użytkownika
2. **Walidacja po stronie serwera** - w endpointach API (do zaimplementowania)

## Style

Komponenty wykorzystują system Apple Human Interface Guidelines (HIG):
- Komponenty z `@/components/apple-hig` (Input, Button, Stack, Body)
- Ikony z biblioteki `lucide-react`
- Tailwind CSS z custom properties

## Komunikacja z API

Formularze wysyłają żądania do następujących endpointów:
- `POST /api/auth/login` - logowanie
- `POST /api/auth/register` - rejestracja
- `POST /api/auth/forgot-password` - inicjacja resetowania hasła
- `POST /api/auth/reset-password` - finalizacja resetowania hasła

**Uwaga:** Endpointy API wymagają implementacji na backendzie.

## Strony Astro

Odpowiadające strony Astro znajdują się w `src/pages/auth/`:
- `/auth/login` - strona logowania
- `/auth/register` - strona rejestracji
- `/auth/forgot-password` - strona odzyskiwania hasła
- `/auth/reset-password` - strona resetowania hasła

## Layout

Strony autoryzacji używają uproszczonego layoutu `AuthLayout.astro`, który zawiera:
- Minimalistyczny nagłówek z logo i przełącznikiem motywu
- Wyśrodkowaną zawartość formularza
- Stopkę z informacjami o prawach autorskich


