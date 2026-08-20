'use client';

import { Badge } from '@/components/ui/badge';
import type { AtividadeTtRow } from './form-atividade';
import ModalDelete from '../../_components/modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import AssociarCargo from './associar-cargo';
import { ColumnDef } from '@tanstack/react-table';

export function colunasAtividades(
  unidades: { id: string; sigla: string; nome: string }[],
  categorias: { id: string; nome: string; unidadeId: string }[],
  cargos: { id: string; nome: string; unidadeId: string }[],
): ColumnDef<AtividadeTtRow>[] {
  return [
    { id: 'categoria', header: 'Categoria', cell: ({ row }) => row.original.categoria.nome },
    { accessorKey: 'descricao', header: 'Descrição' },
    { id: 'unidade', header: 'Unidade', cell: ({ row }) => row.original.unidade.sigla },
    {
      id: 'pontuacoes',
      header: 'Cargos / pts',
      cell: ({ row }) => row.original.cargos.map((c) => `${c.cargo.nome}: ${c.pontuacao}`).join(' · ') || '—',
    },
    {
      accessorKey: 'ativo',
      header: () => <p className="text-center">Status</p>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant={row.original.ativo ? 'default' : 'destructive'}>{row.original.ativo ? 'Ativa' : 'Inativa'}</Badge>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <p className="text-center">Ações</p>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <AssociarCargo atividadeId={row.original.id} unidadeId={row.original.unidadeId} cargos={cargos} />
          <ModalUpdateAndCreate isUpdating atividade={row.original} unidades={unidades} categorias={categorias} cargos={cargos} />
          <ModalDelete id={row.original.id} status={!row.original.ativo} endpoint={`/api/teletrabalho/atividades/${row.original.id}`} rotulo="Atividade" />
        </div>
      ),
    },
  ];
}
