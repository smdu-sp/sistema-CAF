"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TabsContainerProps {
  usuario: any;
  minhasReservasContent: ReactNode;
  salasContent: ReactNode;
}

export function TabsContainer({ usuario, minhasReservasContent, salasContent }: TabsContainerProps) {
  const [activeTab, setActiveTab] = useState("Reservas");

  const isAdmin = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";

  const navItems = [
    ...(isAdmin ? ["Reservas", "Salas", "Agenda"] : ["Reservas"]),
  ];

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <nav className="flex gap-2 mt-6 border-b pb-2">
        {navItems.map((item) => {
          const active = activeTab === item;

          return (
            <Button
              key={item}
              onClick={() => setActiveTab(item)}
              variant={active ? "default" : "ghost"}
              className={cn(
                "rounded-full transition-colors",
                active && "bg-[#F94668] text-white hover:bg-[#F94668]"
              )}
            >
              {item}
            </Button>
          );
        })}
      </nav>

      <div className="mt-6">
        {activeTab === "Reservas" && minhasReservasContent}
        {activeTab === "Salas" && salasContent}
        {activeTab === "Agenda" && <div>Agenda component aqui</div>}
      </div>
    </div>
  );
}