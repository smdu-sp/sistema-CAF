import { TableSkeleton } from '@/components/data-table';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import { equipamentoListSelect } from '@/lib/inventario/api-helpers';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import ModalUpdateAndCreate from '../_components/modal-update-create';
import TabelaEquipamentos from '../_components/tabela-equipamentos';
import type { EquipamentoRow } from '../_components/tipos';

export default async function EquipamentosPage() {
	await verificarAcessoPaginaHelpdesk('patrimonio');
	return (
		<Suspense fallback={<TableSkeleton />}>
			<EquipamentosContent />
		</Suspense>
	);
}

async function EquipamentosContent() {
	const [equipamentos, unidades, usuarios] = await Promise.all([
		prisma.invEquipamento.findMany({
			orderBy: [{ statusRede: 'asc' }, { hostname: 'asc' }, { id: 'asc' }],
			select: equipamentoListSelect,
		}),
		prisma.hdUnidade.findMany({
			where: { ativo: true },
			orderBy: { nome: 'asc' },
			select: { id: true, nome: true },
		}),
		prisma.usuario.findMany({
			where: { status: true },
			orderBy: { nome: 'asc' },
			select: { id: true, nome: true },
		}),
	]);

	// Datas → string para serializar ao client component.
	const data: EquipamentoRow[] = equipamentos.map((e) => ({
		...e,
		ultimoContato: e.ultimoContato ? e.ultimoContato.toISOString() : null,
		ultimaColeta: e.ultimaColeta ? e.ultimaColeta.toISOString() : null,
	}));

	return (
		<div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
			<Link
				href="/helpdesk/inventario"
				className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft size={16} /> Voltar ao painel
			</Link>
			<h1 className="mt-2 text-xl md:text-4xl font-bold">Equipamentos</h1>
			<p className="text-sm text-muted-foreground mt-1">
				Equipamentos técnicos (hardware, software e rede). Cada equipamento pode
				ser vinculado a um item de patrimônio na tela de detalhe.
			</p>
			<div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
				<TabelaEquipamentos data={data} unidades={unidades} usuarios={usuarios} />
			</div>
			<div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
				<ModalUpdateAndCreate isUpdating={false} unidades={unidades} usuarios={usuarios} />
			</div>
		</div>
	);
}
