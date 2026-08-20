'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormAtividade, { type AtividadeTtRow } from './form-atividade';

export default function ModalUpdateAndCreate({
  isUpdating,
  atividade,
  unidades,
  categorias,
  cargos,
}: {
  isUpdating: boolean;
  atividade?: Partial<AtividadeTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
  categorias: { id: string; nome: string; unidadeId: string }[];
  cargos: { id: string; nome: string; unidadeId: string }[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className={isUpdating ? 'bg-background hover:bg-primary' : 'bg-primary hover:bg-primary hover:opacity-70 group'}>
          {isUpdating ? <SquarePen size={28} className="text-primary group-hover:text-white" /> : <Plus size={28} className="text-white" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Atividade</DialogTitle>
          <DialogDescription>A pontuação fica na associação cargo × atividade, com vigência.</DialogDescription>
        </DialogHeader>
        <FormAtividade isUpdating={isUpdating} atividade={atividade} unidades={unidades} categorias={categorias} cargos={cargos} />
      </DialogContent>
    </Dialog>
  );
}
