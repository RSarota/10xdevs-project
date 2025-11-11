import { FormField, SegmentedControl } from "../apple-hig";

interface AdminTabsProps {
  activeTab: "logs" | "users";
  onTabChange: (tab: "logs" | "users") => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <FormField label="Wybierz sekcję">
      <SegmentedControl
        value={activeTab}
        onChange={(value) => onTabChange(value as "logs" | "users")}
        options={[
          { value: "logs", label: "Logi błędów" },
          { value: "users", label: "Użytkownicy" },
        ]}
      />
    </FormField>
  );
}
