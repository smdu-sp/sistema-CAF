'use client';

import { Badge } from '@/components/ui/badge';
import type { CargoTtRow } from './form-cargo';
import ModalDelete from '../../_components/modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';

export function colunasCargos(unidades: { id: string; sigla: string; nome: string }[]): ColumnDef<CargoTtRow>[] {
  return [
    { accessorKey: 'nome', header: 'Cargo' },
    { id: 'unidade', header: 'Unidade', cell: ({ row }) => row.original.unidade.sigla },
    {
      accessorKey: 'ativo',
      header: () => <p className="text-center">Status</p>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant={row.original.ativo ? 'default' : 'destructive'}>{row.original.ativo ? 'Ativo' : 'Inativo'}</Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <p className="text-center">Ações</p>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <ModalUpdateAndCreate isUpdating cargo={row.original} unidades={unidades} />
          <ModalDelete id={row.original.id} status={!row.original.ativo} endpoint={`/api/teletrabalho/cargos/${row.original.id}`} rotulo="Cargo" />
        </div>
      ),
    },
  ];
}
