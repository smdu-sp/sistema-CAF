'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormFeriado, { type FeriadoRow } from './form-feriado';

export default function ModalUpdateAndCreate({ isUpdating, feriado }: { isUpdating: boolean; feriado?: Partial<FeriadoRow> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className={isUpdating ? 'bg-background hover:bg-primary' : 'bg-primary hover:bg-primary hover:opacity-70 group'}>
          {isUpdating ? <SquarePen size={28} className="text-primary group-hover:text-white" /> : <Plus size={28} className="text-white" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Feriado</DialogTitle>
          <DialogDescription>Feriados nacionais, municipais e pontos facultativos do exercício.</DialogDescription>
        </DialogHeader>
        <FormFeriado isUpdating={isUpdating} feriado={feriado} />
      </DialogContent>
    </Dialog>
  );
}
