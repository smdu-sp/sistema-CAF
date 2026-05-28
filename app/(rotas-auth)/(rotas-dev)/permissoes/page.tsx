import DataTable from '@/components/data-table';
import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import { columns } from './_components/columns';
import ModalUpdateAndCreate from './_components/modal-update-create';
import { Skeleton } from '@/components/ui/skeleton';
import { Modulo } from '@/prisma/generated';

type SearchParams = Promise<{
	pagina?: string;
	limite?: string;
	modulo?: string;
	busca?: string;
}>;

export default async function PermissoesPage({ searchParams }: { searchParams: SearchParams }) {
	return (
		<Suspense fallback={<Skeleton />}>
			<PermissoesContent searchParams={searchParams} />
		</Suspense>
	);
}

async function PermissoesContent({ searchParams }: { searchParams: SearchParams }) {
	const { pagina, limite, modulo, busca } = await searchParams;
	const url = new URLSearchParams({
		pagina: pagina || '1',
		limite: limite || '10',
		modulo: modulo || '',
		busca: busca || '',
	}).toString();
	console.log(url);
	
	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<h1 className="text-xl md:text-4xl font-bold">Permissões</h1>
			<p className="text-sm text-muted-foreground mt-1">
				Cadastre permissões para controlar o acesso aos recursos do sistema.
			</p>
			{/* <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<DataTable columns={columns} data={lista} />
			</div>
			<div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
				<ModalUpdateAndCreate isUpdating={false} />
			</div> */}
		</div>
	);
}
