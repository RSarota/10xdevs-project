import { RefreshCw } from "lucide-react";
import { Stack, Title2, Button } from "../apple-hig";

interface FlashcardsPageHeaderProps {
  onRefresh: () => void;
  loading: boolean;
}

export function FlashcardsPageHeader({ onRefresh, loading }: FlashcardsPageHeaderProps) {
  return (
    <Stack direction="horizontal" justify="between" align="center">
      <Title2>Twoje fiszki</Title2>
      <Button variant="default" color="blue" size="medium" onClick={onRefresh} disabled={loading}>
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        Odśwież
      </Button>
    </Stack>
  );
}
