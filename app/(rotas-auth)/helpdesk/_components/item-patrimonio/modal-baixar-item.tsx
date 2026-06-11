'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { normalizarStatusItem } from '@/lib/helpdesk/item-patrimonio';
import { cn } from '@/lib/utils';
import { Archive, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { AlertaMovimentacaoAtic } from './alerta-movimentacao-atic';

const STATUS_BAIXA = ['Baixado', 'Descartado', 'Para Descarte'] as const;

function hojeIsoDate() {
	return new Date().toISOString().slice(0, 10);
}

export default function ModalBaixarItem({
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
	const [open, setOpen] = useState(false);
	const [documentoSbpm, setDocumentoSbpm] = useState('');
	const [dataBaixa, setDataBaixa] = useState(hojeIsoDate());
	const [observacao, setObservacao] = useState('');
	const [isPending, startTransition] = useTransition();

	const statusNorm = normalizarStatusItem(statusAtual);
	const jaBaixado = STATUS_BAIXA.includes(statusNorm as (typeof STATUS_BAIXA)[number]);

	function resetForm() {
		setDocumentoSbpm('');
		setDataBaixa(hojeIsoDate());
		setObservacao('');
	}

	async function handleBaixar() {
		if (!documentoSbpm.trim()) {
			toast.error('Informe o documento do sistema de bens');
			return;
		}

		const res = await fetch('/api/helpdesk/baixas', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				idItem: idbem,
				documentoSbpm: documentoSbpm.trim(),
				dataBaixa: dataBaixa ? `${dataBaixa}T12:00:00` : undefined,
				observacao: observacao.trim() || null,
			}),
		});
		const data = await res.json();
		if (!res.ok) {
			toast.error('Erro ao baixar item', { description: data.error });
			return;
		}
		toast.success('Baixa registrada e item movimentado para a ATIC');
		setOpen(false);
		resetForm();
		window.location.reload();
	}

	if (jaBaixado || jaTemBaixa) return null;

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (!v) resetForm();
			}}
		>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					title="Baixar bem"
					className="h-8 w-8 shrink-0 hover:bg-destructive cursor-pointer hover:text-white group transition-all ease-linear duration-200"
				>
					<Archive
						size={20}
						className="text-destructive dark:text-white group-hover:text-white"
					/>
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Baixar bem patrimonial</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 text-sm">
					<p>
						Patrimônio <strong>{patrimonio}</strong> — será registrada a baixa
						formal e o item ficará indisponível para uso.
					</p>

					<AlertaMovimentacaoAtic
						localizacaoAtual={localizacaoAtual}
						servidorAtual={servidorAtual}
						acaoLabel="Ao confirmar a baixa"
					/>

					<div className="space-y-2">
						<Label htmlFor="documentoSbpm">
							Documento SBPM / processo de baixa *
						</Label>
						<Input
							id="documentoSbpm"
							value={documentoSbpm}
							onChange={(e) => setDocumentoSbpm(e.target.value)}
							placeholder="Ex: BAIXA - 001.002987/2022"
							maxLength={200}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="dataBaixa">Data da baixa *</Label>
						<Input
							id="dataBaixa"
							type="date"
							value={dataBaixa}
							onChange={(e) => setDataBaixa(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label>Registrado por</Label>
						<Input value={usuarioLogadoNome ?? 'Usuário logado'} readOnly />
					</div>

					<div className="space-y-2">
						<Label htmlFor="observacaoBaixa">Observações</Label>
						<textarea
							id="observacaoBaixa"
							value={observacao}
							onChange={(e) => setObservacao(e.target.value)}
							placeholder="Motivo da baixa, destino do equipamento, etc."
							rows={3}
							className={cn(
								'border-input placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none',
								'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
							)}
						/>
					</div>
				</div>
				<DialogFooter>
					<div className="flex gap-2">
						<DialogClose asChild>
							<Button variant="outline">Voltar</Button>
						</DialogClose>
						<Button
							disabled={isPending}
							onClick={() => startTransition(() => handleBaixar())}
							type="button"
							variant="destructive"
						>
							{isPending ? (
								<Loader2 className="animate-spin" />
							) : (
								'Confirmar baixa e movimentar'
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
