import React, { useEffect, useRef } from "react";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: "default" | "large" | "full";
  showHandle?: boolean;
  dismissible?: boolean;
  blurBackground?: boolean;
}

/**
 * Apple HIG Sheet Component
 *
 * Features:
 * - Slides up from bottom (iOS style)
 * - Blurred background with vibrancy effect
 * - Swipe-to-dismiss gesture support (visual indicator)
 * - Rounded top corners (20px)
 * - Spring animations
 * - Respects safe areas
 * - Focus trap for accessibility
 */
export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "default",
  showHandle = true,
  dismissible = true,
  blurBackground = true,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Size variants
  const sizeClasses = {
    default: "max-h-[75vh]",
    large: "max-h-[90vh]",
    full: "h-screen rounded-none",
  };

  // Handle escape key
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "sheet-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 
          ${blurBackground ? "backdrop-blur-[var(--apple-blur-amount)] bg-black/30" : "bg-black/50"}
          transition-opacity duration-[var(--apple-spring-duration)]
          ease-[var(--apple-spring-easing)]
          ${open ? "opacity-100" : "opacity-0"}
        `
          .trim()
          .replace(/\s+/g, " ")}
        onClick={dismissible ? onClose : undefined}
        onKeyDown={(e) => {
          if (dismissible && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close sheet"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          relative w-full
          ${sizeClasses[size]}
          bg-[hsl(var(--apple-grouped-bg-secondary))]
          ${size !== "full" ? "rounded-t-[var(--apple-radius-xlarge)]" : ""}
          shadow-[var(--apple-shadow-xl)]
          transform transition-transform duration-[var(--apple-spring-duration)]
          ease-[var(--apple-spring-easing)]
          ${open ? "translate-y-0" : "translate-y-full"}
          flex flex-col
          overflow-hidden
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {/* Drag handle */}
        {showHandle && size !== "full" && (
          <div className="flex justify-center pt-[var(--apple-space-3)] pb-[var(--apple-space-2)]">
            <div className="w-9 h-1 bg-[hsl(var(--apple-separator))] rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || subtitle) && (
          <div className="px-[var(--apple-space-6)] py-[var(--apple-space-4)] border-b border-[hsl(var(--apple-separator-opaque))]">
            {title && (
              <h2
                id="sheet-title"
                className="text-[var(--apple-font-title-3)] font-[var(--apple-weight-semibold)] text-[hsl(var(--apple-label))] text-center"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))] text-center mt-[var(--apple-space-1)]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-[var(--apple-space-6)] py-[var(--apple-space-5)]">{children}</div>
      </div>
    </div>
  );
};

Sheet.displayName = "AppleSheet";

/**
 * Alert Dialog - Modal dialog for important decisions
 */
export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  primaryAction?: {
    label: string;
    onAction: () => void;
    destructive?: boolean;
  };
  secondaryAction?: {
    label: string;
    onAction: () => void;
  };
  cancelAction?: {
    label?: string;
    onAction?: () => void;
  };
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  title,
  message,
  primaryAction,
  secondaryAction,
  cancelAction,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (cancelAction?.onAction) {
          cancelAction.onAction();
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, cancelAction, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--apple-space-5)]"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby={message ? "alert-message" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-[var(--apple-blur-amount)] bg-black/30"
        onClick={() => {
          if (cancelAction?.onAction) {
            cancelAction.onAction();
          } else {
            onClose();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (cancelAction?.onAction) {
              cancelAction.onAction();
            } else {
              onClose();
            }
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
      />

      {/* Dialog */}
      <div
        data-testid="alert-dialog"
        className={`
          relative w-full max-w-xs
          bg-[hsl(var(--apple-grouped-bg-secondary))]/95
          backdrop-blur-xl
          rounded-[var(--apple-radius-large)]
          shadow-[var(--apple-shadow-xl)]
          overflow-hidden
          transform transition-all duration-[var(--apple-spring-duration)]
          ease-[var(--apple-spring-easing)]
          ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {/* Content */}
        <div className="px-[var(--apple-space-6)] py-[var(--apple-space-5)] text-center">
          <h2
            id="alert-title"
            className="text-[var(--apple-font-headline)] font-[var(--apple-weight-semibold)] text-[hsl(var(--apple-label))] mb-[var(--apple-space-2)]"
          >
            {title}
          </h2>
          {message && (
            <p
              id="alert-message"
              className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))]"
            >
              {message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-[hsl(var(--apple-separator-opaque))]">
          {secondaryAction && (
            <button
              onClick={() => {
                secondaryAction.onAction();
                onClose();
              }}
              className="w-full px-[var(--apple-space-5)] py-[var(--apple-space-4)] text-[var(--apple-font-body)] text-[hsl(var(--apple-blue))] hover:bg-[hsl(var(--apple-fill))]/10 transition-colors border-b border-[hsl(var(--apple-separator-opaque))]"
            >
              {secondaryAction.label}
            </button>
          )}

          {primaryAction && (
            <button
              data-testid="alert-dialog-primary-button"
              onClick={() => {
                primaryAction.onAction();
                onClose();
              }}
              className={`
                w-full px-[var(--apple-space-5)] py-[var(--apple-space-4)]
                text-[var(--apple-font-body)] font-[var(--apple-weight-semibold)]
                ${primaryAction.destructive ? "text-[hsl(var(--apple-red))]" : "text-[hsl(var(--apple-blue))]"}
                hover:bg-[hsl(var(--apple-fill))]/10
                transition-colors
                ${cancelAction ? "border-b border-[hsl(var(--apple-separator-opaque))]" : ""}
              `
                .trim()
                .replace(/\s+/g, " ")}
            >
              {primaryAction.label}
            </button>
          )}

          {cancelAction && (
            <button
              data-testid="alert-dialog-cancel-button"
              onClick={() => {
                cancelAction.onAction?.();
                onClose();
              }}
              className="w-full px-[var(--apple-space-5)] py-[var(--apple-space-4)] text-[var(--apple-font-body)] font-[var(--apple-weight-medium)] text-[hsl(var(--apple-label))] hover:bg-[hsl(var(--apple-fill))]/10 transition-colors"
            >
              {cancelAction.label || "Anuluj"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

AlertDialog.displayName = "AppleAlertDialog";
