'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import FormUnidadeTt, { type UnidadeTtRow } from './form-unidade';

export default function ModalUpdateAndCreate({
  isUpdating,
  unidade,
  unidades,
  servidores,
}: {
  isUpdating: boolean;
  unidade?: Partial<UnidadeTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
  servidores: { id: string; nome: string; rf: string }[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={isUpdating ? 'bg-background hover:bg-primary' : 'bg-primary hover:bg-primary hover:opacity-70 group transition-all ease-linear duration-200'}
        >
          {isUpdating ? <SquarePen size={28} className="text-primary group-hover:text-white group" /> : <Plus size={28} className="text-white group" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Unidade</DialogTitle>
          <DialogDescription>
            {isUpdating ? 'Altere os dados da unidade.' : 'Cadastre uma unidade de teletrabalho.'}
          </DialogDescription>
        </DialogHeader>
        <FormUnidadeTt isUpdating={isUpdating} unidade={unidade} unidades={unidades} servidores={servidores} />
      </DialogContent>
    </Dialog>
  );
}
