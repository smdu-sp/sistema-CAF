'use client';

import type { ReactNode } from 'react';
import { STATUS_ALTERAVEIS_VIA_BOTAO } from '@/lib/helpdesk/status-historico-patrimonio';
import { normalizarStatusItem } from '@/lib/helpdesk/item-patrimonio';
import {
	Archive,
	Gift,
	Package,
	RotateCcw,
	Trash2,
	Wrench,
} from 'lucide-react';
import ModalAlterarStatusItem from './modal-alterar-status-item';
import ModalBaixarItem from './modal-baixar-item';

const ICONES_STATUS: Record<
	(typeof STATUS_ALTERAVEIS_VIA_BOTAO)[number],
	ReactNode
> = {
	Manutenção: (
		<Wrench
			size={16}
			className="text-amber-700 dark:text-white group-hover:text-white"
		/>
	),
	Estoque: (
		<Package
			size={16}
			className="text-blue-800 dark:text-white group-hover:text-white"
		/>
	),
	'Para Descarte': (
		<Trash2
			size={16}
			className="text-red-800 dark:text-white group-hover:text-white"
		/>
	),
	Descartado: (
		<Trash2
			size={16}
			className="text-destructive dark:text-white group-hover:text-white"
		/>
	),
	Doado: (
		<Gift
			size={16}
			className="text-purple-800 dark:text-white group-hover:text-white"
		/>
	),
};

const LABELS_STATUS: Record<(typeof STATUS_ALTERAVEIS_VIA_BOTAO)[number], string> = {
	Manutenção: 'Manutenção',
	Estoque: 'Estoque',
	'Para Descarte': 'Sep. p/ Descarte',
	Descartado: 'Descartado',
	Doado: 'Doado',
};

const HOVER_STATUS: Record<
	(typeof STATUS_ALTERAVEIS_VIA_BOTAO)[number],
	string
> = {
	Manutenção: 'hover:bg-amber-600 hover:text-white group',
	Estoque: 'hover:bg-blue-800 hover:text-white group',
	'Para Descarte': 'hover:bg-red-700 hover:text-white group',
	Descartado: 'hover:bg-destructive hover:text-white group',
	Doado: 'hover:bg-purple-700 hover:text-white group',
};

export function BotoesStatusItem({
	idbem,
	patrimonio,
	statusAtual,
	localizacaoAtual,
	servidorAtual,
	usuarioLogadoNome,
	jaTemBaixa = false,
}: {
	idbem: number;
	patrimonio: string;
	statusAtual: string;
	localizacaoAtual?: string;
	servidorAtual?: string;
	usuarioLogadoNome?: string;
	jaTemBaixa?: boolean;
}) {
	const statusNorm = normalizarStatusItem(statusAtual);
	const podeReativar =
		statusNorm !== 'Ativo' && statusNorm !== 'Inativo';

	const statusDisponiveis = STATUS_ALTERAVEIS_VIA_BOTAO.filter(
		(s) => s !== statusNorm,
	);

	return (
		<>
			{statusDisponiveis.map((status) => (
				<ModalAlterarStatusItem
					key={status}
					idbem={idbem}
					statusAtual={statusNorm}
					statusDestino={status}
					label={LABELS_STATUS[status]}
					icon={ICONES_STATUS[status]}
					localizacaoAtual={localizacaoAtual}
					servidorAtual={servidorAtual}
					className={HOVER_STATUS[status]}
				/>
			))}
			<ModalBaixarItem
				idbem={idbem}
				patrimonio={patrimonio}
				statusAtual={statusAtual}
				localizacaoAtual={localizacaoAtual}
				servidorAtual={servidorAtual}
				usuarioLogadoNome={usuarioLogadoNome}
				jaTemBaixa={jaTemBaixa}
			/>
			{podeReativar && (
				<ModalAlterarStatusItem
					idbem={idbem}
					statusAtual={statusNorm}
					statusDestino="Ativo"
					label="Reativar (Ativo)"
					localizacaoAtual={localizacaoAtual}
					servidorAtual={servidorAtual}
					icon={
						<RotateCcw
							size={16}
							className="text-primary dark:text-white group-hover:text-white"
						/>
					}
					className="hover:bg-primary hover:text-white group"
				/>
			)}
			{statusNorm === 'Baixado' && (
				<span title="Baixa formal registrada">
					<Archive size={18} className="text-muted-foreground opacity-50" />
				</span>
			)}
		</>
	);
}
