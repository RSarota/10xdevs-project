import { Container, Grid, Card, CardContent, Stack, Title1, Body, Divider } from "../apple-hig";
import { LANDING_STATS } from "@/lib/landing-data";

export function LandingStats() {
  return (
    <>
      <Divider />
      <Container
        size="xl"
        className="py-[var(--apple-space-12)] sm:py-[var(--apple-space-16)] lg:py-[var(--apple-space-20)]"
      >
        <Grid columns={3} gap="lg" className="max-w-5xl mx-auto">
          {LANDING_STATS.map((stat, index) => (
            <Card key={index} elevation="md" padding="xl" variant="grouped">
              <CardContent>
                <Stack direction="vertical" spacing="sm" align="center">
                  <Title1 className="text-[hsl(var(--apple-blue))] text-3xl sm:text-4xl">{stat.value}</Title1>
                  <Body className="text-[hsl(var(--apple-label-secondary))] text-center text-sm sm:text-base">
                    {stat.label}
                  </Body>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </>
  );
}
