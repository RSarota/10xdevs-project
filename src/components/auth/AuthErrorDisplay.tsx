import { AlertCircle } from "lucide-react";
import { Body } from "../apple-hig";

interface AuthErrorDisplayProps {
  message: string;
  testId?: string;
}

export function AuthErrorDisplay({ message, testId }: AuthErrorDisplayProps) {
  return (
    <div
      data-testid={testId || "auth-error"}
      className="flex items-start gap-3 p-4 bg-[hsl(var(--apple-red))]/10 border border-[hsl(var(--apple-red))]/20 rounded-[var(--apple-radius-medium)]"
    >
      <AlertCircle className="w-5 h-5 text-[hsl(var(--apple-red))] flex-shrink-0 mt-0.5" />
      <Body className="text-[hsl(var(--apple-red))] text-sm">{message}</Body>
    </div>
  );
}
