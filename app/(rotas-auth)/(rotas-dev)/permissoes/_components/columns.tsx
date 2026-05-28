'use client';

import ModalDelete from './modal-delete';
import ModalUpdateAndCreate from './modal-update-create';
import { ColumnDef } from '@tanstack/react-table';
import { Modulo } from '@/prisma/generated';

export type PermissaoRow = {
	id: string;
	nome: string;
	descricao: string | null;
	modulo: Modulo;
};

export const columns: ColumnDef<PermissaoRow>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'modulo',
		header: 'Módulo',
	},
	{
		accessorKey: 'descricao',
		header: 'Descrição',
	},
	{
		accessorKey: 'actions',
		header: () => <p className="text-center">Ações</p>,
		cell: ({ row }) => (
			<div className="flex gap-2 items-center justify-center" key={row.id}>
				{/* <ModalUpdateAndCreate isUpdating perm */}
			</div>
		),
	},
];
