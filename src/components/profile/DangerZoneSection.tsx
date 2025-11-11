import { AlertTriangle } from "lucide-react";
import { Card, Stack, Banner, Button } from "../apple-hig";

interface DangerZoneSectionProps {
  onDeleteClick: () => void;
}

export function DangerZoneSection({ onDeleteClick }: DangerZoneSectionProps) {
  return (
    <Card elevation="md" padding="xl" variant="grouped">
      <Stack direction="vertical" spacing="lg">
        <Banner
          open={true}
          message="Usunięcie konta jest nieodwracalne. Wszystkie twoje dane zostaną trwale usunięte."
          type="warning"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <Button
          variant="filled"
          color="red"
          size="large"
          fullWidth
          onClick={onDeleteClick}
          data-testid="profile-delete-account-button"
        >
          Usuń konto
        </Button>
      </Stack>
    </Card>
  );
}
