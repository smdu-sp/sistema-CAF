'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function PainelFechamento({
  unidades,
  fechamentos,
}: {
  unidades: { id: string; sigla: string; nome: string }[];
  fechamentos: { id: string; ano: number; mes: number; situacao: string; unidade: { sigla: string } }[];
}) {
  const hoje = new Date();
  const [unidadeId, setUnidadeId] = useState(unidades[0]?.id ?? '');
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [justificativa, setJustificativa] = useState('');
  const [isPending, startTransition] = useTransition();

  function fechar(reabrir = false) {
    startTransition(async () => {
      const res = await fetch('/api/teletrabalho/fechamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unidadeId, ano, mes, reabrir, justificativa }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success(reabrir ? 'Competência reaberta' : 'Competência fechada');
      window.location.reload();
    });
  }

  const qs = `unidadeId=${unidadeId}&ano=${ano}&mes=${mes}`;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid gap-3 sm:grid-cols-3">
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={unidadeId} onChange={(e) => setUnidadeId(e.target.value)}>
          {unidades.map((u) => <option key={u.id} value={u.id}>{u.sigla}</option>)}
        </select>
        <Input type="number" value={ano} onChange={(e) => setAno(Number(e.target.value))} />
        <Input type="number" min={1} max={12} value={mes} onChange={(e) => setMes(Number(e.target.value))} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={isPending} onClick={() => fechar(false)}>
          Fechar competência {isPending && <Loader2 className="animate-spin" />}
        </Button>
        <a href={`/api/teletrabalho/relatorios?${qs}&formato=pdf&tipo=consolidado`} target="_blank" rel="noreferrer">
          <Button type="button" variant="outline">PDF consolidado</Button>
        </a>
        <a href={`/api/teletrabalho/relatorios?${qs}&formato=xls&tipo=consolidado`} target="_blank" rel="noreferrer">
          <Button type="button" variant="outline">Planilha</Button>
        </a>
        <a href={`/api/teletrabalho/relatorios?${qs}&formato=pdf&tipo=individual`} target="_blank" rel="noreferrer">
          <Button type="button" variant="outline">PDF individual</Button>
        </a>
      </div>
      <div className="space-y-2">
        <Textarea placeholder="Justificativa para reabrir competência fechada" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
        <Button variant="destructive" disabled={!justificativa.trim() || isPending} onClick={() => fechar(true)}>Reabrir</Button>
      </div>
      <div className="border rounded-lg divide-y text-sm">
        {fechamentos.map((f) => (
          <div key={f.id} className="px-4 py-2 flex justify-between">
            <span>{f.unidade.sigla} — {String(f.mes).padStart(2, '0')}/{f.ano}</span>
            <span>{f.situacao === 'fechado' ? 'Fechado' : 'Aberto'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
