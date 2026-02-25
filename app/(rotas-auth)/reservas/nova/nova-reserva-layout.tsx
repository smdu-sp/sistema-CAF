"use client";

import { useState } from "react";
import type { CoordenadoriaOption, SalaOption } from "../services/reservas";
import { AgendaSala } from "./agenda-sala";
import { FormNovaReserva } from "./form-nova-reserva";

export function NovaReservaLayout({
  salas,
  coordenadorias,
  coordenadoriaIdPadrao,
  isAdmin = false,
}: {
  salas: SalaOption[];
  coordenadorias: CoordenadoriaOption[];
  coordenadoriaIdPadrao: string;
  isAdmin?: boolean;
}) {
  const [salaId, setSalaId] = useState("");
  const [data, setData] = useState("");

  const salaNome =
    salas.find((s) => s.id === salaId)?.nome ?? "Selecione uma sala";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,400px)_1fr] gap-6 lg:gap-8 items-start">
      <div className="space-y-4">
        <FormNovaReserva
          salas={salas}
          coordenadorias={coordenadorias}
          coordenadoriaIdPadrao={coordenadoriaIdPadrao}
          valueSalaId={salaId}
          valueData={data}
          onSalaChange={setSalaId}
          onDataChange={setData}
        />
      </div>
      <div className="lg:sticky lg:top-4">
        <AgendaSala
          salaId={salaId || null}
          data={data || null}
          salaNome={salaNome}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
