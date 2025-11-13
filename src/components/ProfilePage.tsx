import { useState } from "react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { ProfileForm } from "./profile/ProfileForm";
import { DangerZoneSection } from "./profile/DangerZoneSection";
import { DeleteAccountModal } from "./profile/DeleteAccountModal";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton, Title2, Body } from "./apple-hig";

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
    <div className="min-h-screen flex flex-col">
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
                  <DangerZoneSection onDeleteClick={() => setShowDeleteConfirm(true)} />
                </Stack>
              </div>
            )}
          </Stack>
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteAccountModal
        open={showDeleteConfirm}
        deleting={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
