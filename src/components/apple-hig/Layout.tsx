import React from "react";

/**
 * Container - Main content container with max-width and padding
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: boolean;
  centered?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", padding = true, centered = true, className = "", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={`
          ${sizeClasses[size]}
          ${centered ? "mx-auto" : ""}
          ${padding ? "px-[var(--apple-space-5)]" : ""}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "AppleContainer";

/**
 * Stack - Vertical or horizontal layout with consistent spacing
 */
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  divider?: boolean;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "vertical",
      spacing = "md",
      align = "stretch",
      justify = "start",
      wrap = false,
      divider = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      none: "",
      xs: direction === "vertical" ? "space-y-[var(--apple-space-2)]" : "space-x-[var(--apple-space-2)]",
      sm: direction === "vertical" ? "space-y-[var(--apple-space-3)]" : "space-x-[var(--apple-space-3)]",
      md: direction === "vertical" ? "space-y-[var(--apple-space-5)]" : "space-x-[var(--apple-space-5)]",
      lg: direction === "vertical" ? "space-y-[var(--apple-space-7)]" : "space-x-[var(--apple-space-7)]",
      xl: direction === "vertical" ? "space-y-[var(--apple-space-10)]" : "space-x-[var(--apple-space-10)]",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    const directionClass = direction === "vertical" ? "flex-col" : "flex-row";

    // Add dividers between children if enabled
    const childrenWithDividers = divider
      ? React.Children.toArray(children).flatMap((child, index, array) => {
          if (index === array.length - 1) {
            return [child];
          }
          return [
            child,
            <div
              key={`divider-${index}`}
              className={`
                ${direction === "vertical" ? "w-full h-px" : "w-px h-full"}
                bg-[hsl(var(--apple-separator-opaque))]
              `.trim()}
            />,
          ];
        })
      : children;

    return (
      <div
        ref={ref}
        className={`
          flex
          ${directionClass}
          ${spacingClasses[spacing]}
          ${alignClasses[align]}
          ${justifyClasses[justify]}
          ${wrap ? "flex-wrap" : ""}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {childrenWithDividers}
      </div>
    );
  }
);

Stack.displayName = "AppleStack";

/**
 * Grid - Responsive grid layout
 */
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ columns = 3, gap = "md", responsive = true, className = "", children, ...props }, ref) => {
    const gapClasses = {
      none: "gap-0",
      xs: "gap-[var(--apple-space-2)]",
      sm: "gap-[var(--apple-space-3)]",
      md: "gap-[var(--apple-space-5)]",
      lg: "gap-[var(--apple-space-7)]",
      xl: "gap-[var(--apple-space-10)]",
    };

    // Map columns to full class names (Tailwind needs full class names, not template strings)
    const columnClassMap = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const mdColumnClassMap = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      6: "md:grid-cols-6",
      12: "md:grid-cols-12",
    };

    // Responsive breakpoints: mobile-first approach
    const columnClasses = responsive
      ? `grid-cols-1 sm:grid-cols-2 ${mdColumnClassMap[columns]}`
      : columnClassMap[columns];

    return (
      <div
        ref={ref}
        className={`
          grid
          ${columnClasses}
          ${gapClasses[gap]}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "AppleGrid";

/**
 * Spacer - Flexible space between elements
 */
export interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "auto";
  direction?: "vertical" | "horizontal";
}

export const Spacer: React.FC<SpacerProps> = ({ size = "md", direction = "vertical" }) => {
  const sizeClasses = {
    xs: direction === "vertical" ? "h-[var(--apple-space-2)]" : "w-[var(--apple-space-2)]",
    sm: direction === "vertical" ? "h-[var(--apple-space-3)]" : "w-[var(--apple-space-3)]",
    md: direction === "vertical" ? "h-[var(--apple-space-5)]" : "w-[var(--apple-space-5)]",
    lg: direction === "vertical" ? "h-[var(--apple-space-7)]" : "w-[var(--apple-space-7)]",
    xl: direction === "vertical" ? "h-[var(--apple-space-10)]" : "w-[var(--apple-space-10)]",
    auto: "flex-1",
  };

  return <div className={sizeClasses[size]} aria-hidden="true" />;
};

Spacer.displayName = "AppleSpacer";

/**
 * Divider - Visual separator
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
  label?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ direction = "horizontal", spacing = "md", label, className = "", ...props }, ref) => {
    const spacingClasses = {
      none: "",
      sm: direction === "horizontal" ? "my-[var(--apple-space-3)]" : "mx-[var(--apple-space-3)]",
      md: direction === "horizontal" ? "my-[var(--apple-space-5)]" : "mx-[var(--apple-space-5)]",
      lg: direction === "horizontal" ? "my-[var(--apple-space-7)]" : "mx-[var(--apple-space-7)]",
    };

    if (label && direction === "horizontal") {
      return (
        <div
          ref={ref}
          className={`
            flex items-center
            ${spacingClasses[spacing]}
            ${className}
          `
            .trim()
            .replace(/\s+/g, " ")}
          role="separator"
          {...props}
        >
          <div className="flex-1 h-px bg-[hsl(var(--apple-separator-opaque))]" />
          <span className="px-[var(--apple-space-4)] text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))]">
            {label}
          </span>
          <div className="flex-1 h-px bg-[hsl(var(--apple-separator-opaque))]" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`
          ${direction === "horizontal" ? "w-full h-px" : "w-px h-full"}
          bg-[hsl(var(--apple-separator-opaque))]
          ${spacingClasses[spacing]}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        role="separator"
        {...props}
      />
    );
  }
);

Divider.displayName = "AppleDivider";

/**
 * Section - Content section with optional header and footer
 */
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ title, subtitle, action, footer, spacing = "lg", className = "", children, ...props }, ref) => {
    const spacingClasses = {
      none: "py-0",
      sm: "py-[var(--apple-space-5)]",
      md: "py-[var(--apple-space-7)]",
      lg: "py-[var(--apple-space-10)]",
      xl: "py-[var(--apple-space-10)] md:py-16",
    };

    return (
      <section ref={ref} className={`${spacingClasses[spacing]} ${className}`.trim()} {...props}>
        {(title || subtitle || action) && (
          <div className="flex items-start justify-between gap-[var(--apple-space-5)] mb-[var(--apple-space-7)]">
            <div className="flex-1">
              {title && (
                <h2 className="text-[var(--apple-font-large-title)] font-[var(--apple-weight-bold)] text-[hsl(var(--apple-label))] mb-[var(--apple-space-2)]">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label-secondary))]">{subtitle}</p>
              )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        )}

        {children}

        {footer && <div className="mt-[var(--apple-space-7)]">{footer}</div>}
      </section>
    );
  }
);

