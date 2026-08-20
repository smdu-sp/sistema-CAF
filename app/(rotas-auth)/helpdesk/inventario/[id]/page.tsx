import { equipamentoDetalheSelect } from '@/lib/inventario/api-helpers';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DetalheEquipamento from '../_components/detalhe-equipamento';
import type { EquipamentoDetalhe } from '../_components/detalhe-tipos';

export default async function EquipamentoDetalhePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await verificarAcessoPaginaHelpdesk('patrimonio');
	const { id: idParam } = await params;
	const id = Number.parseInt(idParam, 10);
	if (!Number.isFinite(id) || id < 1) notFound();

	const eq = await prisma.invEquipamento.findUnique({
		where: { id },
		select: equipamentoDetalheSelect,
	});
	if (!eq) notFound();

	// Datas → string para o client component.
	const data: EquipamentoDetalhe = {
		...eq,
		ultimoContato: eq.ultimoContato ? eq.ultimoContato.toISOString() : null,
		ultimaColeta: eq.ultimaColeta ? eq.ultimaColeta.toISOString() : null,
		criadoEm: eq.criadoEm.toISOString(),
		atualizadoEm: eq.atualizadoEm.toISOString(),
		historico: eq.historico.map((h) => ({
			...h,
			criadoEm: h.criadoEm.toISOString(),
		})),
		localizacoes: eq.localizacoes.map((l) => ({
			...l,
			criadoEm: l.criadoEm.toISOString(),
		})),
		alertas: eq.alertas.map((a) => ({
			...a,
			criadoEm: a.criadoEm.toISOString(),
		})),
	};

	return <DetalheEquipamento eq={data} />;
}
