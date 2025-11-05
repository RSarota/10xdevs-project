import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button, Card, CardHeader, TextArea, Stack, Badge } from "@/components/apple-hig";

interface FlashcardsFormProps {
  onSubmit: (text: string) => void;
  loading: boolean;
}

const MIN_LENGTH = 1000;
const MAX_LENGTH = 10000;

export function FlashcardsForm({ onSubmit, loading }: FlashcardsFormProps) {
  const [text, setText] = useState("");

  const textLength = text.length;
  const isValid = textLength >= MIN_LENGTH && textLength <= MAX_LENGTH;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
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
    <Card elevation="md" padding="xl" variant="grouped">
      <Stack direction="vertical" spacing="xl">
        <CardHeader title="Tekst źródłowy" subtitle="Wklej materiał do nauki, z którego AI wygeneruje fiszki" />

        <form onSubmit={handleSubmit}>
          <Stack direction="vertical" spacing="lg">
            <TextArea
              id="source-text"
              label="Treść materiału"
              value={text}
              onChange={handleChange}
              placeholder="Wklej tutaj tekst z którego chcesz wygenerować fiszki..."
              className="min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] font-mono"
              disabled={loading}
              rows={10}
            />

            <div className="pt-[var(--apple-space-3)]">
              <Badge color={getBadgeColor()} variant="outlined" size="md">
                {textLength.toLocaleString()} / {MAX_LENGTH.toLocaleString()} znaków
              </Badge>
            </div>

            <div className="pt-[var(--apple-space-4)]">
              <Button
                variant="filled"
                color="blue"
                size="large"
                fullWidth
                type="submit"
                disabled={!isValid || loading}
                isLoading={loading}
              >
                {loading ? "Generowanie..." : "Generuj fiszki"}
              </Button>
            </div>
          </Stack>
        </form>
      </Stack>
    </Card>
  );
}
