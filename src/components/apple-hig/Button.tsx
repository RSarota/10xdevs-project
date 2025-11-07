import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "default" | "plain";
  color?: "blue" | "gray" | "red" | "green" | "orange";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  isLoading?: boolean;
  iconOnly?: boolean; // For icon-only buttons (removes padding, makes square)
}

/**
 * Apple HIG Button Component
 *
 * Implements Apple's button design with three variants:
 * - filled: Primary action, colored background
 * - default: Secondary action, light fill
 * - plain: Tertiary action, no background
 *
 * Features:
 * - Minimum 44x44pt touch target
 * - Spring animations on interaction
 * - Proper disabled states
 * - Loading state support
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "filled",
      color = "blue",
      size = "medium",
      fullWidth = false,
      isLoading = false,
      iconOnly = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base classes - Apple's clean, minimal style
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-[var(--apple-radius-medium)]
      transition-all duration-[var(--apple-spring-duration)]
      ease-[var(--apple-spring-easing)]
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-[hsl(var(--apple-blue))] focus-visible:ring-offset-2
      disabled:opacity-40 disabled:cursor-not-allowed
      active:scale-[0.96]
    `;

    // Size variants - respecting 44pt touch target
    const sizeClasses = iconOnly
      ? {
          small: "text-[var(--apple-font-footnote)] p-2 h-9 w-9",
          medium: "text-[var(--apple-font-body)] p-2 min-h-[var(--apple-touch-target)] min-w-[var(--apple-touch-target)]",
          large: "text-[var(--apple-font-headline)] p-3 min-h-[3.25rem] min-w-[3.25rem]",
        }
      : {
          small: "text-[var(--apple-font-footnote)] px-[var(--apple-space-4)] h-9 min-w-[2.25rem]",
          medium:
            "text-[var(--apple-font-body)] px-[var(--apple-space-5)] min-h-[var(--apple-touch-target)] min-w-[var(--apple-touch-target)]",
          large: "text-[var(--apple-font-headline)] px-[var(--apple-space-6)] min-h-[3.25rem] min-w-[3.25rem]",
        };

    // Color mappings for each variant
    const colorClasses = {
      filled: {
        blue: "bg-[hsl(var(--apple-blue))] text-white hover:bg-[hsl(var(--apple-blue-dark))] shadow-sm",
        gray: "bg-[hsl(var(--apple-gray-5))] text-[hsl(var(--apple-label))] hover:bg-[hsl(var(--apple-gray-6))] shadow-sm",
        red: "bg-[hsl(var(--apple-red))] text-white hover:opacity-90 shadow-sm",
        green: "bg-[hsl(var(--apple-green))] text-white hover:opacity-90 shadow-sm",
        orange: "bg-[hsl(var(--apple-orange))] text-white hover:opacity-90 shadow-sm",
      },
      default: {
        blue: "bg-[hsl(var(--apple-fill))]/20 text-[hsl(var(--apple-blue))] hover:bg-[hsl(var(--apple-fill))]/30",
        gray: "bg-[hsl(var(--apple-gray-3))] text-[hsl(var(--apple-label))] hover:bg-[hsl(var(--apple-gray-4))]",
        red: "bg-[hsl(var(--apple-fill))]/20 text-[hsl(var(--apple-red))] hover:bg-[hsl(var(--apple-fill))]/30",
        green: "bg-[hsl(var(--apple-fill))]/20 text-[hsl(var(--apple-green))] hover:bg-[hsl(var(--apple-fill))]/30",
        orange: "bg-[hsl(var(--apple-fill))]/20 text-[hsl(var(--apple-orange))] hover:bg-[hsl(var(--apple-fill))]/30",
      },
      plain: {
        blue: "text-[hsl(var(--apple-blue))] hover:bg-[hsl(var(--apple-fill))]/10",
        gray: "text-[hsl(var(--apple-label))] hover:bg-[hsl(var(--apple-fill))]/10",
        red: "text-[hsl(var(--apple-red))] hover:bg-[hsl(var(--apple-fill))]/10",
        green: "text-[hsl(var(--apple-green))] hover:bg-[hsl(var(--apple-fill))]/10",
        orange: "text-[hsl(var(--apple-orange))] hover:bg-[hsl(var(--apple-fill))]/10",
      },
    };

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClasses = `
      ${baseClasses}
      ${sizeClasses[size]}
      ${colorClasses[variant][color]}
      ${widthClass}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Ładowanie...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "AppleButton";
