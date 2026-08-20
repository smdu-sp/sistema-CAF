import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import { prisma } from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BuscasContent, { type SolicitacaoRow } from './_components/buscas-content';

export default async function BuscasPage() {
	await verificarAcessoPaginaHelpdesk('patrimonio');

	const solicitacoes = await prisma.invColetaSolicitacao.findMany({
		orderBy: { criadoEm: 'desc' },
		take: 100,
		select: {
			id: true,
			alvo: true,
			tipoAlvo: true,
			status: true,
			resultado: true,
			processadoEm: true,
			criadoEm: true,
			solicitante: { select: { id: true, nome: true } },
		},
	});

	const inicial: SolicitacaoRow[] = solicitacoes.map((s) => ({
		...s,
		tipoAlvo: s.tipoAlvo as SolicitacaoRow['tipoAlvo'],
		processadoEm: s.processadoEm ? s.processadoEm.toISOString() : null,
		criadoEm: s.criadoEm.toISOString(),
	}));

	return (
		<div className="w-full px-0 md:px-8 pb-20 md:pb-14 md:container mx-auto">
			<Link
				href="/helpdesk/inventario"
				className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft size={16} /> Voltar ao painel
			</Link>
			<h1 className="mt-2 text-xl md:text-4xl font-bold">Solicitar buscas</h1>
			<p className="text-sm text-muted-foreground mt-1 mb-5">
				Enfileire coletas de rede sob demanda. O coletor executa e devolve o
				resultado.
			</p>
			<BuscasContent inicial={inicial} />
		</div>
	);
}
