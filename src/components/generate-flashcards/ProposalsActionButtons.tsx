import { Save, RotateCcw } from "lucide-react";
import { Stack, Callout, Button } from "@/components/apple-hig";
import { formatFlashcardCount } from "@/lib/utils/flashcardCount";

interface ProposalsActionButtonsProps {
  acceptedCount: number;
  saving: boolean;
  onStartOver: () => void;
  onSave: () => void;
}

export function ProposalsActionButtons({ acceptedCount, saving, onStartOver, onSave }: ProposalsActionButtonsProps) {
  return (
    <>
      <div className="border-t border-[hsl(var(--apple-separator-opaque))] pt-4" />
      <Stack direction="vertical" spacing="sm" className="sm:flex-row sm:justify-between sm:items-center">
        <Callout className="text-[hsl(var(--apple-label-secondary))]">{formatFlashcardCount(acceptedCount)}</Callout>
        <Stack direction="horizontal" spacing="sm" className="flex-wrap">
          <Button variant="default" color="blue" size="medium" onClick={onStartOver}>
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Od nowa</span>
          </Button>
          <Button variant="filled" color="green" size="medium" onClick={onSave} disabled={saving} isLoading={saving}>
            <Save className="w-4 h-4" />
            {saving ? "Zapisywanie..." : "Zapisz teraz"}
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
