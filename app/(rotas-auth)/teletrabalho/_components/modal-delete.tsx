'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Loader2, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function ModalDelete({
  id,
  status,
  endpoint,
  rotulo,
}: {
  id: string;
  status: boolean;
  endpoint: string;
  rotulo: string;
}) {
  const [isPending, startTransition] = useTransition();

  async function handleAction() {
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: status }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error('Erro', { description: data.error });
      return;
    }
    toast.success(status ? `${rotulo} ativado(a)` : `${rotulo} desativado(a)`);
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={status
            ? 'hover:bg-primary cursor-pointer hover:text-white group transition-all ease-linear duration-200'
            : 'hover:bg-destructive cursor-pointer hover:text-white group transition-all ease-linear duration-200'}
        >
          {status
            ? <Check size={24} className="text-primary dark:text-white group-hover:text-white group" />
            : <Trash2 size={24} className="text-destructive dark:text-white group-hover:text-white group" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{status ? `Ativar ${rotulo}` : `Desativar ${rotulo}`}</DialogTitle>
        </DialogHeader>
        <p>{status ? `Tem certeza que deseja ativar este(a) ${rotulo.toLowerCase()}?` : `Tem certeza que deseja desativar este(a) ${rotulo.toLowerCase()}?`}</p>
        <DialogFooter>
          <div className="flex gap-2">
            <DialogClose asChild><Button variant="outline">Voltar</Button></DialogClose>
            <Button disabled={isPending} onClick={() => startTransition(() => handleAction())} type="button" variant={status ? 'default' : 'destructive'}>
              {isPending ? <Loader2 className="animate-spin" /> : status ? 'Ativar' : 'Desativar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
