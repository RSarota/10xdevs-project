import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

// WARIANT 1: Minimalistyczna karta z "10x" - czysta i profesjonalna
export function LogoVariant1({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Główna karta */}
      <rect x="8" y="10" width="32" height="28" rx="5" fill="url(#gradient1)" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="26"
        fontSize="14"
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

// WARIANT 2: Karta z błyskawicą - dynamiczna, sugerująca szybkość nauki
export function LogoVariant2({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta */}
      <rect x="6" y="8" width="36" height="32" rx="6" fill="url(#gradient2)" />

      {/* Błyskawica */}
      <path
        d="M26 14L18 24H22L20 34L28 24H24L26 14Z"
        fill="white"
        stroke="white"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Mały "10x" w rogu */}
      <text
        x="32"
        y="14"
        fontSize="8"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>
    </svg>
  );
}

// WARIANT 3: Stos kart z efektem głębi - wielowarstwowość nauki
export function LogoVariant3({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta w tle */}
      <rect x="10" y="14" width="30" height="24" rx="4" fill="#007AFF" opacity="0.3" />

      {/* Karta w środku */}
      <rect x="9" y="12" width="30" height="24" rx="4" fill="#007AFF" opacity="0.5" />

      {/* Karta na wierzchu */}
      <rect x="8" y="10" width="30" height="24" rx="4" fill="url(#gradient3)" />

      {/* Tekst "10x" */}
      <text
        x="23"
        y="23"
        fontSize="12"
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

// WARIANT 4: Geometryczna karta z symbolem AI - nowoczesna i techniczna
export function LogoVariant4({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Zewnętrzna ramka karty */}
      <rect x="8" y="10" width="32" height="28" rx="5" fill="url(#gradient4)" />

      {/* Białe linie reprezentujące tekst na karcie */}
      <rect x="13" y="15" width="10" height="2" rx="1" fill="white" opacity="0.9" />
      <rect x="13" y="19" width="16" height="2" rx="1" fill="white" opacity="0.7" />

      {/* "10x" na dole */}
      <text
        x="24"
        y="30"
        fontSize="10"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>

      {/* Symbol AI - małe punkty */}
      <circle cx="32" cy="28" r="1.5" fill="white" opacity="0.9" />
      <circle cx="35" cy="28" r="1.5" fill="white" opacity="0.9" />
    </svg>
  );
}

// WARIANT 5: Karta z gwiazdką/iskrą - kreatywna i inspirująca
export function LogoVariant5({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Główna karta */}
      <rect x="7" y="12" width="34" height="26" rx="5" fill="url(#gradient5)" />

      {/* Gwiazdka/Iskra w lewym górnym rogu */}
      <path
        d="M15 18L16 20L18 21L16 22L15 24L14 22L12 21L14 20L15 18Z"
        fill="#FFD700"
        stroke="white"
        strokeWidth="0.5"
      />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="27"
        fontSize="13"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>

      {/* Małe iskierki wokół */}
      <circle cx="36" cy="16" r="1" fill="white" opacity="0.8" />
      <circle cx="38" cy="20" r="0.7" fill="white" opacity="0.6" />
    </svg>
  );
}

// WARIANT 6: Karta z obrotem/animacją - 3D perspective
export function LogoVariant6({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta z perspektywą 3D */}
      <path
        d="M8 16L24 10L40 16L40 32L24 38L8 32L8 16Z"
        fill="url(#gradient6)"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />

      {/* Tekst "10x" na karcie */}
      <text
        x="24"
        y="25"
        fontSize="12"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        transform="skewX(-5)"
      >
        10x
      </text>

      {/* Cień pod kartą */}
      <ellipse cx="24" cy="40" rx="16" ry="4" fill="#000" opacity="0.1" />
    </svg>
  );
}

