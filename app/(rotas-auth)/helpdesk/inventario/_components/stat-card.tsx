import Link from 'next/link';
import type { ReactNode } from 'react';

/** Cartão de indicador do painel. Se `href`, vira link. */
export function StatCard({
	label,
	valor,
	icon,
	href,
	destaque,
}: {
	label: string;
	valor: number | string;
	icon?: ReactNode;
	href?: string;
	/** cor de destaque para o número (ex.: alerta) */
	destaque?: string;
}) {
	const conteudo = (
		<div className="flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50">
			<div className="flex items-center justify-between">
				<span className="text-xs uppercase tracking-wide text-muted-foreground">
					{label}
				</span>
				{icon ? <span className="text-muted-foreground">{icon}</span> : null}
			</div>
			<span
				className="text-3xl font-bold"
				style={destaque ? { color: destaque } : undefined}
			>
				{valor}
			</span>
		</div>
	);

	if (href) {
		return (
			<Link href={href} className="block">
				{conteudo}
			</Link>
		);
	}
	return conteudo;
}
