'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

type AtividadeVigente = {
  atividadeId: string;
  descricao: string;
  categoria: string;
  pontuacao: number;
};

export default function WizardRegistro({ servidorId }: { servidorId: string | null }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [atividades, setAtividades] = useState<AtividadeVigente[]>([]);
  const [quantidades, setQuantidades] = useState<Record<string, number>>({});
  const [processos, setProcessos] = useState('');
  const [dificuldades, setDificuldades] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [motivoAtraso, setMotivoAtraso] = useState('');
  const [compensacao, setCompensacao] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!servidorId || !data) return;
    fetch(`/api/teletrabalho/atividades-vigentes?servidorId=${servidorId}&data=${data}`)
      .then((r) => r.json())
      .then((json) => setAtividades(json.atividades ?? []));
  }, [servidorId, data]);

  const total = useMemo(() => {
    return atividades.reduce((acc, a) => acc + a.pontuacao * (quantidades[a.atividadeId] || 0), 0);
  }, [atividades, quantidades]);

  const grupos = useMemo(() => {
    const map = new Map<string, AtividadeVigente[]>();
    for (const a of atividades) {
      const lista = map.get(a.categoria) ?? [];
      lista.push(a);
      map.set(a.categoria, lista);
    }
    return [...map.entries()];
  }, [atividades]);

  function itens() {
    return Object.entries(quantidades)
      .filter(([, q]) => q > 0)
      .map(([atividadeId, quantidade]) => ({ atividadeId, quantidade }));
  }

  function salvar(enviar: boolean) {
    if (!servidorId) {
      toast.error('Usuário sem servidor de teletrabalho vinculado');
      return;
    }
    startTransition(async () => {
      const res = await fetch('/api/teletrabalho/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servidorId,
          data,
          itens: itens(),
          processosAnalisados: processos || null,
          dificuldades: dificuldades || null,
          observacoes: observacoes || null,
          motivoAtraso: motivoAtraso || null,
          compensacao,
          enviar,
        }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error('Não foi possível salvar', { description: json.error }); return; }
      toast.success(enviar ? 'Registro enviado para validação' : 'Rascunho salvo');
      if (enviar) {
        setQuantidades({});
        setStep(1);
      }
    });
  }

  if (!servidorId) {
    return <p className="text-sm text-muted-foreground">Seu usuário não está vinculado a um servidor de teletrabalho.</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-2 text-sm">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`px-3 py-1 rounded-full ${step === n ? 'bg-primary text-white' : 'bg-muted'}`}>Passo {n}</span>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <label className="text-sm space-y-1 block">
            Data do teletrabalho
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </label>
          <p className="text-sm text-muted-foreground">Pontuação prevista (cálculo final no servidor): {total}</p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          {grupos.map(([categoria, itensCat]) => (
            <div key={categoria}>
              <h3 className="font-medium mb-2">{categoria}</h3>
              <div className="space-y-2">
                {itensCat.map((a) => (
                  <div key={a.atividadeId} className="flex items-start justify-between gap-3 border rounded-md p-3">
                    <div>
                      <p className="text-sm">{a.descricao}</p>
                      <p className="text-xs text-muted-foreground">{a.pontuacao} pts</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button type="button" size="icon" variant="outline" onClick={() => setQuantidades((q) => ({ ...q, [a.atividadeId]: Math.max(0, (q[a.atividadeId] || 0) - 1) }))}>
                        <Minus className="size-4" />
                      </Button>
                      <span className="w-8 text-center">{quantidades[a.atividadeId] || 0}</span>
                      <Button type="button" size="icon" variant="outline" onClick={() => setQuantidades((q) => ({ ...q, [a.atividadeId]: (q[a.atividadeId] || 0) + 1 }))}>
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="text-sm font-medium">Total estimado: {total} pts</p>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <Textarea placeholder="Processos analisados" value={processos} onChange={(e) => setProcessos(e.target.value)} />
          <Textarea placeholder="Dificuldades encontradas" value={dificuldades} onChange={(e) => setDificuldades(e.target.value)} />
          <Textarea placeholder="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          <Textarea placeholder="Motivo de atraso (obrigatório após o 1º dia útil seguinte)" value={motivoAtraso} onChange={(e) => setMotivoAtraso(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={compensacao} onChange={(e) => setCompensacao(e.target.checked)} />
            Compensação de lançamento retroativo
          </label>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="size-4" /> Voltar
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Continuar <ChevronRight className="size-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="button" variant="outline" disabled={isPending} onClick={() => salvar(false)}>
              Salvar rascunho {isPending && <Loader2 className="animate-spin" />}
            </Button>
            <Button type="button" disabled={isPending} onClick={() => salvar(true)}>
              Enviar {isPending && <Loader2 className="animate-spin" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
