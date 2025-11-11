import React, { useEffect } from "react";

/**
 * Toast Notification - Temporary message overlay
 */
export interface ToastProps {
  open: boolean;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  position?: "top" | "bottom";
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ open, message, icon, duration = 3000, position = "top", onClose }) => {
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  const positionClasses = position === "top" ? "top-[var(--apple-space-5)]" : "bottom-[var(--apple-space-5)]";

  return (
    <div
      className={`
        fixed left-1/2 -translate-x-1/2 ${positionClasses}
        z-50
        animate-in slide-in-from-top-2 duration-300
      `
        .trim()
        .replace(/\s+/g, " ")}
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          flex items-center gap-[var(--apple-space-3)]
          px-[var(--apple-space-5)] py-[var(--apple-space-4)]
          bg-[hsl(var(--apple-grouped-bg-secondary))]/95
          backdrop-blur-[var(--apple-blur-amount)]
          border border-[hsl(var(--apple-separator-opaque))]
          rounded-[var(--apple-radius-large)]
          shadow-[var(--apple-shadow-lg)]
          max-w-sm
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {icon && <div className="flex-shrink-0 text-[hsl(var(--apple-blue))]">{icon}</div>}
        <p className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]">{message}</p>
      </div>
    </div>
  );
};

Toast.displayName = "AppleToast";

/**
 * Banner - Persistent notification at top of screen
 */
export interface BannerProps {
  open: boolean;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  dismissible?: boolean;
}

export const Banner: React.FC<BannerProps> = ({
  open,
  message,
  type = "info",
  icon,
  action,
  onClose,
  dismissible = true,
}) => {
  if (!open) return null;

  const typeStyles = {
    info: "bg-[hsl(var(--apple-blue))]/10 text-[hsl(var(--apple-blue))] border-[hsl(var(--apple-blue))]/20",
    success: "bg-[hsl(var(--apple-green))]/10 text-[hsl(var(--apple-green))] border-[hsl(var(--apple-green))]/20",
    warning: "bg-[hsl(var(--apple-orange))]/10 text-[hsl(var(--apple-orange))] border-[hsl(var(--apple-orange))]/20",
    error: "bg-[hsl(var(--apple-red))]/10 text-[hsl(var(--apple-red))] border-[hsl(var(--apple-red))]/20",
  };

  return (
    <div
      className={`
        flex items-center gap-[var(--apple-space-4)]
        px-[var(--apple-space-5)] py-[var(--apple-space-4)]
        border
        ${typeStyles[type]}
        animate-in slide-in-from-top-2 duration-300
      `
        .trim()
        .replace(/\s+/g, " ")}
      role="alert"
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}

      <p className="flex-1 text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]">{message}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="flex-shrink-0 text-[var(--apple-font-body)] font-[var(--apple-weight-semibold)] hover:opacity-70 transition-opacity"
        >
          {action.label}
        </button>
      )}

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          aria-label="Zamknij"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

Banner.displayName = "AppleBanner";

/**
 * Progress Indicator - Linear progress bar
 */
export interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "orange" | "red";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = "md",
  color = "blue",
  showLabel = false,
  label,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  const colorClasses = {
    blue: "bg-[hsl(var(--apple-blue))]",
    green: "bg-[hsl(var(--apple-green))]",
    orange: "bg-[hsl(var(--apple-orange))]",
    red: "bg-[hsl(var(--apple-red))]",
  };

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-[var(--apple-space-2)]">
          <span className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))]">{label}</span>
          {showLabel && (
            <span className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))] font-[var(--apple-weight-medium)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`
          relative w-full
          ${sizeClasses[size]}
          bg-[hsl(var(--apple-fill))]/20
          rounded-full
          overflow-hidden
        `
          .trim()
          .replace(/\s+/g, " ")}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`
            h-full
            ${colorClasses[color]}
            rounded-full
            transition-all duration-300 ease-out
          `
            .trim()
            .replace(/\s+/g, " ")}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

Progress.displayName = "AppleProgress";

/**
 * Activity Indicator - Spinning loader (iOS style)
 */
