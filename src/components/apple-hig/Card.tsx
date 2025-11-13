import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "none" | "sm" | "md" | "lg" | "xl";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
  pressable?: boolean;
  variant?: "default" | "grouped" | "inset";
}

/**
 * Apple HIG Card Component
 *
 * Features:
 * - Subtle elevation with Apple-style shadows
 * - Generous white space
 * - Characteristic rounded corners (14px)
 * - Hover and press states with spring animations
 * - Support for different background variants
 * - Grouped style for list-like layouts
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = "sm",
      padding = "md",
      hoverable = false,
      pressable = false,
      variant = "default",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const elevationClasses = {
      none: "",
      sm: "shadow-[var(--apple-shadow-sm)]",
      md: "shadow-[var(--apple-shadow-md)]",
      lg: "shadow-[var(--apple-shadow-lg)]",
      xl: "shadow-[var(--apple-shadow-xl)]",
    };

    const paddingClasses = {
      none: "",
      sm: "p-[var(--apple-space-4)]",
      md: "p-[var(--apple-space-6)]",
      lg: "p-[var(--apple-space-8)]",
      xl: "p-[var(--apple-space-10)]",
    };

    const variantClasses = {
      default: "bg-[hsl(var(--apple-bg-secondary))]",
      grouped: "bg-[hsl(var(--apple-grouped-bg-secondary))]",
      inset: "bg-[hsl(var(--apple-bg-tertiary))]",
    };

    const interactionClasses = `
      ${hoverable ? "hover:shadow-[var(--apple-shadow-md)] hover:-translate-y-0.5 cursor-pointer" : ""}
      ${pressable ? "active:scale-[0.98]" : ""}
    `;

    const baseClasses = `
      rounded-[var(--apple-radius-large)]
      border border-[hsl(var(--apple-separator-opaque))]/60
      transition-all duration-[var(--apple-spring-duration)]
      ease-[var(--apple-spring-easing)]
      overflow-hidden
    `;

    const combinedClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${elevationClasses[elevation]}
      ${paddingClasses[padding]}
      ${interactionClasses}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "AppleCard";

/**
 * Card Header - For titles and actions
 */
export interface CardHeaderProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, className = "" }) => {
  return (
    <div
      className={`flex items-start justify-between gap-[var(--apple-space-4)] mb-[var(--apple-space-5)] ${className}`}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-[var(--apple-font-title-3)] font-[var(--apple-weight-semibold)] text-[hsl(var(--apple-label))] mb-[var(--apple-space-1)]">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))]">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

CardHeader.displayName = "AppleCardHeader";

/**
 * Card Content - Main content area
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "none" | "sm" | "md" | "lg";
}

export const CardContent: React.FC<CardContentProps> = ({ spacing = "none", className = "", children, ...props }) => {
  const spacingClasses = {
    none: "",
    sm: "space-y-[var(--apple-space-3)]",
    md: "space-y-[var(--apple-space-5)]",
    lg: "space-y-[var(--apple-space-7)]",
  };

  return (
    <div className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </div>
  );
};

CardContent.displayName = "AppleCardContent";

/**
 * Card Footer - For actions and supplementary content
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({ divider = true, className = "", children, ...props }) => {
  return (
    <div
      className={`
        mt-[var(--apple-space-6)]
        ${divider ? "pt-[var(--apple-space-5)] border-t border-[hsl(var(--apple-separator-opaque))]" : ""}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.displayName = "AppleCardFooter";
