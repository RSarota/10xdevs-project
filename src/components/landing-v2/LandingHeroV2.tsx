import { Sparkles, ArrowRight, LogIn } from "lucide-react";
import { Button, Stack, Badge, LargeTitle, Title2, Body, Container, Divider } from "../apple-hig";
import { Logo } from "../Logo";

interface LandingHeroV2Props {
  onRegister: () => void;
  onLogin: () => void;
}

export function LandingHeroV2({ onRegister, onLogin }: LandingHeroV2Props) {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--apple-blue)/0.05)] via-transparent to-[hsl(var(--apple-purple)/0.05)]" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--apple-blue)/0.1)] rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[hsl(var(--apple-purple)/0.1)] rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <Container size="xl" className="relative pt-8 pb-8 sm:pt-12 sm:pb-12 lg:pt-16 lg:pb-16 xl:pt-20 xl:pb-20">
        <Stack direction="vertical" spacing="xl" align="center" className="text-center">
          {/* Logo - Responsive Size */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="relative">
              <Logo size={80} variant="gradient" className="sm:w-24 sm:h-24 lg:w-28 lg:h-28 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--apple-blue)/0.3)] to-[hsl(var(--apple-purple)/0.3)] rounded-full blur-2xl -z-10 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                10xCards
              </span>
            </div>
          </div>

          <Stack direction="vertical" spacing="lg" align="center" className="max-w-5xl">
            {/* Badge */}
            <Badge color="blue" variant="filled" size="lg" className="animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </Badge>

            {/* Main Headline - Better mobile typography */}
            <LargeTitle className="text-[hsl(var(--apple-label))] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight px-4 sm:px-0">
              Ucz się mądrzej,
              <br />
              <span className="bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                nie dłużej
              </span>
            </LargeTitle>

            {/* Subtitle - Better spacing and size */}
            <Title2 className="text-[hsl(var(--apple-label-secondary))] font-normal max-w-3xl text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed px-4 sm:px-0">
              Przekształć dowolny tekst w fiszki do nauki za pomocą sztucznej inteligencji. Oszczędź czas i ucz się
              efektywniej z algorytmem spaced repetition.
            </Title2>

            {/* CTA Buttons - Fixed mobile layout */}
            <div className="mt-6 w-full max-w-md mx-auto px-4 sm:px-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center sm:max-w-none">
                <Button
                  variant="filled"
                  color="blue"
                  size="large"
                  onClick={onRegister}
                  className="group shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto sm:min-w-[200px] h-[3.25rem] flex-1 sm:flex-none"
                >
                  <Sparkles className="w-5 h-5" />
                  Rozpocznij za darmo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="default"
                  color="blue"
                  size="large"
                  onClick={onLogin}
                  className="hover:bg-[hsl(var(--apple-fill))]/30 transition-all w-full sm:w-auto h-[3.25rem] flex-1 sm:flex-none"
                >
                  <LogIn className="w-5 h-5" />
                  Zaloguj się
                </Button>
              </div>
            </div>

            {/* Trust indicators - Better mobile layout */}
            <Body
              as="div"
              className="text-[hsl(var(--apple-label-tertiary))] text-xs sm:text-sm mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 sm:px-0"
            >
              <div className="flex items-center gap-2">
                <span>✓ Bez karty kredytowej</span>
                <span className="hidden sm:inline text-[hsl(var(--apple-separator-opaque))]">•</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓ Bez zobowiązań</span>
                <span className="hidden sm:inline text-[hsl(var(--apple-separator-opaque))]">•</span>
              </div>
              <span>✓ Natychmiastowy start</span>
            </Body>
          </Stack>

          {/* Visual Element - Floating Cards Preview - Better mobile layout */}
          <div className="mt-12 sm:mt-16 lg:mt-20 relative w-full max-w-7xl mx-auto px-4 sm:px-0">
            <div className="relative rounded-2xl overflow-hidden border border-[hsl(var(--apple-separator-opaque))] bg-gradient-to-br from-[hsl(var(--apple-grouped-bg-secondary))] to-[hsl(var(--apple-grouped-bg))] shadow-2xl p-6 sm:p-8 lg:p-12">
              {/* Title */}
              <div className="text-center mb-6 sm:mb-8">
                <p className="text-[hsl(var(--apple-label-secondary))] text-xs sm:text-sm uppercase tracking-wider font-semibold mb-2">
                  Przykładowe fiszki wygenerowane przez AI
                </p>
              </div>

              {/* Flashcard Grid - Responsive layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    front: "Co to jest spaced repetition?",
                    back: "Metoda nauki polegająca na powtarzaniu materiału w coraz dłuższych odstępach czasu, co zwiększa efektywność zapamiętywania.",
                    type: "AI",
                  },
                  {
                    front: "React Hooks",
                    back: "Funkcje pozwalające na użycie stanu i innych funkcji Reacta w komponentach funkcyjnych. Przykłady: useState, useEffect, useContext.",
                    type: "AI",
                  },
                  {
                    front: "TypeScript",
                    back: "Nadzbiór JavaScript dodający statyczne typowanie, co pomaga w wykrywaniu błędów przed uruchomieniem kodu.",
                    type: "Smart",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-[hsl(var(--apple-grouped-bg))] rounded-xl border border-[hsl(var(--apple-separator-opaque))] shadow-lg transform hover:scale-105 transition-all duration-300 overflow-hidden"
                    style={{
                      animation: `float 3s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    {/* Badge */}
                    <div className="px-4 pt-4 pb-2">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[hsl(var(--apple-blue)/0.1)] text-[hsl(var(--apple-blue))] text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        {card.type}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3 sm:space-y-4">
                      {/* Front */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--apple-blue))]" />
                          <p className="text-xs uppercase tracking-wider text-[hsl(var(--apple-label-secondary))] font-semibold">
                            Przód
                          </p>
                        </div>
                        <p className="text-[hsl(var(--apple-label))] font-medium text-sm sm:text-base leading-relaxed">
                          {card.front}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[hsl(var(--apple-separator-opaque))]" />

                      {/* Back */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--apple-green))]" />
                          <p className="text-xs uppercase tracking-wider text-[hsl(var(--apple-label-secondary))] font-semibold">
                            Tył
                          </p>
                        </div>
                        <p className="text-[hsl(var(--apple-label))] text-sm sm:text-base leading-relaxed line-clamp-3">
                          {card.back}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Stack>
      </Container>
      <Divider />
    </div>
  );
}
