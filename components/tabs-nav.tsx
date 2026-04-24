"use client";

export interface TabNav {
  id: string;
  label: string;
}

interface TabsNavProps {
  tabs: TabNav[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabsNav({ tabs, activeTab, onTabChange }: TabsNavProps) {
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="w-full flex justify-center border border-border rounded-lg">
        <div className="flex gap-1 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
