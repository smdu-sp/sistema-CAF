'use client';

import { Badge } from '@/components/ui/badge';
import type { ServidorTtRow } from './form-servidor';
import ModalDelete from '../../_components/modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';

export function colunasServidores(
  unidades: { id: string; sigla: string; nome: string }[],
  cargos: { id: string; nome: string; unidadeId: string }[],
): ColumnDef<ServidorTtRow>[] {
  return [
    { accessorKey: 'rf', header: 'RF' },
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'email', header: 'E-mail' },
    { id: 'unidade', header: 'Unidade', cell: ({ row }) => row.original.unidade.sigla },
    { id: 'cargo', header: 'Cargo', cell: ({ row }) => row.original.cargo.nome },
    { id: 'grupo', header: 'Grupo', cell: ({ row }) => row.original.escala?.grupo ?? '—' },
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
        <div className="flex gap-2 items-center justify-center">
          <ModalUpdateAndCreate isUpdating servidor={row.original} unidades={unidades} cargos={cargos} />
          <ModalDelete id={row.original.id} status={!row.original.ativo} endpoint={`/api/teletrabalho/servidores/${row.original.id}`} rotulo="Servidor" />
        </div>
      ),
    },
  ];
}
