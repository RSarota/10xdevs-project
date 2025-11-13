import { Container, Stack, Grid, Card, CardContent, Title1, Body } from "../apple-hig";
import { LANDING_STATS } from "@/lib/landing-data";
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const statIcons = [TrendingUp, Clock, CheckCircle2];

export function LandingStatsV2() {
  const [animatedStats, setAnimatedStats] = useState(LANDING_STATS.map(() => 0));
  const [showAnimation, setShowAnimation] = useState(false);
  const hasAnimatedRef = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    // Clear any existing timer before starting a new one
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    // Animate numbers counting up
    const targets = LANDING_STATS.map((stat) => {
      // Remove commas first, then extract only digits and dots
      const cleanValue = stat.value.replace(/,/g, "").replace(/[^0-9.]/g, "");
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    });

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let currentStep = 0;
    animationTimerRef.current = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats(targets.map((target) => Math.floor(target * easeOutProgress)));

      if (currentStep >= steps) {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
          animationTimerRef.current = null;
        }
        setAnimatedStats(targets);
      }
    }, stepTime);
  };

  useEffect(() => {
    const currentRef = sectionRef.current;

    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setShowAnimation(true);
            startAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, []); // Remove hasAnimated from dependency array to avoid re-creating observer

  const formatAnimatedValue = (index: number, animatedValue: number) => {
    const originalValue = LANDING_STATS[index].value;
    if (originalValue.includes("%")) {
      return `${animatedValue}%`;
    } else if (originalValue.includes("+")) {
      return `${animatedValue.toLocaleString()}+`;
    } else if (originalValue.includes("s")) {
      return `< ${animatedValue}s`;
    }
    return animatedValue.toLocaleString();
  };

  return (
    <div ref={sectionRef} className="relative">
      <Container size="xl" className="py-16 sm:py-20 lg:py-24">
        <Grid columns={3} gap="lg">
          {LANDING_STATS.map((stat, index) => {
            const Icon = statIcons[index] || TrendingUp;
            return (
              <Card
                key={index}
                elevation="sm"
                padding="xl"
                variant="grouped"
                className={`text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group ${
                  showAnimation ? "animate-slideInUp" : "opacity-0 translate-y-4"
                }`}
                style={{
                  animationDelay: showAnimation ? `${index * 0.1}s` : undefined,
                  animationFillMode: showAnimation ? "both" : undefined,
                }}
              >
                <CardContent>
                  <Stack direction="vertical" spacing="md" align="center">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--apple-blue)/0.1)] to-[hsl(var(--apple-purple)/0.1)] mb-2 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-[hsl(var(--apple-blue))] group-hover:text-[hsl(var(--apple-purple))] transition-colors duration-300" />
                    </div>
                    <Title1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent">
                      {formatAnimatedValue(index, animatedStats[index])}
                    </Title1>
                    <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base lg:text-lg">
                      {stat.label}
                    </Body>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}
