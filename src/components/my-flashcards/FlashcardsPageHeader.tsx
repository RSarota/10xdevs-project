import { Stack, Title2, Body } from "../apple-hig";

export function FlashcardsPageHeader() {
  return (
    <div className="mb-8">
      <Stack direction="vertical" spacing="sm">
        <Title2 className="text-[hsl(var(--apple-label))] font-[var(--apple-weight-bold)]">Twoje fiszki</Title2>
        <Body className="text-[hsl(var(--apple-label-secondary))]">
          Zarządzaj swoimi fiszkami i śledź postępy w nauce
        </Body>
      </Stack>
    </div>
  );
}
