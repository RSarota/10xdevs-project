import React from "react";

/**
 * List Item - iOS Settings-style list item
 */
export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  value?: string;
  badge?: string | number;
  chevron?: boolean;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  clickable?: boolean;
  variant?: "default" | "inset";
}

export const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      title,
      subtitle,
      description,
      icon,
      image,
      value,
      badge,
      chevron = false,
      rightElement,
      disabled = false,
      clickable = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      flex items-center gap-[var(--apple-space-4)]
      px-[var(--apple-space-5)] py-[var(--apple-space-4)]
      bg-[hsl(var(--apple-grouped-bg-secondary))]
      transition-colors duration-200
      ${clickable ? "cursor-pointer hover:bg-[hsl(var(--apple-fill))]/10 active:bg-[hsl(var(--apple-fill))]/20" : ""}
      ${disabled ? "opacity-40 cursor-not-allowed" : ""}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div ref={ref} className={`${baseClasses} ${className}`} {...props}>
        {/* Icon or Image */}
        {icon && (
          <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-[hsl(var(--apple-blue))]">
            {icon}
          </div>
        )}

        {image && (
          <div className="flex-shrink-0">
            <img src={image} alt="" className="w-10 h-10 rounded-[var(--apple-radius-medium)] object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]">{title}</span>
            {badge && (
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[11px] font-[var(--apple-weight-semibold)] text-white bg-[hsl(var(--apple-red))] rounded-full">
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <div className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))] mt-0.5">
              {subtitle}
            </div>
          )}

          {description && (
            <div className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-tertiary))] mt-1 line-clamp-2">
              {description}
            </div>
          )}
        </div>

        {/* Right side */}
        {rightElement ? (
          <div className="flex-shrink-0">{rightElement}</div>
        ) : value ? (
          <div className="flex-shrink-0 text-[var(--apple-font-body)] text-[hsl(var(--apple-label-secondary))] max-w-[40%] text-right truncate">
            {value}
          </div>
        ) : null}

        {/* Chevron indicator */}
        {chevron && (
          <svg
            className="flex-shrink-0 w-5 h-5 text-[hsl(var(--apple-label-tertiary))]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    );
  }
);

ListItem.displayName = "AppleListItem";

/**
 * List Separator - Divider between list items
 */
export interface ListSeparatorProps {
  inset?: boolean;
  spacing?: "none" | "sm" | "md";
  className?: string;
}

export const ListSeparator: React.FC<ListSeparatorProps> = ({ inset = true, spacing = "none", className = "" }) => {
  const spacingClasses = {
    none: "",
    sm: "my-[var(--apple-space-2)]",
    md: "my-[var(--apple-space-4)]",
  };

  return (
    <div
      className={`
        h-px bg-[hsl(var(--apple-separator-opaque))]
        ${inset ? "ml-[var(--apple-space-5)]" : ""}
        ${spacingClasses[spacing]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    />
  );
};

ListSeparator.displayName = "AppleListSeparator";

/**
 * List Group - Grouped list with title and footer (iOS Settings style)
 */
export interface ListGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  footer?: string;
  variant?: "default" | "inset";
  spacing?: "none" | "sm" | "md";
}

export const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
  ({ title, footer, variant = "inset", spacing = "none", className = "", children, ...props }, ref) => {
    const spacingClasses = {
      none: "",
      sm: "space-y-px",
      md: "space-y-[var(--apple-space-2)]",
    };

    const variantClasses = variant === "inset" ? "rounded-[var(--apple-radius-large)] overflow-hidden" : "";

    return (
      <div ref={ref} className={className} {...props}>
        {title && (
          <h3 className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-regular)] text-[hsl(var(--apple-label-secondary))] uppercase tracking-wide mb-[var(--apple-space-2)] px-[var(--apple-space-5)]">
            {title}
          </h3>
        )}

        <div className={`${variantClasses} ${spacingClasses[spacing]}`.trim()}>{children}</div>

        {footer && (
          <p className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))] mt-[var(--apple-space-2)] px-[var(--apple-space-5)] leading-relaxed">
            {footer}
          </p>
        )}
      </div>
    );
  }
);

ListGroup.displayName = "AppleListGroup";

/**
 * List - Simple list container
 */
export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "inset";
  spacing?: "none" | "sm" | "md";
  divided?: boolean;
}

export const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ variant = "default", spacing = "none", divided = true, className = "", children, ...props }, ref) => {
    const spacingClasses = {
      none: "",
      sm: "space-y-px",
      md: "space-y-[var(--apple-space-2)]",
    };

    const variantClasses = variant === "inset" ? "rounded-[var(--apple-radius-large)] overflow-hidden" : "";

    // Add separators between children if divided
    const childrenWithSeparators = divided
      ? React.Children.toArray(children).flatMap((child, index, array) => {
          if (index === array.length - 1) {
            return [child];
          }
          return [child, <ListSeparator key={`separator-${index}`} inset={true} />];
        })
      : children;

    return (
      <div ref={ref} className={`${variantClasses} ${spacingClasses[spacing]} ${className}`.trim()} {...props}>
        {childrenWithSeparators}
      </div>
    );
  }
);

List.displayName = "AppleList";

/**
 * Swipeable List Item - With swipe actions (iOS Mail style)
 */
export interface SwipeAction {
  label: string;
  icon?: React.ReactNode;
  color?: "blue" | "red" | "green" | "orange" | "gray";
  onClick: () => void;
}

export interface SwipeableListItemProps extends ListItemProps {
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
}

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  leftActions = [],
  rightActions = [],
  ...listItemProps
}) => {
  // Note: Full swipe gesture implementation would require additional libraries
  // This is a simplified version showing the structure

  const getActionColor = (color?: string) => {
    const colors = {
      blue: "bg-[hsl(var(--apple-blue))]",
      red: "bg-[hsl(var(--apple-red))]",
      green: "bg-[hsl(var(--apple-green))]",
      orange: "bg-[hsl(var(--apple-orange))]",
      gray: "bg-[hsl(var(--apple-gray))]",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left actions (shown on swipe right) */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex">
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                flex items-center justify-center gap-2
                px-[var(--apple-space-5)]
                text-white font-[var(--apple-weight-semibold)]
                ${getActionColor(action.color)}
                hover:opacity-90 active:opacity-80
                transition-opacity
              `
                .trim()
                .replace(/\s+/g, " ")}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <ListItem {...listItemProps} />

      {/* Right actions (shown on swipe left) */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex">
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`
                flex items-center justify-center gap-2
                px-[var(--apple-space-5)]
                text-white font-[var(--apple-weight-semibold)]
                ${getActionColor(action.color)}
                hover:opacity-90 active:opacity-80
                transition-opacity
              `
                .trim()
                .replace(/\s+/g, " ")}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

SwipeableListItem.displayName = "AppleSwipeableListItem";
