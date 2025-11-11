import { ListItem, Stack, Button } from "@/components/apple-hig";
import { User, Trash2, Shield } from "lucide-react";
import type { UserDTO } from "@/lib/services/adminService";
import { formatDate } from "@/lib/utils/date";

export interface UserRowProps {
  user: UserDTO;
  onDelete: (id: string) => void;
  onRoleChange: (id: string, role: string) => void;
}

export function UserRow({ user, onDelete, onRoleChange }: UserRowProps) {
  const isAdmin = user.role === "admin";
  const subtitle = `Zarejestrowano: ${formatDate(user.created_at)}${isAdmin ? " • Admin" : ""}`;

  return (
    <ListItem
      title={user.email}
      subtitle={subtitle}
      icon={<User className="w-5 h-5" />}
      rightElement={
        <Stack direction="horizontal" spacing="xs">
          <Button
            variant="plain"
            color="blue"
            size="small"
            onClick={() => onRoleChange(user.id, isAdmin ? "user" : "admin")}
          >
            <Shield className="w-4 h-4" />
          </Button>
          <Button variant="plain" color="red" size="small" onClick={() => onDelete(user.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </Stack>
      }
      variant="inset"
    />
  );
}
