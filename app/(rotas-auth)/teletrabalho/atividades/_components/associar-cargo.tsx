'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Link2, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function AssociarCargo({
  atividadeId,
  unidadeId,
  cargos,
}: {
  atividadeId: string;
  unidadeId: string;
  cargos: { id: string; nome: string; unidadeId: string }[];
}) {
  const [cargoId, setCargoId] = useState('');
  const [pontuacao, setPontuacao] = useState('10');
  const [isPending, startTransition] = useTransition();

  function salvar() {
    startTransition(async () => {
      const res = await fetch('/api/teletrabalho/cargo-atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cargoId, atividadeId, pontuacao: Number(pontuacao) }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success('Associação gravada (vigência encerrada se já existia)');
      window.location.reload();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline"><Link2 size={20} /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Associar cargo e pontuação</DialogTitle>
        </DialogHeader>
        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={cargoId} onChange={(e) => setCargoId(e.target.value)}>
          <option value="">Selecione o cargo</option>
          {cargos.filter((c) => c.unidadeId === unidadeId).map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <Input type="number" min={0} value={pontuacao} onChange={(e) => setPontuacao(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Voltar</Button></DialogClose>
          <Button disabled={isPending || !cargoId} onClick={salvar}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
