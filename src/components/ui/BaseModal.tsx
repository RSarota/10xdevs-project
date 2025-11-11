import { useEffect, type ReactNode } from "react";

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  dismissible?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function BaseModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "2xl",
  dismissible = true,
}: BaseModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    if (!open || !dismissible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, dismissible, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--apple-space-4)] sm:p-[var(--apple-space-6)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[var(--apple-blur-amount)] bg-black/30 transition-opacity"
        onClick={dismissible ? onClose : undefined}
        onKeyDown={(e) => {
          if (dismissible && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClose();
          }
        }}
        role={dismissible ? "button" : undefined}
        tabIndex={dismissible ? 0 : undefined}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div
        className={`
          relative w-full ${maxWidthClasses[maxWidth]}
          bg-[hsl(var(--apple-grouped-bg-secondary))]/95
          backdrop-blur-xl
          rounded-[var(--apple-radius-large)]
          shadow-[var(--apple-shadow-xl)]
          overflow-hidden
          transform transition-all duration-[var(--apple-spring-duration)]
          ease-[var(--apple-spring-easing)]
          max-h-[90vh] overflow-y-auto
        `}
      >
        {/* Header */}
        <div className="px-[var(--apple-space-6)] pt-[var(--apple-space-6)] pb-[var(--apple-space-5)] border-b border-[hsl(var(--apple-separator-opaque))]">
          <h2
            id="modal-title"
            className="text-[var(--apple-font-title-2)] font-[var(--apple-weight-semibold)] text-[hsl(var(--apple-label))]"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-[var(--apple-space-2)] text-[var(--apple-font-body)] text-[hsl(var(--apple-label-secondary))]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-[var(--apple-space-6)] py-[var(--apple-space-6)]">{children}</div>
      </div>
    </div>
  );
}
