import { Button, Stack, Body } from "@/components/apple-hig";

interface RatingControlsProps {
  onRatingSelect: (rating: number) => void;
  disabled?: boolean;
}

const RATINGS = [
  { value: 1, label: "1 - Bardzo trudne", color: "red" as const },
  { value: 2, label: "2 - Trudne", color: "orange" as const },
  { value: 3, label: "3 - Średnie", color: "gray" as const },
  { value: 4, label: "4 - Dobre", color: "blue" as const },
  { value: 5, label: "5 - Łatwe", color: "green" as const },
];

export function RatingControls({ onRatingSelect, disabled = false }: RatingControlsProps) {
  return (
    <Stack direction="vertical" spacing="sm" align="stretch" className="w-full" data-testid="rating-controls">
      <Body className="text-[hsl(var(--apple-label-secondary))]">Jak poszło? Wybierz ocenę</Body>
      <div className="grid w-full gap-[var(--apple-space-3)] sm:grid-cols-2 lg:grid-cols-5">
        {RATINGS.map((rating) => (
          <Button
            key={rating.value}
            variant="filled"
            color={rating.color}
            disabled={disabled}
            onClick={() => onRatingSelect(rating.value)}
            fullWidth
            data-testid={`rating-button-${rating.value}`}
          >
            {rating.label}
          </Button>
        ))}
      </div>
    </Stack>
  );
}
