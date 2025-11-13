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
    <div className="flex flex-col relative">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-[hsl(var(--apple-blue)/0.006)] to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-[hsl(var(--apple-green)/0.012)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/2 left-1/4 w-72 h-72 bg-[hsl(var(--apple-blue)/0.008)] rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <Container size="xl" className="py-[var(--apple-space-6)]">
          {/* Header Section */}
          <div className="mb-8">
            <Stack direction="vertical" spacing="sm">
              <Title2>Profil</Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">Zarządzaj danymi konta</Body>
            </Stack>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6">
              <Banner open={!!error} message="Nie udało się załadować profilu" type="error" dismissible />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-3xl border border-[hsl(var(--apple-separator))]/25 shadow-md p-6">
                <Skeleton height={300} />
              </div>
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm rounded-3xl border border-[hsl(var(--apple-separator))]/25 shadow-md p-6">
                <Skeleton height={200} />
              </div>
            </div>
          )}

          {/* Profile loaded */}
          {!loading && profile && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Profile Form */}
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-8 shadow-md">
                <ProfileForm profile={profile} onSubmit={handleUpdateProfile} loading={updating} />
              </div>

              {/* Danger Zone */}
              <div className="bg-white/60 dark:bg-black/15 backdrop-blur-sm border border-[hsl(var(--apple-separator))]/25 rounded-3xl p-8 shadow-md">
                <DangerZoneSection onDeleteClick={() => setShowDeleteConfirm(true)} />
              </div>
            </div>
          )}
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
