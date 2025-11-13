import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminActions } from "@/hooks/useAdminActions";
import { ErrorLogsSection } from "./admin/ErrorLogsSection";
import { UserManagementSection } from "./admin/UserManagementSection";
import { ConfirmationModal } from "./my-flashcards/ConfirmationModal";
import { AdminTabs } from "./admin/AdminTabs";

// Apple HIG Components
import { Stack, Banner, Container, Skeleton, Divider, Title2, Body } from "./apple-hig";

export default function AdminPage() {
  const { logs, users, loading, error, currentPage, totalPages, fetchLogs, fetchUsers } = useAdmin();
  const { actionModal, handleDeleteUser, handleRoleChange, handleConfirmAction, handleCancelAction } =
    useAdminActions();
  const [activeTab, setActiveTab] = useState<"logs" | "users">("logs");

  useEffect(() => {
    if (error) {
      toast.error("Nie udało się załadować danych", {
        description: error.message,
      });
    }
  }, [error]);

  const handleConfirmActionWithRefresh = async () => {
    try {
      await handleConfirmAction(users, () => {
        if (activeTab === "users") {
          fetchUsers();
        }
      });
    } catch {
      // Error already handled in hook
    }
  };

  const handleRefetch = () => {
    if (activeTab === "logs") {
      fetchLogs(currentPage);
    } else {
      fetchUsers();
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
              <Title2>Panel Administratora</Title2>
              <Body className="text-[hsl(var(--apple-label-secondary))]">
                Zarządzaj użytkownikami i przeglądaj logi błędów generacji
              </Body>
            </Stack>

            {/* Error Banner */}
            {error && (
              <Banner
                open={!!error}
                message="Nie udało się załadować danych"
                type="error"
                dismissible
                action={{
                  label: "Spróbuj ponownie",
                  onClick: handleRefetch,
                }}
              />
            )}

            {/* Tab Selector */}
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
                onRoleChange={(id, role) => handleRoleChange(id, role)}
              />
            )}
          </Stack>
        </Container>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={actionModal !== null}
        message={actionModal?.message || ""}
        onConfirm={handleConfirmActionWithRefresh}
        onCancel={handleCancelAction}
      />
    </div>
  );
}
