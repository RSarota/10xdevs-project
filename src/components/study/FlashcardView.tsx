import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { FlashcardTypeBadge } from "@/components/flashcards/FlashcardTypeBadge";
import { formatDate } from "@/lib/utils/date";
import type { FlashcardDTO } from "@/types";
import type { KeyboardEventHandler } from "react";

interface FlashcardViewProps {
  flashcard: FlashcardDTO;
  isRevealed: boolean;
  onReveal: () => void;
}

interface FlashcardSideProps {
  flashcard: FlashcardDTO;
  side: "front" | "back";
  textSize: string;
  isFlipping: boolean;
}

function FlashcardSide({ flashcard, side, textSize, isFlipping }: FlashcardSideProps) {
  const isFront = side === "front";
  const content = isFront ? flashcard.front : flashcard.back;
  const sideLabel = isFront ? "PRZÓD" : "TYŁ";

  return (
    <div
      className="absolute inset-0 w-full h-full"
      data-testid={isFront ? "flashcard-front-side" : "flashcard-back-side"}
    >
      <div className="relative w-full h-full bg-white dark:bg-gray-900 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-[var(--apple-shadow-md)] transition-shadow duration-300 overflow-hidden">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <FlashcardTypeBadge type={flashcard.type} />
        </div>

        {/* Content */}
        <div className="flex items-center justify-center h-full px-6 md:px-8 pt-16 pb-16 md:pb-20">
          <div
            className={`${textSize} ${isFront ? "font-semibold" : "font-medium"} text-[hsl(var(--apple-label))] text-center leading-relaxed break-words hyphens-auto max-w-full`}
            style={{ wordBreak: "break-word" }}
            data-testid={isFront ? "flashcard-front-content" : "flashcard-back-content"}
          >
            {content}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <span className="text-xs text-[hsl(var(--apple-label-secondary))] font-medium uppercase tracking-wider">
            {sideLabel}
          </span>
          <span className="text-xs text-[hsl(var(--apple-label-tertiary))]">{formatDate(flashcard.created_at)}</span>
        </div>

        {/* Flip indicator - only when not flipping */}
        {!isFlipping && !isFront && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-[hsl(var(--apple-label-quaternary))] pointer-events-none">
            Fiszka odsłonięta
          </div>
        )}
        {!isFlipping && isFront && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-[hsl(var(--apple-label-quaternary))] pointer-events-none">
            Kliknij aby odsłonić
          </div>
        )}
      </div>
    </div>
  );
}

export function FlashcardView({ flashcard, isRevealed, onReveal }: FlashcardViewProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const lastClickTime = useRef(0);

  // Reset stan animacji przy zmianie fiszki
  useEffect(() => {
    setIsFlipping(false);
    lastClickTime.current = 0;
  }, [flashcard.id]);

  const getTextSize = (length: number) => {
    if (length > 500) return "text-xs";
    if (length > 400) return "text-xs";
    if (length > 300) return "text-sm";
    if (length > 200) return "text-base";
    if (length > 100) return "text-lg";
    if (length > 50) return "text-xl";
    return "text-2xl";
  };

  const frontTextSize = useMemo(() => getTextSize(flashcard.front.length), [flashcard.front.length]);
  const backTextSize = useMemo(() => getTextSize(flashcard.back.length), [flashcard.back.length]);

  const handleReveal = useCallback(() => {
    // Protection against double-click (debounce)
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      return; // Ignore clicks within 500ms
    }
    lastClickTime.current = now;

    // Block if already revealed or in the process of flipping
    if (isRevealed || isFlipping) {
      return;
    }

    // Start animation
    setIsFlipping(true);

    // After animation, call callback
    setTimeout(() => {
      setIsFlipping(false);
      onReveal();
    }, 300);
  }, [isRevealed, isFlipping, onReveal]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleReveal();
    }
  };

  const canFlip = !isRevealed;

  const ariaLabel = useMemo(() => {
    const side = isRevealed ? "tył" : "przód";
    const content = side === "przód" ? flashcard.front : flashcard.back;
    const instruction = isFlipping ? "Obracanie..." : canFlip ? "Kliknij aby odsłonić." : "Fiszka odsłonięta.";
    return `Fiszka ${side}: ${content}. ${instruction}`;
  }, [isRevealed, flashcard.front, flashcard.back, isFlipping, canFlip]);

  return (
    <div className="w-full max-w-2xl xl:max-w-xl mx-auto">
      <div className="h-[400px] md:h-[450px] lg:h-[480px] xl:h-[420px] w-full perspective-1000">
        <div
          className={`
            relative w-full h-full transition-transform duration-300 ease-out transform-style-preserve-3d
            ${isRevealed ? "" : "cursor-pointer"}
            ${isRevealed || isFlipping ? "rotate-y-180" : ""}
            ${isFlipping ? "pointer-events-none" : ""}
          `}
          onClick={isRevealed ? undefined : handleReveal}
          onKeyDown={isRevealed ? undefined : handleKeyDown}
          role={isRevealed ? undefined : "button"}
          tabIndex={canFlip ? 0 : -1}
          aria-label={ariaLabel}
          aria-pressed={isRevealed}
          data-testid="flashcard-view"
        >
          {/* Front Side */}
          <div
            className={`absolute inset-0 w-full h-full backface-visibility-hidden ${isRevealed || isFlipping ? "z-0" : "z-10"}`}
          >
            <FlashcardSide flashcard={flashcard} side="front" textSize={frontTextSize} isFlipping={isFlipping} />
          </div>

          {/* Back Side */}
          <div
            className={`absolute inset-0 w-full h-full backface-visibility-hidden rotate-y-180 ${isRevealed && !isFlipping ? "z-10" : "z-0"}`}
          >
            <FlashcardSide flashcard={flashcard} side="back" textSize={backTextSize} isFlipping={isFlipping} />
          </div>

          {/* Loading indicator during animation */}
          {isFlipping && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 border-2 border-[hsl(var(--apple-blue))]/30 border-t-[hsl(var(--apple-blue))] rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
