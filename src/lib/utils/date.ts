/**
 * Utility functions for date formatting
 */

/**
 * Formatuje datę w formacie polskim (dzień miesiąc rok)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formatuje datę i czas w formacie polskim
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formatuje timestamp jako względny czas (np. "5 min temu", "2 godz temu")
 */
export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

  if (diffInMinutes < 1) return "Przed chwilą";
  if (diffInMinutes < 60) return `${diffInMinutes} min temu`;
  if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} ${hours === 1 ? "godz" : "godz"} temu`;
  }
  return date.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}
