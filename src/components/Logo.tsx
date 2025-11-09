import React, { useId } from "react";

interface LogoProps {
  size?: number;
  className?: string;
  variant?: "default" | "white" | "gradient";
}

export function Logo({ size = 32, className = "", variant = "default" }: LogoProps) {
  const gradientId = useId();
  const uniqueGradientId = `logo-gradient-${gradientId.replace(/:/g, "-")}`;

  // Determine fill color based on variant
  const getMainCardFill = () => {
    if (variant === "white") {
      return "white";
    }
    if (variant === "gradient") {
      return `url(#${uniqueGradientId})`;
    }
    return `url(#${uniqueGradientId})`; // default uses gradient
  };

  const getTextFill = () => {
    if (variant === "white") {
      return "#007AFF"; // Blue text on white background
    }
    return "white"; // White text on gradient/colored background
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="10xCards Logo"
    >
      <defs>
        <linearGradient id={uniqueGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karty rozchodzące się w różnych kierunkach */}
      <rect x="14" y="8" width="20" height="14" rx="2" fill="#007AFF" opacity="0.4" transform="rotate(-15 24 15)" />
      <rect x="14" y="26" width="20" height="14" rx="2" fill="#007AFF" opacity="0.4" transform="rotate(15 24 33)" />
      <rect x="6" y="16" width="20" height="14" rx="2" fill="#007AFF" opacity="0.4" transform="rotate(-25 16 23)" />
      <rect x="22" y="16" width="20" height="14" rx="2" fill="#007AFF" opacity="0.4" transform="rotate(25 32 23)" />

      {/* Główna karta centralna */}
      <rect x="12" y="14" width="24" height="20" rx="4" fill={getMainCardFill()} />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="25"
        fontSize="13"
        fontWeight="700"
        fill={getTextFill()}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>
    </svg>
  );
}

// Compact version for favicon and small spaces
export function LogoCompact({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="10xCards"
    >
      <defs>
        <linearGradient id="compact-gradient-v7" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karty rozchodzące się w różnych kierunkach - uproszczone dla małych rozmiarów */}
      <rect x="10" y="4" width="16" height="12" rx="1.5" fill="#007AFF" opacity="0.3" transform="rotate(-12 18 10)" />
      <rect x="10" y="32" width="16" height="12" rx="1.5" fill="#007AFF" opacity="0.3" transform="rotate(12 18 38)" />

      {/* Główna karta centralna */}
      <rect x="8" y="10" width="20" height="16" rx="3" fill="url(#compact-gradient-v7)" />

      {/* Tekst "10x" */}
      <text
        x="18"
        y="19"
        fontSize="10"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>
    </svg>
  );
}
