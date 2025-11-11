import { TabBar, TabBarItem } from "../apple-hig";
import { NAV_ITEMS } from "@/lib/constants/navigation";

interface MobileTabBarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export function MobileTabBar({ activePath, onNavigate }: MobileTabBarProps) {
  return (
    <div className="lg:hidden">
      <TabBar blur>
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <TabBarItem
              key={item.id}
              icon={<Icon className="w-5 h-5" />}
              label={item.label}
              active={activePath === item.path}
              onClick={() => onNavigate(item.path)}
            />
          );
        })}
      </TabBar>
    </div>
  );
}
