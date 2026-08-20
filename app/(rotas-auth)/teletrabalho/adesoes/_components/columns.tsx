'use client';

import { Badge } from '@/components/ui/badge';
import type { AdesaoRow } from './form-adesao';
import ModalUpdateAndCreate from './modal-update-create';
import ModalDesligamento from './modal-desligamento';
import { ColumnDef } from '@tanstack/react-table';
import { formatarDataBr } from '@/lib/teletrabalho/datas';

const SITUACAO: Record<string, string> = {
  pendente: 'Pendente',
  vigente: 'Vigente',
  encerrado: 'Encerrado',
};

export function colunasAdesoes(servidores: { id: string; nome: string; rf: string }[]): ColumnDef<AdesaoRow>[] {
  return [
    { id: 'servidor', header: 'Servidor', cell: ({ row }) => `${row.original.servidor.nome} (${row.original.servidor.rf})` },
    { id: 'unidade', header: 'Unidade', cell: ({ row }) => row.original.servidor.unidade.sigla },
    { id: 'assinatura', header: 'Assinatura', cell: ({ row }) => formatarDataBr(row.original.dataAssinatura as Date) },
    {
      id: 'ciencia',
      header: 'Ciência chefia',
      cell: ({ row }) => row.original.dataCienciaChefia ? formatarDataBr(row.original.dataCienciaChefia as Date) : '—',
    },
    {
      accessorKey: 'situacao',
      header: 'Situação',
      cell: ({ row }) => <Badge variant={row.original.situacao === 'vigente' ? 'default' : 'secondary'}>{SITUACAO[row.original.situacao]}</Badge>,
    },
    {
      id: 'actions',
      header: () => <p className="text-center">Ações</p>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <ModalUpdateAndCreate isUpdating adesao={row.original} servidores={servidores} />
          {row.original.situacao === 'vigente' && <ModalDesligamento servidorId={row.original.servidorId} />}
        </div>
      ),
    },
  ];
}
