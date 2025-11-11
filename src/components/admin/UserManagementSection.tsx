import { Stack, Title2, Button, EmptyState } from "@/components/apple-hig";
import { UsersTable } from "./UsersTable";
import { Users, RefreshCw } from "lucide-react";
import type { UserDTO } from "@/lib/services/adminService";

export interface UserManagementSectionProps {
  users: UserDTO[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onRoleChange: (id: string, role: string) => void;
}

export function UserManagementSection({ users, onRefresh, onDelete, onRoleChange }: UserManagementSectionProps) {
  if (users.length === 0) {
    return (
      <Stack direction="vertical" spacing="md">
        <Stack direction="horizontal" justify="between" align="center">
          <Title2>Zarządzanie użytkownikami</Title2>
          <Button variant="outline" color="blue" size="medium" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
            Odśwież
          </Button>
        </Stack>
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="Brak użytkowników"
          description="Nie znaleziono żadnych użytkowników"
        />
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" spacing="md">
      <Stack direction="horizontal" justify="between" align="center">
        <Title2>Zarządzanie użytkownikami</Title2>
        <Button variant="default" color="blue" size="medium" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
          Odśwież
        </Button>
      </Stack>
      <UsersTable users={users} onDelete={onDelete} onRoleChange={onRoleChange} />
    </Stack>
  );
}
