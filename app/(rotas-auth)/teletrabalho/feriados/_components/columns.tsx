'use client';

import { Badge } from '@/components/ui/badge';
import type { FeriadoRow } from './form-feriado';
import ModalDelete from '../../_components/modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';
import { formatarDataBr } from '@/lib/teletrabalho/datas';

const TIPO: Record<string, string> = {
  nacional: 'Nacional',
  municipal: 'Municipal',
  ponto_facultativo: 'Ponto facultativo',
};

export const columns: ColumnDef<FeriadoRow>[] = [
  {
    accessorKey: 'data',
    header: 'Data',
    cell: ({ row }) => formatarDataBr(row.original.data as Date),
  },
  { accessorKey: 'nome', header: 'Nome' },
  { id: 'tipo', header: 'Tipo', cell: ({ row }) => TIPO[row.original.tipo] ?? row.original.tipo },
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
        <ModalUpdateAndCreate isUpdating feriado={row.original} />
        <ModalDelete id={row.original.id} status={!row.original.ativo} endpoint={`/api/teletrabalho/feriados/${row.original.id}`} rotulo="Feriado" />
      </div>
    ),
  },
];
