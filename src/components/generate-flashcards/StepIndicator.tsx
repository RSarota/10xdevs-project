import { Check, FileText, Eye, Save } from "lucide-react";

interface StepIndicatorProps {
  hasProposals: boolean;
  hasAccepted: boolean;
}

export function StepIndicator({ hasProposals, hasAccepted }: StepIndicatorProps) {
  const steps = [
    {
      id: "generate",
      label: "Generuj",
      icon: FileText,
      description: "Wklej tekst źródłowy",
    },
    {
      id: "review",
      label: "Rewiduj",
      icon: Eye,
      description: "Przejrzyj propozycje",
    },
    {
      id: "save",
      label: "Zapisz",
      icon: Save,
      description: "Dodaj do kolekcji",
    },
  ];

  const getStepStatus = (stepId: string) => {
    if (stepId === "generate") return "completed";
    if (stepId === "review") return hasProposals ? "current" : "upcoming";
    if (stepId === "save") return hasAccepted ? "current" : "upcoming";
    return "upcoming";
  };

  return (
    <div className="flex justify-center px-[var(--apple-space-5)]">
      <div className="flex w-full max-w-3xl items-center">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-1 items-center min-w-0">
              {/* Step circle and label */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Icon circle */}
                <div
                  className={`
                    flex h-14 w-14 items-center justify-center rounded-full
                    transition-all duration-[var(--apple-spring-duration)] ease-[var(--apple-spring-easing)]
                    ${
                      status === "completed"
                        ? "bg-[hsl(var(--apple-green))] text-white shadow-[var(--apple-shadow-md)] scale-105"
                        : status === "current"
                          ? "bg-[hsl(var(--apple-blue))] text-white shadow-[var(--apple-shadow-md)] scale-105"
                          : "bg-[hsl(var(--apple-fill))]/20 text-[hsl(var(--apple-label-tertiary))] shadow-[var(--apple-shadow-sm)]"
                    }
                  `
                    .trim()
                    .replace(/\s+/g, " ")}
                >
                  {status === "completed" ? (
                    <Check className="h-6 w-6 stroke-[2.5]" />
                  ) : (
                    <Icon className="h-6 w-6 stroke-[2]" />
                  )}
                </div>

                {/* Label and description */}
                <div className="mt-[var(--apple-space-3)] text-center max-w-[120px]">
                  <p
                    className={`
                      text-[var(--apple-font-subheadline)] font-[var(--apple-weight-semibold)]
                      ${
                        status === "completed"
                          ? "text-[hsl(var(--apple-green))]"
                          : status === "current"
                            ? "text-[hsl(var(--apple-label))]"
                            : "text-[hsl(var(--apple-label-tertiary))]"
                      }
                    `
                      .trim()
                      .replace(/\s+/g, " ")}
                  >
                    {step.label}
                  </p>
                  <p className="text-[var(--apple-font-caption-1)] text-[hsl(var(--apple-label-secondary))] mt-[var(--apple-space-1)] hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-[3px] mx-[var(--apple-space-4)] relative min-w-[40px]">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-[hsl(var(--apple-separator-opaque))] rounded-full" />
                  {/* Progress line */}
                  <div
                    className={`
                      h-full rounded-full transition-all duration-[var(--apple-spring-duration)] ease-[var(--apple-spring-easing)]
                      ${status === "completed" ? "bg-[hsl(var(--apple-green))] w-full shadow-[var(--apple-shadow-sm)]" : "bg-transparent w-0"}
                    `
                      .trim()
                      .replace(/\s+/g, " ")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
