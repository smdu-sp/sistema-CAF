'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type Dia = {
  data: string;
  weekday: number;
  feriado: boolean;
  servidores: { servidorId: string; nome: string; grupo: number; status: string }[];
};

const STATUS: Record<string, string> = {
  Teletrabalho: 'bg-sky-100 text-sky-800',
  Presencial: 'bg-amber-100 text-amber-900',
  Folga: 'bg-muted text-muted-foreground',
};

export default function CalendarioEscala({ unidades }: { unidades: { id: string; sigla: string; nome: string }[] }) {
  const hoje = new Date();
  const [unidadeId, setUnidadeId] = useState(unidades[0]?.id ?? '');
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [dias, setDias] = useState<Dia[]>([]);
  const [servidores, setServidores] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    if (!unidadeId) return;
    fetch(`/api/teletrabalho/calendario?unidadeId=${unidadeId}&ano=${ano}&mes=${mes}`)
      .then((r) => r.json())
      .then((data) => {
        setDias(data.dias ?? []);
        setServidores(data.servidores ?? []);
      });
  }, [unidadeId, ano, mes]);

  function navegar(delta: number) {
    const d = new Date(ano, mes - 1 + delta, 1);
    setAno(d.getFullYear());
    setMes(d.getMonth() + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={unidadeId} onChange={(e) => setUnidadeId(e.target.value)}>
          {unidades.map((u) => <option key={u.id} value={u.id}>{u.sigla}</option>)}
        </select>
        <Button size="icon" variant="outline" onClick={() => navegar(-1)}><ChevronLeft className="size-4" /></Button>
        <span className="font-medium">{String(mes).padStart(2, '0')}/{ano}</span>
        <Button size="icon" variant="outline" onClick={() => navegar(1)}><ChevronRight className="size-4" /></Button>
      </div>
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left sticky left-0 bg-background">Servidor</th>
              {dias.map((d) => (
                <th key={d.data} className="p-1 min-w-10">{d.data.slice(8)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {servidores.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2 sticky left-0 bg-background whitespace-nowrap">{s.nome}</td>
                {dias.map((d) => {
                  const item = d.servidores.find((x) => x.servidorId === s.id);
                  const status = item?.status ?? 'Folga';
                  return (
                    <td key={d.data} className="p-0.5 text-center">
                      <span className={`inline-block w-full rounded px-0.5 py-1 ${STATUS[status] ?? ''}`} title={status}>
                        {status === 'Teletrabalho' ? 'T' : status === 'Presencial' ? 'P' : 'F'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">T = teletrabalho · P = presencial · F = folga/feriado</p>
    </div>
  );
}
