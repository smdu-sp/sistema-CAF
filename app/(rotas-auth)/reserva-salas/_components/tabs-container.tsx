'use client';

import { useState, ReactNode } from "react";
import { NavTabs } from "./nav-tabs";
import { ReservasContent, AgendaContent } from "./tab-content";

interface Tab {
  id: string;
  label: string;
}

export function TabsContainer({ tabs, salasContent }: { tabs: Tab[]; salasContent: ReactNode }) {
  const [activeTab, setActiveTab] = useState("reservas");

  return (
    <>
      <NavTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "reservas" && <ReservasContent />}
      {activeTab === "salas" && salasContent}
      {activeTab === "agenda" && <AgendaContent />}
    </>
  );
}