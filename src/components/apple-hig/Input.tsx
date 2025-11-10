import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

/**
 * Apple HIG Input Component
 *
 * Features:
 * - Clean, minimalist design with subtle borders
 * - Blue focus ring animation
 * - Label always visible (not floating)
 * - Inline validation feedback
 * - Support for icons and right elements
 * - Proper accessibility with ARIA attributes
 */
const slugifyForTestId = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, success, icon, rightElement, className = "", id, disabled, ...props }, ref) => {
    const { ["data-testid"]: dataTestId, ...restProps } = props;
    const reactId = React.useId();
    const inputId = id || `input-${reactId}`;
    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const baseTestId =
      dataTestId || (label ? `input-${slugifyForTestId(label)}` : `input-${slugifyForTestId(inputId)}`);

    // Input wrapper classes
    const wrapperClasses = `
      relative flex items-center gap-2
      px-[var(--apple-space-4)] py-[var(--apple-space-3)]
      bg-[hsl(var(--apple-grouped-bg-secondary))]
      border border-[hsl(var(--apple-separator-opaque))]
      rounded-[var(--apple-radius-medium)]
      transition-all duration-[var(--apple-spring-duration)]
      ease-[var(--apple-spring-easing)]
      ${hasError ? "border-[hsl(var(--apple-red))] ring-1 ring-[hsl(var(--apple-red))]/20" : ""}
      ${hasSuccess ? "border-[hsl(var(--apple-green))] ring-1 ring-[hsl(var(--apple-green))]/20" : ""}
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-[hsl(var(--apple-separator))]/60"}
      focus-within:border-[hsl(var(--apple-blue))]
      focus-within:ring-2 focus-within:ring-[hsl(var(--apple-blue))]/20
      focus-within:shadow-[var(--apple-shadow-sm)]
    `
      .trim()
      .replace(/\s+/g, " ");

    // Input base classes
    const inputClasses = `
      flex-1 w-full min-w-0
      bg-transparent
      text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]
      placeholder:text-[hsl(var(--apple-label-tertiary))]
      outline-none
      disabled:cursor-not-allowed
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div className="flex flex-col gap-[var(--apple-space-2)]">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-medium)] text-[hsl(var(--apple-label))]"
          >
            {label}
          </label>
        )}

        <div className={wrapperClasses}>
          {icon && <div className="flex-shrink-0 text-[hsl(var(--apple-label-secondary))]">{icon}</div>}

          <input
            ref={ref}
            id={inputId}
            data-testid={baseTestId}
            className={`${inputClasses} ${className}`}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...restProps}
          />

          {rightElement && <div className="flex-shrink-0">{rightElement}</div>}

          {/* Status icons */}
          {hasError && !rightElement && (
            <svg
              className="flex-shrink-0 w-5 h-5 text-[hsl(var(--apple-red))]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}

          {hasSuccess && !rightElement && (
            <svg
              className="flex-shrink-0 w-5 h-5 text-[hsl(var(--apple-green))]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Helper text or error message */}
        {error && (
          <p
            id={`${inputId}-error`}
            data-testid={`${baseTestId}-error`}
            className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-red))] animate-in slide-in-from-top-1 duration-200"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "AppleInput";

/**
 * TextArea Component - for multi-line input
 */
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, helperText, error, success, className = "", id, disabled, ...props }, ref) => {
    const { ["data-testid"]: dataTestId, ...restProps } = props;
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const baseTestId =
      dataTestId || (label ? `textarea-${slugifyForTestId(label)}` : `textarea-${slugifyForTestId(textareaId)}`);

    const wrapperClasses = `
      relative flex
      px-[var(--apple-space-4)] py-[var(--apple-space-3)]
      bg-[hsl(var(--apple-grouped-bg-secondary))]
      border border-[hsl(var(--apple-separator-opaque))]
      rounded-[var(--apple-radius-medium)]
      transition-all duration-[var(--apple-spring-duration)]
      ease-[var(--apple-spring-easing)]
      ${hasError ? "border-[hsl(var(--apple-red))] ring-1 ring-[hsl(var(--apple-red))]/20" : ""}
      ${hasSuccess ? "border-[hsl(var(--apple-green))] ring-1 ring-[hsl(var(--apple-green))]/20" : ""}
      ${disabled ? "opacity-40 cursor-not-allowed" : "hover:border-[hsl(var(--apple-separator))]/60"}
      focus-within:border-[hsl(var(--apple-blue))]
      focus-within:ring-2 focus-within:ring-[hsl(var(--apple-blue))]/20
      focus-within:shadow-[var(--apple-shadow-sm)]
    `
      .trim()
      .replace(/\s+/g, " ");

    const textareaClasses = `
          flex-1 w-full min-w-0 resize-none
          bg-transparent
          text-[var(--apple-font-body)] text-[hsl(var(--apple-label))]
          placeholder:text-[hsl(var(--apple-label-tertiary))]
          outline-none
          disabled:cursor-not-allowed
        `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <div className="flex flex-col gap-[var(--apple-space-2)]">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[var(--apple-font-subheadline)] font-[var(--apple-weight-medium)] text-[hsl(var(--apple-label))]"
          >
            {label}
          </label>
        )}

        <div className={wrapperClasses}>
          <textarea
            ref={ref}
            id={textareaId}
            data-testid={baseTestId}
            className={`${textareaClasses} ${className}`}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
            {...restProps}
          />
        </div>

        {error && (
          <p
            id={`${textareaId}-error`}
            data-testid={`${baseTestId}-error`}
            className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-red))] animate-in slide-in-from-top-1 duration-200"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="text-[var(--apple-font-footnote)] text-[hsl(var(--apple-label-secondary))]"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "AppleTextArea";
