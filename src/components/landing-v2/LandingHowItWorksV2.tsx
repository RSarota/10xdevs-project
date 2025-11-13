import { Container, Stack, Title1, Body, Grid, Card, CardContent, Divider } from "../apple-hig";
import { LANDING_STEPS } from "@/lib/landing-data";

const colorClasses = {
  blue: "from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-blue-dark))]",
  green: "from-[hsl(var(--apple-green))] to-[hsl(var(--apple-green))]",
  purple: "from-[hsl(var(--apple-purple))] to-[hsl(var(--apple-purple))]",
};

export function LandingHowItWorksV2() {
  return (
    <>
      <Divider />
      <Container
        size="xl"
        className="py-[var(--apple-space-20)] sm:py-[var(--apple-space-24)] lg:py-[var(--apple-space-28)]"
      >
        <Stack direction="vertical" spacing="xl">
          {/* Section Header */}
          <Stack direction="vertical" spacing="md" align="center" className="text-center max-w-4xl mx-auto">
            <Title1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">Jak to działa?</Title1>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-lg sm:text-xl max-w-3xl">
              Trzy proste kroki do efektywnej nauki
            </Body>
          </Stack>

          {/* Steps */}
          <Grid columns={3} gap="lg" className="sm:grid-cols-3">
            {LANDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connection Line (desktop only) */}
                  {index < LANDING_STEPS.length - 1 && (
                    <div
                      className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[hsl(var(--apple-blue)/0.3)] to-transparent -z-10"
                      style={{ width: "calc(100% - 4rem)", left: "calc(100% - 2rem)" }}
                    />
                  )}

                  <Card
                    elevation="md"
                    padding="xl"
                    variant="grouped"
                    className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  >
                    <CardContent>
                      <Stack direction="vertical" spacing="lg" align="center" className="text-center">
                        {/* Step Number Badge */}
                        <div
                          className={`w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br ${colorClasses[step.color]} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-10 h-10" />
                        </div>

                        {/* Content */}
                        <Stack direction="vertical" spacing="sm">
                          <Title1 className="text-2xl sm:text-3xl font-bold">{step.title}</Title1>
                          <Body className="text-[hsl(var(--apple-label-secondary))] text-base sm:text-lg leading-relaxed">
                            {step.description}
                          </Body>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