Section.displayName = "AppleSection";

/**
 * Center - Centers content both horizontally and vertically
 */
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  minHeight?: string;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ inline = false, minHeight, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${inline ? "inline-flex" : "flex"}
          items-center justify-center
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        style={{ minHeight }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Center.displayName = "AppleCenter";

/**
 * AspectRatio - Maintains aspect ratio for content
 */
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: "square" | "video" | "wide" | "portrait" | number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = "square", className = "", children, ...props }, ref) => {
    const ratioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      wide: "aspect-[21/9]",
      portrait: "aspect-[3/4]",
    };

    const aspectClass = typeof ratio === "number" ? "" : ratioClasses[ratio];

    const style = typeof ratio === "number" ? { aspectRatio: ratio.toString() } : undefined;

    return (
      <div ref={ref} className={`relative ${aspectClass} ${className}`.trim()} style={style} {...props}>
        {children}
      </div>
    );
  }
);

AspectRatio.displayName = "AppleAspectRatio";

/**
 * ScrollArea - Custom scrollable area with Apple-style scrollbars
 */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxHeight?: string;
  hideScrollbar?: boolean;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ maxHeight = "400px", hideScrollbar = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          overflow-auto
          ${hideScrollbar ? "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : ""}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        style={{ maxHeight }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "AppleScrollArea";
