'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Link2, Unlink, Search } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { EquipamentoDetalhe } from './detalhe-tipos';

type ItemDisponivel = {
	idbem: number;
	patrimonio: string | null;
	descsbpm: string | null;
	tipo: string | null;
	numserie: string | null;
};

export default function VincularPatrimonio({
	equipamentoId,
	item,
}: {
	equipamentoId: number;
	item: EquipamentoDetalhe['item'];
}) {
	const [busca, setBusca] = useState('');
	const [resultados, setResultados] = useState<ItemDisponivel[]>([]);
	const [buscando, setBuscando] = useState(false);
	const [isPending, startTransition] = useTransition();

	async function buscar() {
		if (busca.trim().length < 2) {
			toast.info('Digite ao menos 2 caracteres');
			return;
		}
		setBuscando(true);
		try {
			const res = await fetch(
				`/api/inventario/patrimonio-disponivel?q=${encodeURIComponent(busca.trim())}`,
			);
			const data = await res.json();
			if (!res.ok) {
				toast.error('Erro na busca', { description: data.error });
				return;
			}
			setResultados(data);
			if (data.length === 0) toast.info('Nenhum item disponível encontrado');
		} catch {
			toast.error('Falha na comunicação com o servidor');
		} finally {
			setBuscando(false);
		}
	}

	function alterarVinculo(itemId: number | null) {
		startTransition(async () => {
			try {
				const res = await fetch(`/api/inventario/equipamentos/${equipamentoId}`, {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ itemId }),
				});
				const data = await res.json();
				if (!res.ok) {
					toast.error('Erro', { description: data.error });
					return;
				}
				toast.success(itemId ? 'Patrimônio vinculado' : 'Vínculo removido');
				window.location.reload();
			} catch {
				toast.error('Falha na comunicação com o servidor');
			}
		});
	}

	if (item) {
		return (
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<Link2 size={16} className="text-primary" />
					<span className="font-medium">{item.patrimonio ?? `#${item.idbem}`}</span>
					<span className="text-sm text-muted-foreground">
						{item.descsbpm ?? item.tipo ?? ''}
					</span>
				</div>
				<div>
					<Button
						size="sm"
						variant="outline"
						disabled={isPending}
						onClick={() => alterarVinculo(null)}
					>
						{isPending ? (
							<Loader2 className="animate-spin" size={16} />
						) : (
							<Unlink size={16} />
						)}
						Desvincular
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<Input
					placeholder="Buscar por patrimônio, descrição ou nº de série"
					value={busca}
					onChange={(e) => setBusca(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && buscar()}
				/>
				<Button variant="outline" onClick={buscar} disabled={buscando}>
					{buscando ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
					Buscar
				</Button>
			</div>
			{resultados.length > 0 && (
				<div className="flex flex-col gap-1 rounded-md border p-2 max-h-64 overflow-y-auto">
					{resultados.map((r) => (
						<div
							key={r.idbem}
							className="flex items-center justify-between gap-2 rounded p-2 hover:bg-muted"
						>
							<div className="min-w-0">
								<p className="font-medium truncate">
									{r.patrimonio ?? `#${r.idbem}`}
									{r.tipo ? <span className="text-muted-foreground"> · {r.tipo}</span> : null}
								</p>
								<p className="text-xs text-muted-foreground truncate">
									{r.descsbpm ?? ''} {r.numserie ? `· SN ${r.numserie}` : ''}
								</p>
							</div>
							<Button
								size="sm"
								disabled={isPending}
								onClick={() => alterarVinculo(r.idbem)}
							>
								{isPending ? <Loader2 className="animate-spin" size={16} /> : <Link2 size={16} />}
								Vincular
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
