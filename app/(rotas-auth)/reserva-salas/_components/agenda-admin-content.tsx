"use client";

import { useState } from "react";
import { AgendaAdmin } from "../admin/agenda-admin";
import { ProximosEventos } from "../admin/_components/proximos-eventos";

interface AgendaAdminContentProps {
  usuario: any;
}

export function AgendaAdminContent({ usuario }: AgendaAdminContentProps) {
  const [abaAtiva, setAbaAtiva] = useState<"agenda" | "proximos">("agenda");

  const isAdmin = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";

  if (!isAdmin) {
    return (
      <div className="w-full px-0 md:px-8 pb-20 md:pb-14">
        <p>Somente administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-border">
        <nav className="flex gap-0">
          <button
            type="button"
            onClick={() => setAbaAtiva("agenda")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              abaAtiva === "agenda"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Agenda
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("proximos")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              abaAtiva === "proximos"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Próximos eventos
          </button>
        </nav>
      </div>

      {abaAtiva === "agenda" && <AgendaAdmin />}
      {abaAtiva === "proximos" && <ProximosEventos />}
    </div>
  );
}