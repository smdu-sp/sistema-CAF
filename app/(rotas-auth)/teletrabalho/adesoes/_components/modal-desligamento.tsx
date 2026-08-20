'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserMinus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalDesligamento({ servidorId }: { servidorId: string }) {
  const [data, setData] = useState('');
  const [iniciativa, setIniciativa] = useState('servidor');
  const [motivo, setMotivo] = useState('');
  const [isPending, startTransition] = useTransition();

  function salvar() {
    startTransition(async () => {
      const res = await fetch('/api/teletrabalho/desligamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servidorId, data, iniciativa, motivo }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error('Erro', { description: json.error }); return; }
      toast.success('Desligamento registrado. Adesão vigente encerrada.');
      window.location.reload();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="hover:bg-destructive hover:text-white"><UserMinus size={20} /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Termo de desligamento</DialogTitle>
        </DialogHeader>
        <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={iniciativa} onChange={(e) => setIniciativa(e.target.value)}>
          <option value="servidor">Iniciativa do servidor</option>
          <option value="chefia">Iniciativa da chefia</option>
        </select>
        <Textarea placeholder="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Voltar</Button></DialogClose>
          <Button variant="destructive" disabled={isPending || !data || !motivo.trim()} onClick={salvar}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Registrar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
