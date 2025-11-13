import { Container, Stack, Title1, Body, Grid, Card, CardContent, Badge, Divider } from "../apple-hig";
import { LANDING_FEATURES } from "@/lib/landing-data";

export function LandingFeaturesV2() {
  return (
    <>
      <Divider />
      <div className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--apple-blue)/0.02)] to-transparent" />

        <Container
          size="xl"
          className="relative py-[var(--apple-space-20)] sm:py-[var(--apple-space-24)] lg:py-[var(--apple-space-28)]"
        >
          <Stack direction="vertical" spacing="xl">
            {/* Section Header */}
            <Stack direction="vertical" spacing="md" align="center" className="text-center max-w-4xl mx-auto">
              <Title1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Wszystko czego potrzebujesz do{" "}
                <span className="bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                  efektywnej nauki
                </span>
              </Title1>
              <Body className="text-[hsl(var(--apple-label-secondary))] text-lg sm:text-xl max-w-3xl">
                Nasza platforma łączy moc sztucznej inteligencji z prostotą użytkowania
              </Body>
            </Stack>

            {/* Features Grid */}
            <Grid columns={3} gap="lg" className="sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    elevation="md"
                    padding="xl"
                    variant="grouped"
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[hsl(var(--apple-separator-opaque))] hover:border-[hsl(var(--apple-blue)/0.3)]"
                  >
                    <CardContent>
                      <Stack direction="vertical" spacing="lg" align="start">
                        {/* Icon and Badge */}
                        <Stack direction="horizontal" justify="between" align="start" className="w-full">
                          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--apple-blue)/0.1)] to-[hsl(var(--apple-purple)/0.1)] group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-8 h-8 text-[hsl(var(--apple-blue))]" />
                          </div>
                          <Badge color="blue" variant="filled" size="sm" className="animate-fade-in">
                            {feature.badge}
                          </Badge>
                        </Stack>

                        {/* Content */}
                        <Stack direction="vertical" spacing="sm">
                          <Title1 className="text-2xl sm:text-3xl font-bold group-hover:text-[hsl(var(--apple-blue))] transition-colors">
                            {feature.title}
                          </Title1>
                          <Body className="text-[hsl(var(--apple-label-secondary))] text-base sm:text-lg leading-relaxed">
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
      </div>
    </>
  );
}