// WARIANT 7: Karta z pękiem kart wychodzących - eksplozja wiedzy
export function LogoVariant7({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient7" x1="0%" y1="0%" x2="100%" y2="100%">
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
      <rect x="12" y="14" width="24" height="20" rx="4" fill="url(#gradient7)" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="25"
        fontSize="13"
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

// WARIANT 8: Karta z obwodem obwodu - cyfrowy, AI-powered
export function LogoVariant8({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient8" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta */}
      <rect x="8" y="10" width="32" height="28" rx="5" fill="url(#gradient8)" />

      {/* Obwód elektroniczny - linie połączeń */}
      <path
        d="M14 18L20 18M20 18L20 24M20 24L28 24M28 24L28 18M28 18L34 18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Węzły obwodu */}
      <circle cx="14" cy="18" r="2" fill="white" />
      <circle cx="20" cy="18" r="2" fill="white" />
      <circle cx="20" cy="24" r="2" fill="white" />
      <circle cx="28" cy="24" r="2" fill="white" />
      <circle cx="28" cy="18" r="2" fill="white" />
      <circle cx="34" cy="18" r="2" fill="white" />

      {/* Tekst "10x" na dole */}
      <text
        x="24"
        y="32"
        fontSize="11"
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

// WARIANT 9: Karta z falą - płynność i dynamika
export function LogoVariant9({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient9" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta z zaokrąglonymi górnymi rogami */}
      <rect x="8" y="10" width="32" height="28" rx="5" fill="url(#gradient9)" />

      {/* Fala na karcie */}
      <path d="M10 20 Q18 16, 24 20 T38 20" stroke="white" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M10 24 Q18 20, 24 24 T38 24" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="28"
        fontSize="13"
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

// WARIANT 10: Karta z promieniami - energia i inspiracja
export function LogoVariant10({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient10" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="rayGradient" cx="50%" cy="50%">
          <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#FFD700", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Promienie tła */}
      <circle cx="24" cy="24" r="20" fill="url(#rayGradient)" opacity="0.3" />

      {/* Główna karta */}
      <rect x="10" y="12" width="28" height="24" rx="5" fill="url(#gradient10)" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="25"
        fontSize="13"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>

      {/* Małe promienie wokół */}
      <path
        d="M24 8L24 4M24 44L24 40M8 24L4 24M44 24L40 24"
        stroke="#FFD700"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M32 12L34 10M14 36L12 38M34 36L32 38M14 12L12 10"
        stroke="#FFD700"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

// WARIANT 11: Karta zaginająca się - interaktywność i dynamika
export function LogoVariant11({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient11" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Dolna część karty */}
      <rect x="8" y="20" width="32" height="18" rx="4" fill="url(#gradient11)" />

      {/* Górna część karty - zaginająca się */}
      <path d="M8 20 Q24 16, 40 20 L40 24 Q24 20, 8 24 Z" fill="url(#gradient11)" opacity="0.9" />

      {/* Linia zgięcia */}
      <path d="M8 22 Q24 18, 40 22" stroke="white" strokeWidth="1" strokeOpacity="0.3" fill="none" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="28"
        fontSize="12"
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

// WARIANT 12: Karta z pikselami/cząstkami - digitalne, nowoczesne
export function LogoVariant12({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient12" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta z pikselowym efektem */}
      <rect x="8" y="10" width="32" height="28" rx="5" fill="url(#gradient12)" />

      {/* Piksele na karcie */}
      <rect x="12" y="14" width="3" height="3" fill="white" opacity="0.6" />
      <rect x="17" y="14" width="3" height="3" fill="white" opacity="0.4" />
      <rect x="22" y="14" width="3" height="3" fill="white" opacity="0.8" />
      <rect x="27" y="14" width="3" height="3" fill="white" opacity="0.5" />
      <rect x="32" y="14" width="3" height="3" fill="white" opacity="0.7" />

      <rect x="12" y="19" width="3" height="3" fill="white" opacity="0.5" />
      <rect x="17" y="19" width="3" height="3" fill="white" opacity="0.9" />
      <rect x="22" y="19" width="3" height="3" fill="white" opacity="0.3" />
      <rect x="27" y="19" width="3" height="3" fill="white" opacity="0.7" />
      <rect x="32" y="19" width="3" height="3" fill="white" opacity="0.6" />

      {/* Tekst "10x" z pikselowym efektem */}
      <text
        x="24"
        y="29"
        fontSize="12"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="1"
      >
        10x
      </text>

      {/* Piksele wokół */}
      <circle cx="14" cy="32" r="1.5" fill="white" opacity="0.4" />
      <circle cx="34" cy="32" r="1.5" fill="white" opacity="0.4" />
    </svg>
  );
}

// WARIANT 13: Karta jako portal/okno - symbol przejścia do wiedzy
export function LogoVariant13({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient13" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="portalGradient" cx="50%" cy="50%">
          <stop offset="0%" style={{ stopColor: "#00D4FF", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "#007AFF", stopOpacity: 0.6 }} />
        </radialGradient>
      </defs>

      {/* Zewnętrzna ramka karty */}
      <rect x="6" y="8" width="36" height="32" rx="6" fill="url(#gradient13)" />

      {/* Portal/wewnętrzne okno */}
      <circle cx="24" cy="24" r="12" fill="url(#portalGradient)" />

      {/* Koncentryczne koła - efekt portalu */}
      <circle cx="24" cy="24" r="10" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
      <circle cx="24" cy="24" r="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="26"
        fontSize="11"
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

// WARIANT 14: Karta z hologramem - futurystyczny efekt
export function LogoVariant14({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient14" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="hologramGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#00D4FF", stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: "#007AFF", stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>

      {/* Główna karta */}
      <rect x="8" y="10" width="32" height="28" rx="5" fill="url(#gradient14)" />

      {/* Holograficzne linie */}
      <line x1="10" y1="14" x2="38" y2="14" stroke="url(#hologramGradient)" strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="18" x2="38" y2="18" stroke="url(#hologramGradient)" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="22" x2="38" y2="22" stroke="url(#hologramGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="10" y1="26" x2="38" y2="26" stroke="url(#hologramGradient)" strokeWidth="1" opacity="0.3" />

      {/* Tekst "10x" z efektem hologramu */}
      <text
        x="24"
        y="25"
        fontSize="13"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>

      {/* Efekt rozproszonych cząstek */}
      <circle cx="12" cy="20" r="1" fill="#00D4FF" opacity="0.6" />
      <circle cx="36" cy="28" r="1" fill="#00D4FF" opacity="0.6" />
      <circle cx="30" cy="16" r="0.8" fill="#00D4FF" opacity="0.4" />
    </svg>
  );
}

// WARIANT 15: Karta w formie origami - elegancka, złożona
export function LogoVariant15({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient15a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient15b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#007AFF", stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>

      {/* Główna część karty */}
      <path d="M8 16L24 10L40 16L40 32L24 38L8 32Z" fill="url(#gradient15a)" />

      {/* Złożony róg origami */}
      <path d="M8 16L24 10L24 24L8 32Z" fill="url(#gradient15b)" opacity="0.7" />

      {/* Linia zgięcia */}
      <line x1="8" y1="16" x2="24" y2="24" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="24" y1="10" x2="24" y2="24" stroke="white" strokeWidth="1" strokeOpacity="0.3" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="26"
        fontSize="12"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>

      {/* Cień dla głębi */}
      <path d="M8 32L24 38L40 32L40 36L24 42L8 36Z" fill="#000" opacity="0.1" />
    </svg>
  );
}

// WARIANT 16: Glassmorphism - trendy szklany efekt z blur
export function LogoVariant16({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 0.3 }} />
          <stop offset="50%" style={{ stopColor: "#5856D6", stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: "#AF52DE", stopOpacity: 0.3 }} />
        </linearGradient>
        <filter id="glassBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Tło gradient */}
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#glassGradient)" />

      {/* Karta glassmorphism */}
      <rect x="8" y="10" width="32" height="28" rx="8" fill="rgba(255, 255, 255, 0.15)" />
      <rect x="8" y="10" width="32" height="28" rx="8" fill="url(#glassGradient)" opacity="0.6" />

      {/* Białe ramki dla efektu szkła */}
      <rect x="8" y="10" width="32" height="28" rx="8" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="26"
        fontSize="13"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        filter="url(#glassBlur)"
      >
        10x
      </text>

      {/* Błyszczący refleks */}
      <rect x="10" y="12" width="28" height="8" rx="4" fill="rgba(255, 255, 255, 0.2)" />
    </svg>
  );
}

// WARIANT 17: Neumorphism - miękki, wypukły efekt (Soft UI)
export function LogoVariant17({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="neuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#E8ECF0", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#D1D9E0", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="neuShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="3" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Tło */}
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#neuGradient)" />

      {/* Główna karta neumorphism */}
      <rect x="10" y="12" width="28" height="24" rx="6" fill="url(#neuGradient)" filter="url(#neuShadow)" />

      {/* Wewnętrzny cień */}
      <rect x="12" y="14" width="24" height="20" rx="5" fill="none" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="1" />
      <rect x="13" y="15" width="22" height="18" rx="4" fill="none" stroke="rgba(0, 0, 0, 0.1)" strokeWidth="1" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="25"
        fontSize="12"
        fontWeight="700"
        fill="#007AFF"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>
    </svg>
  );
}

// WARIANT 18: Gradient Mesh - nowoczesny, organiczny gradient
export function LogoVariant18({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="meshGradient1" cx="30%" cy="20%">
          <stop offset="0%" style={{ stopColor: "#FF6B9D", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#FF6B9D", stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="meshGradient2" cx="70%" cy="80%">
          <stop offset="0%" style={{ stopColor: "#4ECDC4", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#4ECDC4", stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id="meshGradient3" cx="50%" cy="50%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#007AFF", stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>

      {/* Mesh gradient tło */}
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#meshGradient1)" />
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#meshGradient2)" />
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#meshGradient3)" />

      {/* Karta */}
      <rect x="8" y="10" width="32" height="28" rx="6" fill="url(#cardGradient)" />

      {/* Tekst "10x" */}
      <text
        x="24"
        y="25"
        fontSize="13"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10x
      </text>

      {/* Organiczne kształty na karcie */}
      <circle cx="16" cy="18" r="3" fill="rgba(255, 255, 255, 0.2)" />
      <circle cx="32" cy="30" r="2" fill="rgba(255, 255, 255, 0.15)" />
    </svg>
  );
}

// WARIANT 19: Brutalist - bold, geometryczny, trendy
export function LogoVariant19({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brutalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#FF1744", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#E91E63", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#9C27B0", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Brutalistyczna karta - ostre krawędzie */}
      <rect x="6" y="8" width="36" height="32" rx="0" fill="url(#brutalGradient)" />

      {/* Geometryczne kształty */}
      <rect x="10" y="12" width="8" height="8" fill="white" opacity="0.9" />
      <rect x="20" y="12" width="8" height="8" fill="white" opacity="0.9" />
      <rect x="30" y="12" width="8" height="8" fill="white" opacity="0.9" />

      {/* Tekst "10x" - bold i duży */}
      <text
        x="24"
        y="29"
        fontSize="14"
        fontWeight="900"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2"
      >
        10x
      </text>

      {/* Czarne akcenty brutalistyczne */}
      <rect x="6" y="8" width="36" height="4" fill="#000" opacity="0.3" />
      <rect x="6" y="36" width="36" height="4" fill="#000" opacity="0.3" />
    </svg>
  );
}

// WARIANT 20: Floating Card - miękki, unoszący się efekt z soft shadows
export function LogoVariant20({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="floatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#667EEA", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#764BA2", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="softShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="6" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Miękki cień */}
      <ellipse cx="24" cy="42" rx="14" ry="4" fill="#000" opacity="0.15" />

      {/* Unosząca się karta */}
      <rect x="10" y="8" width="28" height="26" rx="8" fill="url(#floatGradient)" filter="url(#softShadow)" />

      {/* Subtelny glow */}
      <rect x="10" y="8" width="28" height="26" rx="8" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />

      {/* Tekst "10x" z glow */}
      <text
        x="24"
        y="22"
        fontSize="13"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        filter="url(#glow)"
      >
        10x
      </text>

      {/* Subtelne refleksy */}
      <path d="M10 8L24 14L38 8" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" fill="none" />
    </svg>
  );
}

// WARIANT 21: 10xCards - Minimalistyczny z pełną nazwą
export function LogoVariant21({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient21" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta */}
      <rect x="4" y="8" width="40" height="32" rx="6" fill="url(#gradient21)" />

      {/* Tekst "10xCards" */}
      <text
        x="24"
        y="26"
        fontSize="10"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.5"
      >
        10xCards
      </text>
    </svg>
  );
}

// WARIANT 22: 10xCards - Badge style z ikoną karty
export function LogoVariant22({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient22" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Badge kształt */}
      <path
        d="M8 12C8 9.79086 9.79086 8 12 8H36C38.2091 8 40 9.79086 40 12V36C40 38.2091 38.2091 40 36 40H12C9.79086 40 8 38.2091 8 36V12Z"
        fill="url(#gradient22)"
      />

      {/* Mała ikona karty w lewym górnym rogu */}
      <rect x="10" y="10" width="8" height="6" rx="1" fill="white" opacity="0.3" />

      {/* Tekst "10xCards" */}
      <text
        x="24"
        y="26"
        fontSize="9"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10xCards
      </text>

      {/* Dekoracyjna linia */}
      <line x1="10" y1="32" x2="38" y2="32" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// WARIANT 23: 10xCards - Stacked z akcentem
export function LogoVariant23({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient23a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 0.4 }} />
        </linearGradient>
        <linearGradient id="gradient23b" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Tło karta */}
      <rect x="6" y="14" width="36" height="24" rx="4" fill="url(#gradient23a)" />

      {/* Główna karta */}
      <rect x="8" y="10" width="36" height="24" rx="4" fill="url(#gradient23b)" />

      {/* Tekst "10xCards" */}
      <text
        x="26"
        y="24"
        fontSize="9"
        fontWeight="700"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        10xCards
      </text>

      {/* Akcent - mała karta */}
      <rect x="34" y="12" width="6" height="4" rx="0.5" fill="white" opacity="0.6" />
    </svg>
  );
}

// WARIANT 24: 10xCards - Modern typography z ikoną
export function LogoVariant24({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="gradient24" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta */}
      <rect x="6" y="10" width="36" height="28" rx="6" fill="url(#gradient24)" />

      {/* Ikona karty w lewym górnym rogu */}
      <rect x="10" y="14" width="10" height="7" rx="1" fill="white" opacity="0.2" />
      <rect x="10" y="14" width="10" height="7" rx="1" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />

      {/* Tekst "10xCards" - większy i bardziej widoczny */}
      <text
        x="24"
        y="28"
        fontSize="11"
        fontWeight="800"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="1"
      >
        10xCards
      </text>
    </svg>
  );
}

// WARIANT 25: 10xCards - Gradient text z konturem
export function LogoVariant25({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cardGradient25" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#007AFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#5856D6", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="textGradient25" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#FFFFFF", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#E0E0E0", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Karta z gradientem */}
      <rect x="6" y="10" width="36" height="28" rx="6" fill="url(#cardGradient25)" />

      {/* Tekst "10xCards" z konturem */}
      <text
        x="24"
        y="26"
        fontSize="10"
        fontWeight="900"
        fill="url(#textGradient25)"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="0.8"
        stroke="#000"
        strokeWidth="0.3"
        strokeOpacity="0.2"
      >
        10xCards
      </text>

      {/* Dekoracyjne linie */}
      <line x1="10" y1="20" x2="18" y2="20" stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1="30" y1="20" x2="38" y2="20" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// Komponent demonstracyjny wszystkich wariantów
export function LogoShowcase() {
  const variants = [
    {
      component: LogoVariant1,
      name: "Wariant 1: Minimalistyczny",
      description: "Czysta, profesjonalna karta z tekstem 10x",
    },
    { component: LogoVariant2, name: "Wariant 2: Błyskawica", description: "Dynamiczny, sugeruje szybkość nauki" },
    { component: LogoVariant3, name: "Wariant 3: Stos kart", description: "Efekt głębi, wielowarstwowość wiedzy" },
    {
      component: LogoVariant4,
      name: "Wariant 4: Geometryczny",
      description: "Nowoczesny, technologiczny z elementami AI",
    },
    { component: LogoVariant5, name: "Wariant 5: Z gwiazdką", description: "Kreatywny, inspirujący z iskrami" },
    {
      component: LogoVariant6,
      name: "Wariant 6: 3D Perspective",
      description: "Karta z perspektywą 3D, dynamiczna i nowoczesna",
    },
    {
      component: LogoVariant7,
      name: "Wariant 7: Eksplozja kart",
      description: "Karty rozchodzące się w różnych kierunkach - eksplozja wiedzy",
    },
    {
      component: LogoVariant8,
      name: "Wariant 8: Obwód elektroniczny",
      description: "Cyfrowy design z elementami AI i technologii",
    },
    {
      component: LogoVariant9,
      name: "Wariant 9: Fala",
      description: "Płynność i dynamika - ciągły przepływ nauki",
    },
    {
      component: LogoVariant10,
      name: "Wariant 10: Promienie energii",
      description: "Energia i inspiracja - promienie wokół karty",
    },
    {
      component: LogoVariant11,
      name: "Wariant 11: Karta zaginająca się",
      description: "Karta z efektem zaginania - interaktywność i dynamika",
    },
    {
      component: LogoVariant12,
      name: "Wariant 12: Pikselowy",
      description: "Digitalny design z efektem pikseli - nowoczesny i technologiczny",
    },
    {
      component: LogoVariant13,
      name: "Wariant 13: Portal",
      description: "Karta jako portal/okno - symbol przejścia do wiedzy",
    },
    {
      component: LogoVariant14,
      name: "Wariant 14: Hologram",
      description: "Futurystyczny efekt hologramu - nowoczesna technologia",
    },
    {
      component: LogoVariant15,
      name: "Wariant 15: Origami",
      description: "Elegancka karta w formie origami - złożona i wyrafinowana",
    },
    {
      component: LogoVariant16,
      name: "Wariant 16: Glassmorphism",
      description: "Trendy szklany efekt z blur - nowoczesny i minimalistyczny",
    },
    {
      component: LogoVariant17,
      name: "Wariant 17: Neumorphism",
      description: "Miękki, wypukły efekt Soft UI - trendy i elegancki",
    },
    {
      component: LogoVariant18,
      name: "Wariant 18: Gradient Mesh",
      description: "Organiczny gradient mesh - żywy i nowoczesny",
    },
    {
      component: LogoVariant19,
      name: "Wariant 19: Brutalist",
      description: "Bold, geometryczny design - mocny i odważny",
    },
    {
      component: LogoVariant20,
      name: "Wariant 20: Floating Card",
      description: "Unosząca się karta z miękkimi cieniami - delikatna i nowoczesna",
    },
    {
      component: LogoVariant21,
      name: "Wariant 21: 10xCards Minimalistyczny",
      description: "Czysta karta z pełną nazwą marki - profesjonalny i czytelny",
    },
    {
      component: LogoVariant22,
      name: "Wariant 22: 10xCards Badge",
      description: "Badge style z ikoną karty i pełną nazwą - rozpoznawalny",
    },
    {
      component: LogoVariant23,
      name: "Wariant 23: 10xCards Stacked",
      description: "Karty ułożone jedna na drugiej z pełną nazwą - efekt głębi",
    },
    {
      component: LogoVariant24,
      name: "Wariant 24: 10xCards Typography",
      description: "Nowoczesna typografia z ikoną karty - elegancki i czytelny",
    },
    {
      component: LogoVariant25,
      name: "Wariant 25: 10xCards Gradient Text",
      description: "Gradient text z konturem i pełną nazwą - dynamiczny i wyróżniający się",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--apple-grouped-bg))] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-[hsl(var(--apple-label))]">
          Propozycje Logo dla 10xCards
        </h1>
        <p className="text-center text-[hsl(var(--apple-label-secondary))] mb-12">
          Wybierz wariant, który najlepiej reprezentuje Twoją markę (25 wariantów do wyboru)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="bg-[hsl(var(--apple-bg-secondary))] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center gap-4">
                {/* Logo na jasnym tle */}
                <div className="bg-white rounded-xl p-4 w-full flex items-center justify-center shadow-sm">
                  <variant.component size={64} />
                </div>

                {/* Logo na ciemnym tle */}
                <div className="bg-gray-900 rounded-xl p-4 w-full flex items-center justify-center shadow-sm">
                  <variant.component size={64} />
                </div>

                {/* Opis */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-[hsl(var(--apple-label))] mb-1">{variant.name}</h3>
                  <p className="text-xs text-[hsl(var(--apple-label-secondary))] leading-relaxed">
                    {variant.description}
                  </p>
                </div>

                {/* Rozmiary - mini preview */}
                <div className="flex gap-2 items-center justify-center pt-2 border-t border-[hsl(var(--apple-separator-opaque))] w-full">
                  <variant.component size={16} />
                  <variant.component size={24} />
                  <variant.component size={32} />
                  <variant.component size={40} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-[hsl(var(--apple-bg-secondary))] rounded-2xl p-8 inline-block">
            <h3 className="text-lg font-semibold text-[hsl(var(--apple-label))] mb-4">
              Porównanie w różnych kontekstach:
            </h3>
            <div className="flex gap-8 items-center justify-center flex-wrap">
              {variants.map((variant, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="bg-white rounded-lg p-3">
                    <variant.component size={40} />
                  </div>
                  <span className="text-xs text-[hsl(var(--apple-label-tertiary))]">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
