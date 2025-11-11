import { Container, Stack, Title1, Body, Grid, Card, CardContent, Badge, Divider } from "../apple-hig";
import { LANDING_FEATURES } from "@/lib/landing-data";

export function LandingFeatures() {
  return (
    <>
      <Divider />
      <Container
        size="xl"
        className="py-[var(--apple-space-12)] sm:py-[var(--apple-space-16)] lg:py-[var(--apple-space-20)]"
      >
        <Stack direction="vertical" spacing="xl">
          <Stack direction="vertical" spacing="md" align="center" className="text-center max-w-3xl mx-auto">
            <Title1 className="text-3xl sm:text-4xl lg:text-5xl">
              Wszystko czego potrzebujesz do efektywnej nauki
            </Title1>
            <Body className="text-[hsl(var(--apple-label-secondary))] text-base sm:text-lg">
              Nasza platforma łączy moc sztucznej inteligencji z prostotą użytkowania
            </Body>
          </Stack>

          <Grid columns={1} gap="lg" className="sm:grid-cols-2 lg:grid-cols-3">
            {LANDING_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} elevation="md" padding="xl" variant="grouped">
                  <CardContent>
                    <Stack direction="vertical" spacing="md" align="start">
                      <Stack direction="horizontal" justify="between" align="start" className="w-full">
                        <div className="w-14 h-14 flex items-center justify-center rounded-[var(--apple-radius-large)] bg-[hsl(var(--apple-blue)/0.1)] text-[hsl(var(--apple-blue))] flex-shrink-0">
                          <Icon className="w-8 h-8" />
                        </div>
                        <Badge color="blue" variant="filled" size="sm">
                          {feature.badge}
                        </Badge>
                      </Stack>
                      <Stack direction="vertical" spacing="sm">
                        <Title1 className="text-xl sm:text-2xl">{feature.title}</Title1>
                        <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base">
                          {feature.description}
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
