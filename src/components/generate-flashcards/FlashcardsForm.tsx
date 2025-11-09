import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button, Card, TextArea, Stack, Badge } from "@/components/apple-hig";

interface FlashcardsFormProps {
  onSubmit: (text: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const MIN_LENGTH = 1000;
const MAX_LENGTH = 10000;

export function FlashcardsForm({ onSubmit, loading, disabled = false }: FlashcardsFormProps) {
  const [text, setText] = useState("");

  const textLength = text.length;
  const isValid = textLength >= MIN_LENGTH && textLength <= MAX_LENGTH;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    setText(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid || disabled) {
      return;
    }

    onSubmit(text);
  };

  const getBadgeColor = () => {
    if (textLength < MIN_LENGTH) return "gray";
    if (textLength > MAX_LENGTH) return "red";
    return "green";
  };

  return (
    <Card elevation="md" padding="xl" variant="grouped" className="h-fit">
      <form onSubmit={handleSubmit}>
        <Stack direction="vertical" spacing="lg">
          <TextArea
            id="source-text"
            value={text}
            onChange={handleChange}
            placeholder="Wklej tutaj tekst z którego chcesz wygenerować fiszki..."
            className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] font-mono text-sm !resize-y"
            disabled={loading || disabled}
            rows={20}
          />

          <Stack direction="horizontal" justify="between" align="center" wrap>
            <Badge color={getBadgeColor()} variant="outlined" size="md">
              {textLength.toLocaleString()} / {MAX_LENGTH.toLocaleString()} znaków
            </Badge>
            {textLength > 0 && textLength < MIN_LENGTH && (
              <span className="text-[var(--apple-font-caption-1)] text-[hsl(var(--apple-label-tertiary))]">
                Minimum {MIN_LENGTH.toLocaleString()} znaków
              </span>
            )}
          </Stack>

          <Button
            variant="filled"
            color="blue"
            size="large"
            fullWidth
            type="submit"
            disabled={!isValid || loading || disabled}
            isLoading={loading}
          >
            {loading ? "Generowanie..." : "Generuj fiszki"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
