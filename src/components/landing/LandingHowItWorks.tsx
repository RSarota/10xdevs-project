import { Container, Stack, Title1, Body, Grid, Card, CardContent, Divider } from "../apple-hig";
import { LANDING_STEPS } from "@/lib/landing-data";

const colorClasses = {
  blue: "bg-[hsl(var(--apple-blue))]",
  green: "bg-[hsl(var(--apple-green))]",
  purple: "bg-[hsl(var(--apple-purple))]",
};

export function LandingHowItWorks() {
  return (
    <>
      <Divider />
      <Container
        size="xl"
        className="py-[var(--apple-space-12)] sm:py-[var(--apple-space-16)] lg:py-[var(--apple-space-20)]"
      >
        <Stack direction="vertical" spacing="xl">
          <Stack direction="vertical" spacing="md" align="center" className="text-center max-w-3xl mx-auto">
            <Title1 className="text-3xl sm:text-4xl lg:text-5xl">Jak to działa?</Title1>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-base sm:text-lg">
              Zacznij tworzyć fiszki w trzech prostych krokach
            </Body>
          </Stack>

          <Grid columns={1} gap="lg" className="sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {LANDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} elevation="md" padding="xl" variant="grouped">
                  <CardContent>
                    <Stack direction="vertical" spacing="md" align="center" className="text-center">
                      <div
                        className={`w-16 h-16 flex items-center justify-center rounded-full ${colorClasses[step.color]} text-white shadow-lg`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <Stack direction="vertical" spacing="sm">
                        <Title1 className="text-xl sm:text-2xl">{step.title}</Title1>
                        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base">
                          {step.description}
                        </Body>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
