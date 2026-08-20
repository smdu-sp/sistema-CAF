import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import {
	STATUS_REDE_META,
	TIPO_EQUIPAMENTO_LABEL,
	type StatusRede,
	type TipoEquipamento,
} from '@/lib/inventario/equipamento';
import { prisma } from '@/lib/prisma';
import {
	AlertTriangle,
	HardDrive,
	Link2Off,
	MonitorSmartphone,
	Radio,
	Search,
	ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';
import { StatCard } from './_components/stat-card';

export default async function InventarioPainelPage() {
	await verificarAcessoPaginaHelpdesk('patrimonio');

	const [
		total,
		porStatus,
		porTipo,
		semPatrimonio,
		alertasAbertos,
		comSoftwareProibido,
		discos,
	] = await Promise.all([
		prisma.invEquipamento.count(),
		prisma.invEquipamento.groupBy({ by: ['statusRede'], _count: true }),
		prisma.invEquipamento.groupBy({ by: ['tipo'], _count: true }),
		prisma.invEquipamento.count({ where: { itemId: null } }),
		prisma.invAlerta.count({ where: { resolvido: false } }),
		prisma.invEquipamento.count({ where: { softwares: { some: { proibido: true } } } }),
		prisma.invDisco.findMany({
			where: { tamanhoMb: { gt: 0 } },
			select: { equipamentoId: true, tamanhoMb: true, livreMb: true },
		}),
	]);

	const statusCount = (s: StatusRede) =>
		porStatus.find((p) => p.statusRede === s)?._count ?? 0;

	// Discos "cheios": < 10% livre. Conta equipamentos distintos.
	const equipComDiscoCheio = new Set(
		discos
			.filter((d) => d.livreMb !== null && d.tamanhoMb! * 0.1 > d.livreMb)
			.map((d) => d.equipamentoId),
	).size;

	const tipos = porTipo
		.map((t) => ({
			tipo: t.tipo as TipoEquipamento,
			label: TIPO_EQUIPAMENTO_LABEL[t.tipo as TipoEquipamento] ?? t.tipo,
			count: t._count,
		}))
		.sort((a, b) => b.count - a.count);

	return (
		<div className="w-full px-0 md:px-8 pb-20 md:pb-14 md:container mx-auto">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-xl md:text-4xl font-bold">Inventário de TI</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Painel de gestão dos ativos técnicos.
					</p>
				</div>
				<Link
					href="/helpdesk/inventario/equipamentos"
					className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
				>
					<MonitorSmartphone size={18} /> Ver equipamentos
				</Link>
			</div>

			{/* KPIs */}
			<div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
				<StatCard
					label="Total"
					valor={total}
					icon={<MonitorSmartphone size={18} />}
					href="/helpdesk/inventario/equipamentos"
				/>
				<StatCard
					label="Online"
					valor={statusCount('online')}
					icon={<Radio size={18} />}
					destaque={STATUS_REDE_META.online.corText}
				/>
				<StatCard
					label="Offline"
					valor={statusCount('offline')}
					icon={<Radio size={18} />}
					destaque={STATUS_REDE_META.offline.corText}
				/>
				<StatCard
					label="Sem patrimônio"
					valor={semPatrimonio}
					icon={<Link2Off size={18} />}
				/>
				<StatCard
					label="Alertas abertos"
					valor={alertasAbertos}
					icon={<AlertTriangle size={18} />}
					destaque={alertasAbertos > 0 ? '#B45309' : undefined}
				/>
				<StatCard
					label="Disco quase cheio"
					valor={equipComDiscoCheio}
					icon={<HardDrive size={18} />}
					destaque={equipComDiscoCheio > 0 ? '#B45309' : undefined}
				/>
			</div>

			<div className="mt-6 grid gap-4 lg:grid-cols-2">
				{/* Distribuição por tipo */}
				<Card>
					<CardHeader>
						<CardTitle>Por tipo</CardTitle>
					</CardHeader>
					<CardContent>
						{tipos.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Nenhum equipamento cadastrado ainda. Rode uma coleta ou cadastre
								manualmente.
							</p>
						) : (
							<div className="flex flex-col gap-2">
								{tipos.map((t) => {
									const pct = total > 0 ? Math.round((t.count / total) * 100) : 0;
									return (
										<div key={t.tipo} className="flex items-center gap-3">
											<span className="w-28 shrink-0 text-sm">{t.label}</span>
											<div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
												<div
													className="h-full rounded-full bg-primary"
													style={{ width: `${pct}%` }}
												/>
											</div>
											<span className="w-10 shrink-0 text-right text-sm font-medium">
												{t.count}
											</span>
										</div>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Gestão / ações */}
				<Card>
					<CardHeader>
						<CardTitle>Gestão</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<AcaoCard
							href="/helpdesk/inventario/equipamentos"
							icon={<MonitorSmartphone size={18} />}
							titulo="Equipamentos"
							descricao="Lista, cadastro e vínculo ao patrimônio"
						/>
						<AcaoCard
							href="/helpdesk/inventario/buscas"
							icon={<Search size={18} />}
							titulo="Solicitar buscas"
							descricao="Enfileirar coletas de rede"
						/>
						<AcaoCard
							icon={<ShieldAlert size={18} />}
							titulo="Alertas"
							descricao="Disco cheio, offline, software proibido"
							emBreve
						/>
						<AcaoCard
							icon={<Search size={18} />}
							titulo="Softwares proibidos"
							descricao={`${comSoftwareProibido} equipamento(s) com software proibido`}
							emBreve
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function AcaoCard({
	href,
	icon,
	titulo,
	descricao,
	emBreve,
}: {
	href?: string;
	icon: React.ReactNode;
	titulo: string;
	descricao: string;
	emBreve?: boolean;
}) {
	const conteudo = (
		<div
			className={`flex h-full flex-col gap-1 rounded-lg border p-3 ${
				href ? 'hover:bg-muted/50' : 'opacity-60'
			}`}
		>
			<div className="flex items-center gap-2 font-medium">
				{icon}
				{titulo}
				{emBreve ? (
					<span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
						em breve
					</span>
				) : null}
			</div>
			<span className="text-xs text-muted-foreground">{descricao}</span>
		</div>
	);
	return href ? (
		<Link href={href} className="block">
			{conteudo}
		</Link>
	) : (
		conteudo
	);
}
