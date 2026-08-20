'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormCargo, { type CargoTtRow } from './form-cargo';

export default function ModalUpdateAndCreate({ isUpdating, cargo, unidades }: { isUpdating: boolean; cargo?: Partial<CargoTtRow>; unidades: { id: string; sigla: string; nome: string }[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className={isUpdating ? 'bg-background hover:bg-primary' : 'bg-primary hover:bg-primary hover:opacity-70 group'}>
          {isUpdating ? <SquarePen size={28} className="text-primary group-hover:text-white" /> : <Plus size={28} className="text-white" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Cargo</DialogTitle>
          <DialogDescription>Cargos são próprios de cada unidade.</DialogDescription>
        </DialogHeader>
        <FormCargo isUpdating={isUpdating} cargo={cargo} unidades={unidades} />
      </DialogContent>
    </Dialog>
  );
}
