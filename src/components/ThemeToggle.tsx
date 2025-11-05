import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./apple-hig/Button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get current theme from HTML element
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(currentTheme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="plain" color="gray" size="medium" iconOnly aria-label="Toggle theme">
        <Moon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button variant="plain" color="gray" size="medium" iconOnly onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-transform duration-[var(--apple-spring-duration)] ease-[var(--apple-spring-easing)] hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-transform duration-[var(--apple-spring-duration)] ease-[var(--apple-spring-easing)] hover:rotate-12" />
      )}
    </Button>
  );
}
