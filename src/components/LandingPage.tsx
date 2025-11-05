import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";
import { Sparkles, Brain, Zap, BookOpen, Target, TrendingUp } from "lucide-react";

// Apple HIG Components
import {
  Button,
  Stack,
  NavigationBar,
  Container,
  LargeTitle,
  Title1,
  Title2,
  Body,
  Card,
  CardContent,
  Grid,
  Badge,
  Divider,
} from "./apple-hig";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleRegister = () => {
    window.location.href = "/register";
  };

  const handleDemo = () => {
    window.location.href = "/generate-flashcards";
  };

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Generowanie AI",
      description: "Wklej tekst, a sztuczna inteligencja automatycznie wygeneruje fiszki do nauki",
      badge: "AI",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Inteligentna nauka",
      description: "System dostosowuje się do Twojego postępu i skupia na trudniejszych materiałach",
      badge: "Smart",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Szybkie tworzenie",
      description: "Dodawaj fiszki ręcznie lub generuj dziesiątki w kilka sekund",
      badge: "Fast",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Fiszek wygenerowanych" },
    { value: "95%", label: "Wskaźnik akceptacji AI" },
    { value: "< 30s", label: "Średni czas generacji" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Navigation Bar */}
      <NavigationBar
        title={
          <div className="flex items-center gap-2">
            <Logo size={32} variant="default" />
            <span>10xCards</span>
          </div>
        }
        blur
        shadow
        rightAction={<ThemeToggle />}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <Container size="xl" className="py-[var(--apple-space-16)] sm:py-[var(--apple-space-20)]">
          <Stack direction="vertical" spacing="xl" align="center" className="min-h-[70vh] justify-center">
            {/* Hero Content */}
            <Stack direction="vertical" spacing="lg" align="center" className="text-center max-w-4xl px-4">
              <Badge color="blue" variant="filled" size="lg">
                <Sparkles className="w-4 h-4" />
                Powered by AI
              </Badge>

              <LargeTitle className="text-[hsl(var(--apple-label))] text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Ucz się mądrzej,
                <br />
                nie dłużej
              </LargeTitle>

              <Title2 className="text-[hsl(var(--apple-label-secondary))] font-normal max-w-2xl text-lg sm:text-xl">
                Przekształć dowolny tekst w fiszki do nauki za pomocą sztucznej inteligencji. Oszczędź czas i ucz się
                efektywniej.
              </Title2>

              {/* CTA Buttons */}
              <Stack direction="horizontal" spacing="md" className="mt-[var(--apple-space-6)] flex-wrap justify-center">
                <Button variant="filled" color="blue" size="large" onClick={handleRegister}>
                  <Sparkles className="w-5 h-5" />
                  Rozpocznij za darmo
                </Button>
                <Button variant="default" color="blue" size="large" onClick={handleLogin}>
                  Zaloguj się
                </Button>
              </Stack>

              <Body className="text-[hsl(var(--apple-label-tertiary))] text-sm mt-[var(--apple-space-2)]">
                Bez karty kredytowej • Bez zobowiązań
              </Body>
            </Stack>

            {/* Stats */}
            <div className="w-full mt-[var(--apple-space-16)]">
              <Grid columns={1} gap="md" className="sm:grid-cols-3 max-w-5xl mx-auto px-4">
                {stats.map((stat, index) => (
                  <Card key={index} elevation="md" padding="lg" variant="grouped">
                    <CardContent>
                      <Stack direction="vertical" spacing="xs" align="center">
                        <Title1 className="text-[hsl(var(--apple-blue))] text-3xl sm:text-4xl">{stat.value}</Title1>
                        <Body className="text-[hsl(var(--apple-label-secondary))] text-center text-sm sm:text-base">
                          {stat.label}
                        </Body>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </div>
          </Stack>
        </Container>

        <Divider />

        {/* Features Section */}
        <Container size="xl" className="py-[var(--apple-space-16)] sm:py-[var(--apple-space-20)]">
          <Stack direction="vertical" spacing="xl">
            <Stack direction="vertical" spacing="md" align="center" className="text-center px-4">
              <Title1 className="text-3xl sm:text-4xl">Wszystko czego potrzebujesz do efektywnej nauki</Title1>
              <Body className="text-[hsl(var(--apple-label-secondary))] max-w-2xl text-base sm:text-lg">
                Nasza platforma łączy moc sztucznej inteligencji z prostotą użytkowania
              </Body>
            </Stack>

            <Grid columns={1} gap="lg" className="sm:grid-cols-3 px-4">
              {features.map((feature, index) => (
                <Card key={index} elevation="md" padding="xl" variant="grouped">
                  <CardContent>
                    <Stack direction="vertical" spacing="md" align="start">
                      <Stack direction="horizontal" justify="between" align="start" className="w-full">
                        <div className="w-14 h-14 flex items-center justify-center rounded-[var(--apple-radius-large)] bg-[hsl(var(--apple-blue)/0.1)] text-[hsl(var(--apple-blue))]">
                          {feature.icon}
                        </div>
                        <Badge color="blue" variant="filled" size="sm">
                          {feature.badge}
                        </Badge>
                      </Stack>
                      <Stack direction="vertical" spacing="sm">
                        <Title2 className="text-xl sm:text-2xl">{feature.title}</Title2>
                        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base">
                          {feature.description}
                        </Body>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>

        <Divider />

        {/* How it works Section */}
        <Container size="xl" className="py-[var(--apple-space-16)] sm:py-[var(--apple-space-20)]">
          <Stack direction="vertical" spacing="xl">
            <Stack direction="vertical" spacing="md" align="center" className="text-center px-4">
              <Title1 className="text-3xl sm:text-4xl">Jak to działa?</Title1>
              <Body className="text-[hsl(var(--apple-label-secondary))] max-w-2xl text-base sm:text-lg">
                Zacznij tworzyć fiszki w trzech prostych krokach
              </Body>
            </Stack>

            <Grid columns={1} gap="lg" className="sm:grid-cols-3 max-w-5xl mx-auto px-4">
              <Card elevation="md" padding="xl" variant="grouped">
                <CardContent>
                  <Stack direction="vertical" spacing="md" align="center" className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[hsl(var(--apple-blue))] text-white shadow-lg">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <Stack direction="vertical" spacing="sm">
                      <Title2 className="text-xl sm:text-2xl">1. Wklej tekst</Title2>
                      <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base">
                        Skopiuj materiał do nauki - notatkę, artykuł lub fragment książki
                      </Body>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation="md" padding="xl" variant="grouped">
                <CardContent>
                  <Stack direction="vertical" spacing="md" align="center" className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[hsl(var(--apple-green))] text-white shadow-lg">
                      <Target className="w-8 h-8" />
                    </div>
                    <Stack direction="vertical" spacing="sm">
                      <Title2 className="text-xl sm:text-2xl">2. Przejrzyj fiszki</Title2>
                      <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base">
                        AI wygeneruje fiszki - akceptuj, edytuj lub odrzuć każdą z nich
                      </Body>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation="md" padding="xl" variant="grouped">
                <CardContent>
                  <Stack direction="vertical" spacing="md" align="center" className="text-center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[hsl(var(--apple-purple))] text-white shadow-lg">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <Stack direction="vertical" spacing="sm">
                      <Title2 className="text-xl sm:text-2xl">3. Rozpocznij naukę</Title2>
                      <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base">
                        Ucz się w swoim tempie i śledź postępy w czasie rzeczywistym
                      </Body>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Stack>
        </Container>

        <Divider />

        {/* Final CTA Section */}
        <Container size="xl" className="py-[var(--apple-space-16)] sm:py-[var(--apple-space-20)]">
          <div className="px-4">
            <Card elevation="lg" padding="xl" variant="grouped">
              <CardContent>
                <Stack
                  direction="vertical"
                  spacing="lg"
                  align="center"
                  className="text-center py-[var(--apple-space-8)]"
                >
                  <Stack direction="vertical" spacing="md">
                    <Title1 className="text-3xl sm:text-4xl">Gotowy, aby zacząć?</Title1>
                    <Body className="text-[hsl(var(--apple-label-secondary))] max-w-xl text-base sm:text-lg">
                      Dołącz do tysięcy studentów, którzy już uczą się mądrzej dzięki AI
                    </Body>
                  </Stack>
                  <Stack direction="horizontal" spacing="md" className="flex-wrap justify-center">
                    <Button variant="filled" color="blue" size="large" onClick={handleRegister}>
                      <Sparkles className="w-5 h-5" />
                      Utwórz darmowe konto
                    </Button>
                    <Button variant="default" color="blue" size="large" onClick={handleDemo}>
                      Zobacz demo
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </div>
        </Container>

        {/* Footer */}
        <Container size="xl" className="py-[var(--apple-space-10)]">
          <Stack direction="vertical" spacing="md" align="center" className="text-center">
            <Body className="text-[hsl(var(--apple-label-tertiary))] text-sm">
              © 2025 10xCards. Wszystkie prawa zastrzeżone.
            </Body>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
