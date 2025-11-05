import React from "react";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
type TypographyWeight =
  | "ultralight"
  | "thin"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "heavy"
  | "black";

interface BaseTypographyProps {
  as?: TypographyElement;
  weight?: TypographyWeight;
  className?: string;
  children: React.ReactNode;
}

/**
 * Apple HIG Typography System
 * Based on San Francisco font family and Apple's text styles
 *
 * Hierarchy:
 * - LargeTitle: 34px - Hero sections
 * - Title1: 28px - Main headings
 * - Title2: 22px - Section headings
 * - Title3: 20px - Subsection headings
 * - Headline: 17px - Emphasized content (semibold)
 * - Body: 17px - Standard content (regular)
 * - Callout: 16px - Secondary content
 * - Subheadline: 15px - Tertiary content
 * - Footnote: 13px - Supporting text
 * - Caption1: 12px - Small labels
 * - Caption2: 11px - Smallest text
 */

const getWeightClass = (weight?: TypographyWeight) => {
  if (!weight) return "";
  return `font-[var(--apple-weight-${weight})]`;
};

/**
 * Large Title - 34px
 * For hero sections and primary page titles
 */
export const LargeTitle: React.FC<BaseTypographyProps> = ({
  as: Component = "h1",
  weight = "bold",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-large-title)]
    leading-[var(--apple-line-height-tight)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    tracking-tight
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Title 1 - 28px
 * For main section headings
 */
export const Title1: React.FC<BaseTypographyProps> = ({
  as: Component = "h2",
  weight = "bold",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-title-1)]
    leading-[var(--apple-line-height-tight)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    tracking-tight
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Title 2 - 22px
 * For section titles
 */
export const Title2: React.FC<BaseTypographyProps> = ({
  as: Component = "h3",
  weight = "semibold",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-title-2)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Title 3 - 20px
 * For subsection titles
 */
export const Title3: React.FC<BaseTypographyProps> = ({
  as: Component = "h4",
  weight = "semibold",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-title-3)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Headline - 17px (semibold)
 * For emphasized content and list headings
 */
export const Headline: React.FC<BaseTypographyProps> = ({
  as: Component = "h5",
  weight = "semibold",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-headline)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Body - 17px (regular)
 * Default text style for body content
 */
export const Body: React.FC<BaseTypographyProps> = ({
  as: Component = "p",
  weight = "regular",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-body)]
    leading-[var(--apple-line-height-relaxed)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Callout - 16px
 * For secondary body text
 */
export const Callout: React.FC<BaseTypographyProps> = ({
  as: Component = "p",
  weight = "regular",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-callout)]
    leading-[var(--apple-line-height-relaxed)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Subheadline - 15px
 * For tertiary content and labels
 */
export const Subheadline: React.FC<BaseTypographyProps> = ({
  as: Component = "p",
  weight = "regular",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-subheadline)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label-secondary))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Footnote - 13px
 * For supporting information and metadata
 */
export const Footnote: React.FC<BaseTypographyProps> = ({
  as: Component = "p",
  weight = "regular",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-footnote)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label-secondary))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Caption1 - 12px
 * For small labels and captions
 */
export const Caption1: React.FC<BaseTypographyProps> = ({
  as: Component = "span",
  weight = "regular",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-caption-1)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label-tertiary))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Caption2 - 11px
 * For the smallest text elements
 */
export const Caption2: React.FC<BaseTypographyProps> = ({
  as: Component = "span",
  weight = "regular",
  className = "",
  children,
}) => {
  const classes = `
    text-[var(--apple-font-caption-2)]
    leading-[var(--apple-line-height-normal)]
    ${getWeightClass(weight)}
    text-[hsl(var(--apple-label-tertiary))]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};

/**
 * Generic Text component with full control
 */
export interface TextProps extends BaseTypographyProps {
  size?:
    | "large-title"
    | "title-1"
    | "title-2"
    | "title-3"
    | "headline"
    | "body"
    | "callout"
    | "subheadline"
    | "footnote"
    | "caption-1"
    | "caption-2";
  color?: "primary" | "secondary" | "tertiary" | "quaternary" | "blue" | "red" | "green" | "orange";
}

export const Text: React.FC<TextProps> = ({
  as: Component = "span",
  size = "body",
  weight = "regular",
  color = "primary",
  className = "",
  children,
}) => {
  const sizeClasses = {
    "large-title": "text-[var(--apple-font-large-title)]",
    "title-1": "text-[var(--apple-font-title-1)]",
    "title-2": "text-[var(--apple-font-title-2)]",
    "title-3": "text-[var(--apple-font-title-3)]",
    headline: "text-[var(--apple-font-headline)]",
    body: "text-[var(--apple-font-body)]",
    callout: "text-[var(--apple-font-callout)]",
    subheadline: "text-[var(--apple-font-subheadline)]",
    footnote: "text-[var(--apple-font-footnote)]",
    "caption-1": "text-[var(--apple-font-caption-1)]",
    "caption-2": "text-[var(--apple-font-caption-2)]",
  };

  const colorClasses = {
    primary: "text-[hsl(var(--apple-label))]",
    secondary: "text-[hsl(var(--apple-label-secondary))]",
    tertiary: "text-[hsl(var(--apple-label-tertiary))]",
    quaternary: "text-[hsl(var(--apple-label-quaternary))]",
    blue: "text-[hsl(var(--apple-blue))]",
    red: "text-[hsl(var(--apple-red))]",
    green: "text-[hsl(var(--apple-green))]",
    orange: "text-[hsl(var(--apple-orange))]",
  };

  const classes = `
    ${sizeClasses[size]}
    ${getWeightClass(weight)}
    ${colorClasses[color]}
    leading-[var(--apple-line-height-normal)]
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return <Component className={classes}>{children}</Component>;
};
