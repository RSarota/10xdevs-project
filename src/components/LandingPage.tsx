import { Logo } from "./Logo";
import { LayoutDashboard } from "lucide-react";
import { NavigationBar } from "./apple-hig";
import { useLandingNavigation } from "@/hooks/useLandingNavigation";
import { LandingHero } from "./landing/LandingHero";
import { LandingStats } from "./landing/LandingStats";
import { LandingFeatures } from "./landing/LandingFeatures";
import { LandingHowItWorks } from "./landing/LandingHowItWorks";
import { LandingCTA } from "./landing/LandingCTA";
import { LandingFooter } from "./landing/LandingFooter";

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export default function LandingPage({ isAuthenticated = false }: LandingPageProps) {
  const { handleLogin, handleRegister, handleDemo, handleGoToApp } = useLandingNavigation(isAuthenticated);

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
        rightAction={
          isAuthenticated && (
            <button
              onClick={handleGoToApp}
              className="flex items-center gap-1.5 px-[var(--apple-space-3)] py-[var(--apple-space-2)] rounded-[var(--apple-radius-medium)] text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))] hover:text-[hsl(var(--apple-blue))] hover:bg-[hsl(var(--apple-fill))]/10 transition-colors"
              aria-label="Przejdź do aplikacji"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Aplikacja</span>
            </button>
          )
        }
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-16">
        <LandingHero onRegister={handleRegister} onLogin={handleLogin} />
        <LandingStats />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingCTA onRegister={handleRegister} onDemo={handleDemo} />
        <LandingFooter />
      </div>
    </div>
  );
}
