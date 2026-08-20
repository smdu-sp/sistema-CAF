'use client';

import { UNIDADE_ATIC_LABEL } from '@/lib/helpdesk/transferencia-patrimonio';
import { AlertTriangle } from 'lucide-react';

export function AlertaMovimentacaoAtic({
	localizacaoAtual,
	servidorAtual,
	acaoLabel,
}: {
	localizacaoAtual?: string;
	servidorAtual?: string;
	acaoLabel?: string;
}) {
	const local = localizacaoAtual?.trim() && localizacaoAtual !== '—'
		? localizacaoAtual
		: null;
	const servidor = servidorAtual?.trim() && servidorAtual !== '—'
		? servidorAtual
		: null;

	return (
		<div
			role="alert"
			className="flex gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100"
		>
			<AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
			<div className="space-y-1.5">
				<p className="font-semibold">Movimentação automática para a ATIC</p>
				<p>
					{acaoLabel ? `${acaoLabel}, o` : 'Ao confirmar, o'} item será transferido
					automaticamente para a{' '}
					<strong>{UNIDADE_ATIC_LABEL}</strong>.
				</p>
				{servidor ? (
					<p>
						A responsabilidade será <strong>retirada do servidor</strong>{' '}
						<strong>{servidor}</strong>
						{local ? (
							<>
								{' '}
								(localização atual: <strong>{local}</strong>)
							</>
						) : null}
						.
					</p>
				) : local ? (
					<p>
						O item será retirado da localização atual{' '}
						<strong>{local}</strong> e passará para a custódia da ATIC.
					</p>
				) : (
					<p>
						O bem passará para a custódia da ATIC, sem servidor responsável
						vinculado.
					</p>
				)}
			</div>
		</div>
	);
}
