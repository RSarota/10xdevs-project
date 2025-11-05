Frontend - Astro z React dla komponentów interaktywnych:

- Astro 5 pozwala na tworzenie szybkich, wydajnych stron i aplikacji z minimalną ilością JavaScript
- React 19 zapewni interaktywność tam, gdzie jest potrzebna
- TypeScript 5 dla statycznego typowania kodu i lepszego wsparcia IDE
- Tailwind 4 pozwala na wygodne stylowanie aplikacji
- Shadcn/ui zapewnia bibliotekę dostępnych komponentów React, na których oprzemy UI

Backend - Supabase jako kompleksowe rozwiązanie backendowe:

- Zapewnia bazę danych PostgreSQL
- Zapewnia SDK w wielu językach, które posłużą jako Backend-as-a-Service
- Jest rozwiązaniem open source, które można hostować lokalnie lub na własnym serwerze
- Posiada wbudowaną autentykację użytkowników

AI - Komunikacja z modelami przez usługę Azure OpenAI Service

- Azure OpenAI Service – wykorzystanie modelu o3-mini do generowania treści edukacyjnych (np. fiszek) na podstawie danych wejściowych od użytkownika. Model obsługuje funkcję function calling, co pozwala na uzyskiwanie odpowiedzi w ustrukturyzowanym formacie JSON zgodnym ze zdefiniowanym schematem ({ front: string, back: string }).
- Schemat odpowiedzi – każda odpowiedź zawiera listę obiektów z polami front (maks. 200 znaków) i back (maks. 500 znaków), co umożliwia łatwą integrację z interfejsem użytkownika.
- Azure API Management – wystawienie publicznego API, które pośredniczy w komunikacji z modelem. Obsługuje walidację klucza API (x-api-key), ograniczenia liczby zapytań (rate limiting), limity użytkowania (quotas) oraz analitykę.

CI/CD i Hosting:

- Github Actions do tworzenia pipeline’ów CI/CD
- DigitalOcean do hostowania aplikacji za pośrednictwem obrazu docker
