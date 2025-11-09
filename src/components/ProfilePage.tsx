import { useState } from "react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "./profile/ProfileForm";
import { AlertTriangle } from "lucide-react";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton, Button, AlertDialog, Title2, Body, Card } from "./apple-hig";

export default function ProfilePage() {
  const { profile, loading, error, updateProfile, deleteAccount } = useProfile();
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateProfile = async (data: { email: string; password?: string; confirmPassword?: string }) => {
    try {
      setUpdating(true);
      await updateProfile(data);
      toast.success("Profil został zaktualizowany!");
    } catch (err) {
      toast.error("Nie udało się zaktualizować profilu", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteAccount();
      toast.success("Konto zostało usunięte");
    } catch (err) {
      toast.error("Nie udało się usunąć konta", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="xl">
            {/* Header */}
            <Stack direction="vertical" spacing="sm">
              <Title2>Profil</Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">Zarządzaj danymi konta</Body>
            </Stack>

            {/* Error Banner */}
            {error && <Banner open={!!error} message="Nie udało się załadować profilu" type="error" dismissible />}

            {/* Loading State */}
            {loading && (
              <Stack direction="vertical" spacing="lg">
                <Skeleton height={300} />
                <Skeleton height={200} />
              </Stack>
            )}

            {/* Profile loaded */}
            {!loading && profile && (
              <div className="max-w-2xl mx-auto">
                <Stack direction="vertical" spacing="xl">
                  {/* Profile Form */}
                  <ProfileForm profile={profile} onSubmit={handleUpdateProfile} loading={updating} />

                  {/* Danger Zone */}
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
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Usuń konto
                      </Button>
                    </Stack>
                  </Card>
                </Stack>
              </div>
            )}
          </Stack>
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={showDeleteConfirm}
        onClose={() => !deleting && setShowDeleteConfirm(false)}
        title="Usuń konto"
        message="Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna i wszystkie twoje dane zostaną trwale usunięte."
        primaryAction={{
          label: deleting ? "Usuwanie..." : "Usuń konto",
          onAction: handleDeleteAccount,
          destructive: true,
        }}
        cancelAction={{
          label: "Anuluj",
          onAction: () => {
            if (!deleting) {
              setShowDeleteConfirm(false);
            }
          },
        }}
      />
    </div>
  );
}
