'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormAdesao, { type AdesaoRow } from './form-adesao';

export default function ModalUpdateAndCreate({
  isUpdating,
  adesao,
  servidores,
}: {
  isUpdating: boolean;
  adesao?: Partial<AdesaoRow>;
  servidores: { id: string; nome: string; rf: string }[];
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
          <DialogTitle>{isUpdating ? 'Editar ' : 'Registrar '}Termo de Adesão</DialogTitle>
          <DialogDescription>Apenas metadados. O documento assinado permanece na CAF/DGP.</DialogDescription>
        </DialogHeader>
        <FormAdesao isUpdating={isUpdating} adesao={adesao} servidores={servidores} />
      </DialogContent>
    </Dialog>
  );
}
