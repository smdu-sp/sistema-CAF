'use client';

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
}

interface NavTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function NavTabs({ tabs, activeTab, onTabChange }: NavTabsProps) {
  return (
    <nav className="flex gap-2 mt-6 border-b pb-2">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;

        return (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={active ? "default" : "ghost"}
            className={cn(
              "rounded-full transition-colors",
              active && "bg-[#F94668] text-white hover:bg-[#F94668]/90",
            )}
            style={active ? { backgroundColor: "#F94668" } : {}}
          >
            {tab.label}
          </Button>
        );
      })}
    </nav>
  );
}