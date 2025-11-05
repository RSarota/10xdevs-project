import { useState } from "react";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";
import { ErrorLogsSection } from "./admin/ErrorLogsSection";
import { UserManagementSection } from "./admin/UserManagementSection";
import { ConfirmationModal } from "./my-flashcards/ConfirmationModal";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton, Divider, SegmentedControl, FormField } from "./apple-hig";

export default function AdminPage() {
  const { logs, users, loading, error, currentPage, totalPages, fetchLogs, fetchUsers, deleteUser, changeUserRole } =
    useAdmin();
  const [activeTab, setActiveTab] = useState<"logs" | "users">("logs");
  const [actionModal, setActionModal] = useState<{
    type: "delete" | "role";
    userId?: string;
    message: string;
  } | null>(null);

  const handleDeleteUser = (id: string) => {
    setActionModal({
      type: "delete",
      userId: id,
      message: "Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna.",
    });
  };

  const handleRoleChange = (id: string, role: string) => {
    const action = role === "admin" ? "nadać uprawnienia administratora" : "odebrać uprawnienia administratora";
    setActionModal({
      type: "role",
      userId: id,
      message: `Czy na pewno chcesz ${action} temu użytkownikowi?`,
    });
  };

  const handleConfirmAction = async () => {
    if (!actionModal || !actionModal.userId) return;

    try {
      if (actionModal.type === "delete") {
        await deleteUser(actionModal.userId);
        toast.success("Użytkownik został usunięty");
      } else if (actionModal.type === "role") {
        const user = users.find((u) => u.id === actionModal.userId);
        const newRole = user?.role === "admin" ? "user" : "admin";
        await changeUserRole(actionModal.userId, newRole);
        toast.success("Rola użytkownika została zmieniona");
      }
      setActionModal(null);
    } catch (err) {
      toast.error("Nie udało się wykonać operacji", {
        description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
      });
    }
  };

  const handleCancelAction = () => {
    setActionModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--apple-grouped-bg))]">
      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto">
        <Container size="xl" className="py-[var(--apple-space-8)]">
          <Stack direction="vertical" spacing="lg">
            {/* Error Banner */}
            {error && (
              <Banner
                open={!!error}
                message="Nie udało się załadować danych"
                type="error"
                dismissible
                action={{
                  label: "Spróbuj ponownie",
                  onClick: () => {
                    if (activeTab === "logs") {
                      fetchLogs(currentPage);
                    } else {
                      fetchUsers();
                    }
                  },
                }}
              />
            )}

            {/* Tab Selector */}
            <FormField label="Wybierz sekcję">
              <SegmentedControl
                value={activeTab}
                onChange={(value) => setActiveTab(value as "logs" | "users")}
                options={[
                  { value: "logs", label: "Logi błędów" },
                  { value: "users", label: "Użytkownicy" },
                ]}
              />
            </FormField>

            <Divider />

            {/* Loading State */}
            {loading && (
              <Stack direction="vertical" spacing="md">
                <Skeleton height={100} />
                <Skeleton height={100} />
                <Skeleton height={100} />
              </Stack>
            )}

            {/* Error Logs Tab */}
            {!loading && activeTab === "logs" && (
              <ErrorLogsSection
                logs={logs}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={fetchLogs}
              />
            )}

            {/* Users Management Tab */}
            {!loading && activeTab === "users" && (
              <UserManagementSection
                users={users}
                onRefresh={fetchUsers}
                onDelete={handleDeleteUser}
                onRoleChange={handleRoleChange}
              />
            )}
          </Stack>
        </Container>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={actionModal !== null}
        message={actionModal?.message || ""}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </div>
  );
}
