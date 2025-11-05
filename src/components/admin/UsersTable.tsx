import { List } from "@/components/apple-hig";
import { UserRow } from "./UserRow";
import type { UserDTO } from "@/hooks/useAdmin";

export interface UsersTableProps {
  users: UserDTO[];
  onDelete: (id: string) => void;
  onRoleChange: (id: string, role: string) => void;
}

export function UsersTable({ users, onDelete, onRoleChange }: UsersTableProps) {
  return (
    <List variant="inset">
      {users.map((user) => (
        <UserRow key={user.id} user={user} onDelete={onDelete} onRoleChange={onRoleChange} />
      ))}
    </List>
  );
}
