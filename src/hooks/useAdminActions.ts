import { useState, useCallback } from "react";
import { toast } from "sonner";
import { adminService } from "@/lib/services/adminService";
import type { UserDTO } from "@/lib/services/adminService";

export type AdminActionType = "delete" | "role";

export interface AdminActionModal {
  type: AdminActionType;
  userId: string;
  message: string;
}

export interface UseAdminActionsReturn {
  actionModal: AdminActionModal | null;
  handleDeleteUser: (id: string) => void;
  handleRoleChange: (id: string, currentRole: string) => void;
  handleConfirmAction: (users: UserDTO[], onSuccess: () => void) => Promise<void>;
  handleCancelAction: () => void;
}

export function useAdminActions(): UseAdminActionsReturn {
  const [actionModal, setActionModal] = useState<AdminActionModal | null>(null);

  const handleDeleteUser = useCallback((id: string) => {
    setActionModal({
      type: "delete",
      userId: id,
      message: "Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna.",
    });
  }, []);

  const handleRoleChange = useCallback((id: string, currentRole: string) => {
    const action = currentRole === "admin" ? "odebrać uprawnienia administratora" : "nadać uprawnienia administratora";
    setActionModal({
      type: "role",
      userId: id,
      message: `Czy na pewno chcesz ${action} temu użytkownikowi?`,
    });
  }, []);

  const handleConfirmAction = useCallback(
    async (users: UserDTO[], onSuccess: () => void) => {
      if (!actionModal) return;

      try {
        if (actionModal.type === "delete") {
          await adminService.deleteUser(actionModal.userId);
          toast.success("Użytkownik został usunięty");
        } else if (actionModal.type === "role") {
          const user = users.find((u) => u.id === actionModal.userId);
          const newRole = user?.role === "admin" ? "user" : "admin";
          await adminService.changeUserRole(actionModal.userId, newRole);
          toast.success("Rola użytkownika została zmieniona");
        }
        setActionModal(null);
        onSuccess();
      } catch (err) {
        toast.error("Nie udało się wykonać operacji", {
          description: err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd",
        });
        throw err;
      }
    },
    [actionModal]
  );

  const handleCancelAction = useCallback(() => {
    setActionModal(null);
  }, []);

  return {
    actionModal,
    handleDeleteUser,
    handleRoleChange,
    handleConfirmAction,
    handleCancelAction,
  };
}