export interface ActivityIndicatorProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "gray" | "white";
  label?: string;
  className?: string;
}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  size = "md",
  color = "blue",
  label,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    blue: "text-[hsl(var(--apple-blue))]",
    gray: "text-[hsl(var(--apple-gray))]",
    white: "text-white",
  };

  return (
    <div className={`flex flex-col items-center gap-[var(--apple-space-3)] ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label || "Ładowanie"}
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span className="text-[var(--apple-font-subheadline)] text-[hsl(var(--apple-label-secondary))]">{label}</span>
      )}
    </div>
  );
};

ActivityIndicator.displayName = "AppleActivityIndicator";

/**
 * Skeleton - Loading placeholder
 */
export interface SkeletonProps {
  variant?: "text" | "circle" | "rect";
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = "text", width, height, className = "" }) => {
  const variantClasses = {
    text: "rounded h-4",
    circle: "rounded-full",
    rect: "rounded-[var(--apple-radius-medium)]",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "circle" ? width : undefined),
  };

  return (
    <div
      className={`
        ${variantClasses[variant]}
        bg-[hsl(var(--apple-fill))]/20
        animate-pulse
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      style={style}
      aria-hidden="true"
    />
  );
};

Skeleton.displayName = "AppleSkeleton";

/**
 * Empty State - For empty lists or no data scenarios
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className = "" }) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        py-[var(--apple-space-10)]
        px-[var(--apple-space-6)]
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {icon && (
        <div className="mb-[var(--apple-space-5)] text-[hsl(var(--apple-label-tertiary))] opacity-50">{icon}</div>
      )}

      <h3 className="text-[var(--apple-font-title-3)] font-[var(--apple-weight-semibold)] text-[hsl(var(--apple-label))] mb-[var(--apple-space-2)]">
        {title}
      </h3>

      {description && (
        <p className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label-secondary))] mb-[var(--apple-space-6)] max-w-md">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="
            px-[var(--apple-space-6)] py-[var(--apple-space-3)]
            bg-[hsl(var(--apple-blue))] text-white
            rounded-[var(--apple-radius-medium)]
            text-[var(--apple-font-body)] font-[var(--apple-weight-semibold)]
            hover:opacity-90 active:scale-95
            transition-all duration-200
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

EmptyState.displayName = "AppleEmptyState";

/**
 * Badge - Small count or status indicator
 */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: "filled" | "outlined";
  color?: "blue" | "red" | "green" | "orange" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-testid"?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "filled",
  color = "red",
  size = "md",
  className = "",
  "data-testid": dataTestId,
}) => {
  const sizeClasses = {
    sm: "min-w-[16px] h-4 px-1 text-[10px]",
    md: "min-w-[20px] h-5 px-1.5 text-[11px]",
    lg: "min-w-[24px] h-6 px-2 text-[12px]",
  };

  const colorClasses = {
    filled: {
      blue: "bg-[hsl(var(--apple-blue))] text-white",
      red: "bg-[hsl(var(--apple-red))] text-white",
      green: "bg-[hsl(var(--apple-green))] text-white",
      orange: "bg-[hsl(var(--apple-orange))] text-white",
      gray: "bg-[hsl(var(--apple-gray))] text-white",
    },
    outlined: {
      blue: "border border-[hsl(var(--apple-blue))] text-[hsl(var(--apple-blue))]",
      red: "border border-[hsl(var(--apple-red))] text-[hsl(var(--apple-red))]",
      green: "border border-[hsl(var(--apple-green))] text-[hsl(var(--apple-green))]",
      orange: "border border-[hsl(var(--apple-orange))] text-[hsl(var(--apple-orange))]",
      gray: "border border-[hsl(var(--apple-gray))] text-[hsl(var(--apple-gray))]",
    },
  };

  return (
    <span
      data-testid={dataTestId}
      className={`
        inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${colorClasses[variant][color]}
        font-[var(--apple-weight-semibold)]
        rounded-full
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {children}
    </span>
  );
};

Badge.displayName = "AppleBadge";
