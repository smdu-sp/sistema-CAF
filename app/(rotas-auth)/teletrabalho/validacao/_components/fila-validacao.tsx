'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatarDataBr } from '@/lib/teletrabalho/datas';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export type RegistroFila = {
  id: string;
  data: Date | string;
  estado: string;
  pontuacaoTotal: number;
  processosAnalisados: string | null;
  justificativaDevolucao: string | null;
  servidor: { nome: string; rf: string };
  atividades: { descricaoSnapshot: string; quantidade: number; pontuacaoUnitaria: number }[];
};

export default function FilaValidacao({ registros }: { registros: RegistroFila[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const [justificativa, setJustificativa] = useState('');
  const [isPending, startTransition] = useTransition();

  function toggle(id: string) {
    setIds((atual) => atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]);
  }

  function acao(path: string, extra?: object) {
    startTransition(async () => {
      const res = await fetch(`/api/teletrabalho/registros/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success(path === 'validar' ? 'Registros validados' : 'Registros devolvidos');
      window.location.reload();
    });
  }

  if (!registros.length) {
    return <p className="text-sm text-muted-foreground">Nenhum registro enviado aguardando validação.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <Button disabled={!ids.length || isPending} onClick={() => acao('validar')}>
          Validar selecionados {isPending && <Loader2 className="animate-spin" />}
        </Button>
        <div className="flex-1 min-w-[220px]">
          <Textarea placeholder="Justificativa da devolução" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
        </div>
        <Button variant="destructive" disabled={!ids.length || !justificativa.trim() || isPending} onClick={() => acao('devolver', { justificativa })}>
          Devolver
        </Button>
      </div>
      <div className="border rounded-lg divide-y">
        {registros.map((r) => (
          <label key={r.id} className="flex gap-3 p-4 cursor-pointer hover:bg-muted/40">
            <input type="checkbox" checked={ids.includes(r.id)} onChange={() => toggle(r.id)} />
            <div className="flex-1 text-sm space-y-1">
              <p className="font-medium">{r.servidor.nome} ({r.servidor.rf}) — {formatarDataBr(r.data as Date)}</p>
              <p>{r.atividades.map((a) => `${a.descricaoSnapshot} × ${a.quantidade}`).join('; ')}</p>
              <p className="text-muted-foreground">{r.pontuacaoTotal} pts {r.processosAnalisados ? `· ${r.processosAnalisados}` : ''}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
