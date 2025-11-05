import { Stack, LargeTitle, Body } from "@/components/apple-hig";

export interface HeaderProps {
  userName?: string;
  lastActivity?: string;
}

export function DashboardHeader({ userName, lastActivity }: HeaderProps) {
  return (
    <Stack direction="vertical" spacing="sm">
      <LargeTitle className="text-[hsl(var(--apple-label))]">Witaj{userName ? `, ${userName}` : ""}!</LargeTitle>
      {lastActivity && (
        <Body className="text-[hsl(var(--apple-label-secondary))]">Ostatnia aktywność: {lastActivity}</Body>
      )}
    </Stack>
  );
}
