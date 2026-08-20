'use client';

import { Badge } from '@/components/ui/badge';
import type { UnidadeTtRow } from './form-unidade';
import ModalDelete from '../../_components/modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';

export function colunasUnidades(
  unidades: { id: string; sigla: string; nome: string }[],
  servidores: { id: string; nome: string; rf: string }[],
): ColumnDef<UnidadeTtRow>[] {
  return [
    { accessorKey: 'sigla', header: 'Sigla' },
    { accessorKey: 'nome', header: 'Nome' },
    {
      accessorKey: 'codigoEh',
      header: 'EH',
      cell: ({ row }) => row.original.codigoEh ?? '—',
    },
    {
      id: 'parent',
      header: 'Superior',
      cell: ({ row }) => row.original.parent?.sigla ?? '—',
    },
    {
      id: 'chefia',
      header: 'Chefia',
      cell: ({ row }) => row.original.chefia?.nome ?? '—',
    },
    {
      accessorKey: 'ativo',
      header: () => <p className="text-center">Status</p>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge variant={row.original.ativo ? 'default' : 'destructive'}>
            {row.original.ativo ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <p className="text-center">Ações</p>,
      cell: ({ row }) => (
        <div className="flex gap-2 items-center justify-center">
          <ModalUpdateAndCreate isUpdating unidade={row.original} unidades={unidades} servidores={servidores} />
          <ModalDelete
            id={row.original.id}
            status={!row.original.ativo}
            endpoint={`/api/teletrabalho/unidades/${row.original.id}`}
            rotulo="Unidade"
          />
        </div>
      ),
    },
  ];
}
