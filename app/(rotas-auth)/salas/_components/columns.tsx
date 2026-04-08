'use client';

import { Badge } from '@/components/ui/badge';
import type { SalaRow } from './form-sala';
import ModalDelete from './modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';

export type { SalaRow };

export const columns: ColumnDef<SalaRow>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'andar',
		header: 'Andar',
		cell: ({ row }) => row.original.andar ?? '—',
	},
	{
		accessorKey: 'numero',
		header: 'Número',
		cell: ({ row }) => row.original.numero ?? '—',
	},
	{
		accessorKey: 'lotacao',
		header: 'Lotação',
		cell: ({ row }) => row.original.lotacao ?? '—',
	},
	{
		accessorKey: 'layout',
		header: 'Layout',
		cell: ({ row }) => {
			if (!row.original.layout) return '—';
			return row.original.layout === 'MOVEL' ? 'Móvel' : 'Fixo';
		},
	},
	{
		accessorKey: 'ativo',
		header: () => <p className="text-center">Status</p>,
		cell: ({ row }) => {
			const ativo = row.original.ativo;
			return (
				<div className="flex items-center justify-center">
					<Badge variant={ativo ? 'default' : 'destructive'}>
						{ativo ? 'Ativa' : 'Inativa'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className="text-center">Ações</p>,
		cell: ({ row }) => (
			<div className="flex gap-2 items-center justify-center" key={row.id}>
				<ModalUpdateAndCreate sala={row.original} isUpdating />
				<ModalDelete id={row.original.id} status={!row.original.ativo} />
			</div>
		),
	},
];
