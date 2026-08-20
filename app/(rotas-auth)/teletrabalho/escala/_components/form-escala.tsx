'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';

type Unidade = { id: string; sigla: string; nome: string };
type ServidorEscala = { id: string; nome: string; rf: string; escala: { grupo: number } | null };

export default function FormEscala({ unidades }: { unidades: Unidade[] }) {
  const [unidadeId, setUnidadeId] = useState(unidades[0]?.id ?? '');
  const [diasRemotos, setDiasRemotos] = useState(2);
  const [diasPresenciais, setDiasPresenciais] = useState(3);
  const [gruposRodizio, setGruposRodizio] = useState(2);
  const [servidores, setServidores] = useState<ServidorEscala[]>([]);
  const [grupos, setGrupos] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!unidadeId) return;
    fetch(`/api/teletrabalho/escala?unidadeId=${unidadeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.regime) {
          setDiasRemotos(data.regime.diasRemotos);
          setDiasPresenciais(data.regime.diasPresenciais);
          setGruposRodizio(data.regime.gruposRodizio);
        }
        setServidores(data.servidores ?? []);
        const map: Record<string, number> = {};
        for (const s of data.servidores ?? []) map[s.id] = s.escala?.grupo ?? 1;
        setGrupos(map);
      });
  }, [unidadeId]);

  function salvar() {
    startTransition(async () => {
      const res = await fetch('/api/teletrabalho/escala', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unidadeId,
          diasRemotos,
          diasPresenciais,
          gruposRodizio,
          algoritmo: 'atecc_grupos_2',
          escalas: Object.entries(grupos).map(([servidorId, grupo]) => ({ servidorId, grupo })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success('Escala atualizada');
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm space-y-1">
          Unidade
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={unidadeId} onChange={(e) => setUnidadeId(e.target.value)}>
            {unidades.map((u) => <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>)}
          </select>
        </label>
        <label className="text-sm space-y-1">
          Dias remotos
          <Input type="number" min={1} max={5} value={diasRemotos} onChange={(e) => setDiasRemotos(Number(e.target.value))} />
        </label>
        <label className="text-sm space-y-1">
          Dias presenciais
          <Input type="number" min={1} max={5} value={diasPresenciais} onChange={(e) => setDiasPresenciais(Number(e.target.value))} />
        </label>
        <label className="text-sm space-y-1">
          Grupos de rodízio
          <Input type="number" min={1} max={4} value={gruposRodizio} onChange={(e) => setGruposRodizio(Number(e.target.value))} />
        </label>
      </div>
      <div className="border rounded-lg divide-y">
        {servidores.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-2 text-sm">
            <span>{s.nome} ({s.rf})</span>
            <select
              className="h-9 rounded-md border border-input bg-background px-2"
              value={grupos[s.id] ?? 1}
              onChange={(e) => setGrupos((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))}
            >
              <option value={1}>Grupo 1</option>
              <option value={2}>Grupo 2</option>
            </select>
          </div>
        ))}
      </div>
      <Button disabled={isPending} onClick={salvar}>
        Salvar {isPending && <Loader2 className="animate-spin" />}
      </Button>
    </div>
  );
}
