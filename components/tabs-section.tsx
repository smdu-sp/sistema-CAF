"use client";

import { useState, ReactNode } from "react";

export interface Tab {
  id: string;
  label: string;
}

interface TabsSectionProps {
  tabs: Tab[];
  onRenderContent: (activeTabId: string) => ReactNode;
  defaultTab?: string;
}

export function TabsSection({ 
  tabs, 
  onRenderContent,
  defaultTab 
}: TabsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || (tabs.length > 0 ? tabs[0].id : "")
  );

  return (
    <div className="w-full flex flex-col">
      {/* Abas - Scroll horizontal em mobile */}
      <div className="w-full overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 mb-6">
        <div className="flex gap-2 sm:gap-4 border-b px-4 sm:px-6 md:px-8 min-w-min md:min-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
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

      {/* Conteúdo - Responsivo */}
      <div className="w-full">
        {onRenderContent(activeTab)}
      </div>
    </div>
  );
}
