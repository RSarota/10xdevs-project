import { useLandingNavigation } from "@/hooks/useLandingNavigation";
import { LandingHeroV2 } from "./LandingHeroV2";
import { LandingStatsV2 } from "./LandingStatsV2";
import { LandingFeaturesV2 } from "./LandingFeaturesV2";
import { LandingTestimonialsV2 } from "./LandingTestimonialsV2";
import { LandingHowItWorksV2 } from "./LandingHowItWorksV2";
import { LandingCTAV2 } from "./LandingCTAV2";
import { LandingFooterV2 } from "./LandingFooterV2";

export default function LandingPageV2() {
  const { handleLogin, handleRegister } = useLandingNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[hsl(var(--apple-gradient-from))] via-[hsl(var(--apple-gradient-via))] to-[hsl(var(--apple-gradient-to))]">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[hsl(var(--apple-blue)/0.008)] to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[hsl(var(--apple-blue)/0.015)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[hsl(var(--apple-purple)/0.01)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <LandingHeroV2 onRegister={handleRegister} onLogin={handleLogin} />
        <LandingStatsV2 />
        <LandingFeaturesV2 />
        <LandingTestimonialsV2 />
        <LandingHowItWorksV2 />
        <LandingCTAV2 onRegister={handleRegister} />
        <LandingFooterV2 />
      </div>
    </div>
  );
}
