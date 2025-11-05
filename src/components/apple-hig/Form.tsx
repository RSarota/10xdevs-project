import React from "react";

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  footer?: string;
  variant?: "default" | "inset";
  spacing?: "none" | "sm" | "md" | "lg";
}

/**
 * Apple HIG Form Group
 *
 * Groups related form fields together with:
 * - Optional section title
 * - Optional footer text
 * - Inset style (iOS Settings-like)
 * - Proper spacing between fields
 */
export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  footer,
  variant = "default",
  spacing = "sm",
  className = "",
  children,
  ...props
}) => {
  const spacingClasses = {
    none: "",
    sm: "space-y-[var(--apple-space-2)]",
    md: "space-y-[var(--apple-space-4)]",
    lg: "space-y-[var(--apple-space-6)]",
  };

  const variantClasses =
    variant === "inset"
      ? "bg-[hsl(var(--apple-grouped-bg-secondary))] rounded-[var(--apple-radius-large)] overflow-hidden"
      : "";

  return (
    <div className={`${className}`.trim()} {...props}>
      {title && (
        <h3 className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-regular)] text-[hsl(var(--apple-label-secondary))] uppercase tracking-wide mb-[var(--apple-space-2)] px-[var(--apple-space-5)]">
          {title}
        </h3>
      )}

      <div className={`${variantClasses} ${spacingClasses[spacing]}`.trim()}>{children}</div>

      {footer && (
        <p className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))] mt-[var(--apple-space-2)] px-[var(--apple-space-5)]">
          {footer}
        </p>
      )}
    </div>
  );
};

FormGroup.displayName = "AppleFormGroup";

/**
 * Form Field - Single row in iOS Settings-style form
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  chevron?: boolean;
  control?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  clickable?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  icon,
  chevron = false,
  control,
  description,
  disabled = false,
  clickable = false,
  className = "",
  ...props
}) => {
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
    <div className={`${baseClasses} ${className}`} {...props}>
      {/* Icon */}
      {icon && <div className="flex-shrink-0 text-[hsl(var(--apple-blue))]">{icon}</div>}

      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <div className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]">{label}</div>
        {description && (
          <div className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))] mt-0.5">
            {description}
          </div>
        )}
      </div>

      {/* Control or value */}
      {control ? (
        <div className="flex-shrink-0">{control}</div>
      ) : value ? (
        <div className="flex-shrink-0 text-[var(--apple-font-body)] text-[hsl(var(--apple-label-secondary))]">
          {value}
        </div>
      ) : null}

      {/* Chevron */}
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
};

FormField.displayName = "AppleFormField";

/**
 * Form Separator - Divider between form fields
 */
export const FormSeparator: React.FC<{ inset?: boolean; className?: string }> = ({ inset = true, className = "" }) => {
  return (
    <div
      className={`
        h-px bg-[hsl(var(--apple-separator-opaque))]
        ${inset ? "ml-[var(--apple-space-5)]" : ""}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    />
  );
};

FormSeparator.displayName = "AppleFormSeparator";

/**
 * Switch Toggle - iOS-style switch
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, className = "", disabled, checked, ...props }, ref) => {
    return (
      <label
        className={`inline-flex items-center gap-[var(--apple-space-3)] ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        {(label || description) && (
          <div className="flex-1">
            {label && <div className="text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]">{label}</div>}
            {description && (
              <div className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))] mt-0.5">
                {description}
              </div>
            )}
          </div>
        )}

        <div className="relative flex-shrink-0">
          <input ref={ref} type="checkbox" className="sr-only peer" disabled={disabled} checked={checked} {...props} />
          <div
            className={`
              w-[51px] h-[31px]
              rounded-full
              transition-all duration-[var(--apple-spring-duration)]
              ease-[var(--apple-spring-easing)]
              peer-checked:bg-[hsl(var(--apple-green))]
              peer-focus-visible:ring-2 peer-focus-visible:ring-[hsl(var(--apple-blue))] peer-focus-visible:ring-offset-2
              ${checked ? "bg-[hsl(var(--apple-green))]" : "bg-[hsl(var(--apple-fill))]/40"}
            `
              .trim()
              .replace(/\s+/g, " ")}
          />
          <div
            className={`
              absolute top-[2px] left-[2px]
              w-[27px] h-[27px]
              bg-white
              rounded-full
              shadow-[var(--apple-shadow-sm)]
              transition-transform duration-[var(--apple-spring-duration)]
              ease-[var(--apple-spring-easing)]
              ${checked ? "translate-x-[20px]" : "translate-x-0"}
            `
              .trim()
              .replace(/\s+/g, " ")}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = "AppleSwitch";

/**
 * Segmented Control - iOS-style segmented picker
 */
export interface SegmentedControlProps {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  fullWidth = false,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-7 text-[var(--apple-font-footnote)]",
    md: "h-8 text-[var(--apple-font-subheadline)]",
    lg: "h-9 text-[var(--apple-font-body)]",
  };

  return (
    <div
      className={`
        inline-flex
        ${fullWidth ? "w-full" : ""}
        bg-[hsl(var(--apple-fill))]/20
        rounded-[var(--apple-radius-medium)]
        p-0.5
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              ${sizeClasses[size]}
              px-[var(--apple-space-4)]
              rounded-[calc(var(--apple-radius-medium)-2px)]
              font-[var(--apple-weight-medium)]
              transition-all duration-200
              ${
                isSelected
                  ? "bg-[hsl(var(--apple-bg-secondary))] text-[hsl(var(--apple-label))] shadow-[var(--apple-shadow-sm)]"
                  : "text-[hsl(var(--apple-label))] hover:text-[hsl(var(--apple-label))]"
              }
            `
              .trim()
              .replace(/\s+/g, " ")}
          >
            {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

SegmentedControl.displayName = "AppleSegmentedControl";
