import { Container, Stack, Body } from "../apple-hig";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import { Mail, Github } from "lucide-react";

export function LandingFooterV2() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/RSarota/10xdevs-project" },
    { name: "Email", icon: Mail, href: "mailto:rafal.sarota@gmail.com" },
  ];

  return (
    <footer className="w-full border-t border-[hsl(var(--apple-separator-opaque))] bg-[hsl(var(--apple-grouped-bg-secondary))] mt-16 sm:mt-20 lg:mt-24">
      <Container size="xl" className="py-12 sm:py-16">
        <Stack direction="vertical" spacing="xl">
          {/* Main footer content */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Brand section */}
            <div className="flex-1 max-w-md">
              <Stack direction="vertical" spacing="lg">
                {/* Logo and brand */}
                <div className="flex items-center gap-3">
                  <Logo size={48} variant="gradient" />
                  <span className="text-[2.125rem] font-bold bg-gradient-to-r from-[hsl(var(--apple-blue))] to-[hsl(var(--apple-purple))] bg-clip-text text-transparent leading-none">
                    10xCards
                  </span>
                </div>

                {/* Description */}
                <Body className="text-[hsl(var(--apple-label-secondary))] text-sm sm:text-base leading-relaxed">
                  Darmowa platforma do nauki z fiszkami napędzana sztuczną inteligencją. Twórz fiszki szybciej i ucz się
                  efektywniej.
                </Body>

                {/* Social links */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target={social.href.startsWith("http") ? "_blank" : undefined}
                        rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[hsl(var(--apple-fill)/0.1)] text-[hsl(var(--apple-label-secondary))] hover:bg-[hsl(var(--apple-blue)/0.1)] hover:text-[hsl(var(--apple-blue))] transition-all duration-200"
                        aria-label={social.name}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </Stack>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-[hsl(var(--apple-separator-opaque))]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                <Body className="text-[hsl(var(--apple-label-tertiary))] text-xs sm:text-sm">
                  © {currentYear} 10xCards. Wszystkie prawa zastrzeżone.
                </Body>
              </div>

              {/* Theme toggle and additional info */}
              <div className="flex items-center gap-3">
                <Body className="text-[hsl(var(--apple-label-tertiary))] text-xs hidden sm:block">
                  Zbudowano w Polsce 🇵🇱
                </Body>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Stack>
      </Container>
    </footer>
  );
}
