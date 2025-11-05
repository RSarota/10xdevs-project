import { useState } from "react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "./profile/ProfileForm";
import { HistoryList } from "./profile/HistoryList";
import { AlertTriangle } from "lucide-react";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton, Button, Divider, AlertDialog } from "./apple-hig";

export default function ProfilePage() {
  const { profile, history, loading, error, updateProfile, deleteAccount } = useProfile();
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
        <Container size="lg" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="lg">
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
              <>
                {/* Profile Form */}
                <ProfileForm profile={profile} onSubmit={handleUpdateProfile} loading={updating} />

                <Divider />

                {/* History List */}
                <HistoryList items={history} />

                <Divider />

                {/* Danger Zone */}
                <Stack direction="vertical" spacing="md">
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
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    Usuń konto
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Usuń konto"
        description="Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna i wszystkie twoje dane zostaną trwale usunięte."
        actions={
          <Stack direction="horizontal" spacing="sm" justify="end">
            <Button
              variant="default"
              color="gray"
              size="medium"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              Anuluj
            </Button>
            <Button
              variant="filled"
              color="red"
              size="medium"
              onClick={handleDeleteAccount}
              disabled={deleting}
              isLoading={deleting}
            >
              {deleting ? "Usuwanie..." : "Usuń konto"}
            </Button>
          </Stack>
        }
      />
    </div>
  );
}
