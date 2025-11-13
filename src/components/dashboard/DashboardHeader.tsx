import { Stack, LargeTitle, Body } from "@/components/apple-hig";

export interface HeaderProps {
  userName?: string;
  lastActivity?: string;
}

export function DashboardHeader({ userName, lastActivity }: HeaderProps) {
  return (
    <div className="relative">
      <Stack direction="vertical" spacing="md" className="relative">
        <LargeTitle className="text-[hsl(var(--apple-label))] font-[var(--apple-weight-bold)]">
          Witaj{userName ? `, ${userName}` : ""}!
        </LargeTitle>
        
        {lastActivity && (
          <Body className="text-[hsl(var(--apple-label-secondary))] opacity-80">
            Ostatnia aktywność: {lastActivity}
          </Body>
        )}
        
        <Body className="text-[hsl(var(--apple-label-tertiary))] text-sm mt-2">
          Zarządzaj swoimi fiszkami i śledź postępy w nauce
        </Body>
      </Stack>
    </div>
  );
}
