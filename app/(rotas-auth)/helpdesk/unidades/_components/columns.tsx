'use client';

import { Badge } from '@/components/ui/badge';
import type { UnidadeRow } from './form-unidade';
import ModalDelete from './modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';

export type { UnidadeRow };

export const columns: ColumnDef<UnidadeRow>[] = [
	{
		accessorKey: 'codigo',
		header: 'Código',
	},
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'raiz',
		header: 'Raiz',
	},
	{
		accessorKey: 'sigla',
		header: 'Sigla',
	},
	{
		accessorKey: 'sala',
		header: 'Sala',
		cell: ({ row }) => row.original.sala ?? '—',
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
				<ModalUpdateAndCreate unidade={row.original} isUpdating />
				<ModalDelete id={row.original.id} status={!row.original.ativo} />
			</div>
		),
	},
];
