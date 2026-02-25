"use client";

import { useState, useEffect } from "react";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import { listarAgendamentosPorDiaCliente } from "../services/agendamentos-cliente";

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<
    { id: string; salaNome: string; inicio: string; fim: string }[]
  >([]);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    listarAgendamentosPorDiaCliente(date)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <div className="space-y-4">
      <BaseCalendar
        mode="single"
        selected={date}
        onSelect={setDate}
      />
      <div className="border rounded-md p-2 max-h-64 overflow-auto">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando agendamentos...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum agendamento para esta data.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((a) => (
              <li key={a.id} className="border rounded-md p-2">
                <div className="font-medium">{a.salaNome}</div>
                <div className="text-slate-600">
                  {a.inicio} - {a.fim}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

