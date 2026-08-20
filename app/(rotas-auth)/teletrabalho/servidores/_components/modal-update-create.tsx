'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormServidor, { type ServidorTtRow } from './form-servidor';

export default function ModalUpdateAndCreate({
  isUpdating,
  servidor,
  unidades,
  cargos,
}: {
  isUpdating: boolean;
  servidor?: Partial<ServidorTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
  cargos: { id: string; nome: string; unidadeId: string }[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className={isUpdating ? 'bg-background hover:bg-primary' : 'bg-primary hover:bg-primary hover:opacity-70 group transition-all ease-linear duration-200'}>
          {isUpdating ? <SquarePen size={28} className="text-primary group-hover:text-white group" /> : <Plus size={28} className="text-white group" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Servidor</DialogTitle>
          <DialogDescription>Cadastro sem endereço residencial ou telefone pessoal.</DialogDescription>
        </DialogHeader>
        <FormServidor isUpdating={isUpdating} servidor={servidor} unidades={unidades} cargos={cargos} />
      </DialogContent>
    </Dialog>
  );
}
