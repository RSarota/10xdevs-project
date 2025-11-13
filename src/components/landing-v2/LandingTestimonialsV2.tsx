import { Star, Quote } from "lucide-react";
import { Container, Stack, Title1, Body, Grid, Card, CardContent, Badge, Divider } from "../apple-hig";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Anna Kowalska",
    role: "Studentka medycyny",
    company: "Uniwersytet Warszawski",
    content:
      "10xCards całkowicie zmieniło moje podejście do nauki. Generowanie fiszek z notatek zajmuje mi teraz sekundy zamiast godzin. Algorytm spaced repetition pomaga mi zapamiętywać nawet najbardziej skomplikowane terminy medyczne.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michał Nowak",
    role: "Frontend Developer",
    company: "Tech Startup",
    content:
      "Jako developer muszę ciągle się uczyć nowych technologii. 10xCards pozwala mi szybko tworzyć fiszki z dokumentacji i artykułów technicznych. AI genruje naprawdę dobre pytania, które pomagają mi lepiej zrozumieć nowe koncepty.",
    rating: 5,
  },
  {
    id: 3,
    name: "Katarzyna Wiśniewska",
    role: "Nauczycielka języka angielskiego",
    content:
      "Używam 10xCards do tworzenia materiałów dla moich uczniów. Mogę szybko przekształcić lekcje w interaktywne fiszki. Uczniowie uwielbiają tę metodę nauki, a ja oszczędzam mnóstwo czasu na przygotowywaniu materiałów.",
    rating: 5,
  },
  {
    id: 4,
    name: "Tomasz Lewandowski",
    role: "MBA Student",
    company: "SGH",
    content:
      "Przygotowuję się do egzaminów MBA i 10xCards jest niezastąpione. Wklejam fragmenty z książek biznesowych, a AI tworzy mi fiszki z kluczowymi pojęciami. System przypomina mi o powtórkach w idealnych momentach.",
    rating: 5,
  },
  {
    id: 5,
    name: "Magdalena Zielińska",
    role: "Studentka prawa",
    company: "Uniwersytet Jagielloński",
    content:
      "Prawo to ogromna ilość faktów do zapamiętania. 10xCards pomaga mi przekształcić kodeksy i orzeczenia w przystępne fiszki. Dzięki temu moje wyniki na egzaminach znacznie się poprawiły.",
    rating: 5,
  },
  {
    id: 6,
    name: "Jakub Czarnecki",
    role: "Data Scientist",
    company: "Fintech",
    content:
      "Uczę się machine learning i 10xCards jest idealnym narzędziem do zapamiętywania algorytmów i wzorów matematycznych. Mogę tworzyć fiszki z dokumentacji naukowych i artykułów research.",
    rating: 5,
  },
];

export function LandingTestimonialsV2() {
  return (
    <>
      <Divider />
      <div className="relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--apple-blue)/0.02)] to-transparent" />

        <Container size="xl" className="relative py-16 sm:py-20 lg:py-24">
          <Stack direction="vertical" spacing="xl">
            {/* Section Header */}
            <Stack direction="vertical" spacing="md" align="center" className="text-center max-w-4xl mx-auto">
              <Badge color="blue" variant="filled" size="lg" className="animate-fade-in">
                <Star className="w-4 h-4" />
                Opinie użytkowników
              </Badge>
              <Title1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
                Ponad{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                  1,000 zadowolonych
                </span>{" "}
                użytkowników
              </Title1>
              <Body className="text-[hsl(var(--apple-label-secondary))] text-lg sm:text-xl max-w-3xl">
                Dołącz do społeczności studentów, profesjonalistów i nauczycieli, którzy już odkryli moc efektywnej
                nauki z 10xCards
              </Body>
            </Stack>

            {/* Testimonials Grid */}
            <Grid columns={3} gap="lg" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  elevation="md"
                  padding="xl"
                  variant="grouped"
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full"
                  style={{
                    animation: `fadeInScale 0.6s ease-out`,
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <CardContent>
                    <Stack direction="vertical" spacing="lg" className="h-full">
                      {/* Quote icon and stars */}
                      <div className="flex items-center justify-between">
                        <Quote className="w-8 h-8 text-[hsl(var(--apple-blue))] opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-[hsl(var(--apple-yellow))] text-[hsl(var(--apple-yellow))]"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Body className="text-[hsl(var(--apple-label))] text-sm sm:text-base leading-relaxed italic">
                          &ldquo;{testimonial.content}&rdquo;
                        </Body>
                      </div>

                      {/* Author info */}
                      <div className="pt-4 border-t border-[hsl(var(--apple-separator-opaque))]">
                        <div className="flex items-start gap-3">
                          {/* Avatar placeholder */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--apple-blue)/0.1)] to-[hsl(var(--apple-purple)/0.1)] flex items-center justify-center flex-shrink-0">
                            <span className="text-[hsl(var(--apple-blue))] font-semibold text-lg">
                              {testimonial.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[hsl(var(--apple-label))] font-semibold text-sm sm:text-base">
                              {testimonial.name}
                            </p>
                            <p className="text-[hsl(var(--apple-label-secondary))] text-xs sm:text-sm">
                              {testimonial.role}
                            </p>
                            {testimonial.company && (
                              <p className="text-[hsl(var(--apple-label-tertiary))] text-xs">{testimonial.company}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {/* Bottom CTA */}
            <div className="text-center pt-8">
              <Body className="text-[hsl(var(--apple-label-secondary))] text-base">
                Chcesz dołączyć do zadowolonych użytkowników?{" "}
                <span className="text-[hsl(var(--apple-blue))] font-semibold">
                  Rozpocznij swoją przygodę z efektywną nauką już dziś
                </span>
              </Body>
            </div>
          </Stack>
        </Container>
      </div>
    </>
  );
}
