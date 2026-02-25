import DataTable, { TableSkeleton } from '@/components/data-table';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import ModalUpdateAndCreate from './_components/modal-update-create';

export default async function SalasPage() {
	const session = await auth();
	const usuario = (session as any)?.usuario;
	const permissao = usuario?.permissao;

	if (!session) {
		return (
			<div className="w-full px-0 md:px-8 pb-20 md:pb-14">
				<p>Você precisa estar autenticado.</p>
			</div>
		);
	}

	if (permissao !== 'ADM' && permissao !== 'DEV') {
		return (
			<div className="w-full px-0 md:px-8 pb-20 md:pb-14">
				<p>Somente administradores podem acessar esta página.</p>
			</div>
		);
	}

	return (
		<Suspense fallback={<TableSkeleton />}>
			<SalasContent />
		</Suspense>
	);
}

async function SalasContent() {
	const lista = await prisma.sala.findMany({
		orderBy: { nome: 'asc' },
		select: { id: true, nome: true, andar: true, localizacao: true, ativo: true },
	});

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Salas</h1>
			<p className="text-sm text-muted-foreground mt-1">
				Cadastre salas de reunião com nome, andar e localização.
			</p>
			<div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<DataTable columns={columns} data={lista} />
			</div>
			<div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
				<ModalUpdateAndCreate isUpdating={false} />
			</div>
		</div>
	);
}
