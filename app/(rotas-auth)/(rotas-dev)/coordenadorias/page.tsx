import DataTable from '@/components/data-table';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import ModalUpdateAndCreate from './_components/modal-update-create';
import { Skeleton } from '@/components/ui/skeleton';

export default async function CoordenadoriasPage() {
	return (
		<Suspense fallback={<Skeleton />}>
			<CoordenadoriasContent />
		</Suspense>
	);
}

async function CoordenadoriasContent() {
	const lista = await prisma.coordenadoria.findMany({
		orderBy: { nome: 'asc' },
		select: { id: true, nome: true, ativo: true },
	});

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Coordenadorias</h1>
			<p className="text-sm text-muted-foreground mt-1">
				Cadastre coordenadorias para vincular aos usuários e às reservas.
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
