import { Edit, Trash2 } from "lucide-react";
import { FlashcardTypeBadge } from "@/components/flashcards/FlashcardTypeBadge";
import { useFlashcardFlip } from "@/hooks/useFlashcardFlip";
import { formatDate } from "@/lib/utils/date";
import type { FlashcardDTO } from "@/types";
import { memo, useMemo } from "react";

export interface FlashcardItemProps {
  flashcard: FlashcardDTO;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

interface FlashcardSideProps {
  flashcard: FlashcardDTO;
  side: "front" | "back";
  textSize: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isFlipping: boolean;
}

const FlashcardSide = memo(function FlashcardSide({
  flashcard,
  side,
  textSize,
  onEdit,
  onDelete,
  isFlipping,
}: FlashcardSideProps) {
  const isFront = side === "front";
  const content = isFront ? flashcard.front : flashcard.back;
  const sideLabel = isFront ? "PRZÓD" : "TYŁ";

  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="relative w-full h-full bg-white dark:bg-gray-900 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-6 shadow-[var(--apple-shadow-md)] hover:shadow-[var(--apple-shadow-lg)] transition-shadow duration-300 overflow-hidden">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <FlashcardTypeBadge type={flashcard.type} />
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--apple-blue))]/20 hover:bg-[hsl(var(--apple-blue))]/30 text-[hsl(var(--apple-blue))] transition-colors duration-200 relative z-30"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(flashcard.id);
              }}
              aria-label="Edytuj"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--apple-red))]/20 hover:bg-[hsl(var(--apple-red))]/30 text-[hsl(var(--apple-red))] transition-colors duration-200 relative z-30"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(flashcard.id);
              }}
              aria-label="Usuń"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center justify-center h-full px-4 pt-16 pb-12">
          <div
            className={`${textSize} ${isFront ? "font-semibold" : "font-medium"} text-[hsl(var(--apple-label))] text-center leading-relaxed break-words hyphens-auto`}
            style={{ wordBreak: "break-word" }}
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

        {/* Flip indicator - tylko gdy nie jest w trakcie obracania */}
        {!isFlipping && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-[hsl(var(--apple-label-quaternary))] pointer-events-none">
            {isFront ? "Kliknij aby zobaczyć tył" : "Kliknij aby zobaczyć przód"}
          </div>
        )}
      </div>
    </div>
  );
});

export const FlashcardItem = memo(function FlashcardItem({ flashcard, onEdit, onDelete }: FlashcardItemProps) {
  const { isFlipped, isFlipping, toggle } = useFlashcardFlip(false, 200); // 200ms dla szybszego przełączania w my-flashcards

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

  const handleToggle = () => {
    // W my-flashcards pozwalamy na wielokrotne odwracanie
    if (isFlipping) return;

    toggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  // Memoizacja label dla accessibility
  const ariaLabel = useMemo(() => {
    const side = isFlipped ? "tył" : "przód";
    const content = side === "przód" ? flashcard.front : flashcard.back;
    const instruction = isFlipping ? "Obracanie..." : "Kliknij aby przełączyć widok.";
    return `Fiszka ${side}: ${content}. ${instruction}`;
  }, [isFlipped, flashcard.front, flashcard.back, isFlipping]);

  return (
    <div className={`h-[320px] perspective-1000 ${!isFlipped ? "group" : ""}`}>
      <div
        className={`
          relative w-full h-full transition-transform duration-200 ease-out transform-style-preserve-3d
          cursor-pointer
          ${isFlipped ? "rotate-y-180" : ""}
          ${isFlipping ? "pointer-events-none" : ""}
          ${!isFlipped ? "group-hover:-translate-y-1" : ""}
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-pressed={isFlipped}
        data-testid="flashcard-item"
      >
        {/* Front Side */}
        <div className={`absolute inset-0 w-full h-full backface-visibility-hidden ${isFlipped ? "z-0" : "z-10"}`}>
          <FlashcardSide
            flashcard={flashcard}
            side="front"
            textSize={frontTextSize}
            onEdit={onEdit}
            onDelete={onDelete}
            isFlipping={isFlipping}
          />
        </div>

        {/* Back Side */}
        <div
          className={`absolute inset-0 w-full h-full backface-visibility-hidden rotate-y-180 ${isFlipped ? "z-10" : "z-0"}`}
        >
          <FlashcardSide
            flashcard={flashcard}
            side="back"
            textSize={backTextSize}
            onEdit={onEdit}
            onDelete={onDelete}
            isFlipping={isFlipping}
          />
        </div>
      </div>
    </div>
  );
});
