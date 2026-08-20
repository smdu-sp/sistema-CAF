'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem as FormFieldItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	STATUS_ITEM_PATRIMONIO,
	TIPOS_ITEM_PATRIMONIO,
	normalizarStatusItem,
} from '@/lib/helpdesk/item-patrimonio';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { CampoBuscaUsuario } from '../campo-busca-usuario';

const formSchema = z.object({
	patrimonio: z
		.string()
		.min(1, 'Patrimônio é obrigatório')
		.max(50, 'Máximo 50 caracteres'),
	tipo: z.enum(
		TIPOS_ITEM_PATRIMONIO as unknown as [string, ...string[]],
		{ message: 'Selecione o tipo' },
	),
	descsbpm: z
		.string()
		.min(1, 'Descrição é obrigatória')
		.max(300, 'Máximo 300 caracteres'),
	numserie: z.string().max(100).optional(),
	marca: z.string().max(100).optional(),
	modelo: z.string().max(100).optional(),
	cimbpm: z.string().max(50).optional(),
	nomeRede: z.string().max(120).optional(),
	statusitem: z.enum(
		STATUS_ITEM_PATRIMONIO as unknown as [string, ...string[]],
	),
	unidadeId: z.string().min(1, 'Selecione a unidade'),
	servidorId: z.string().optional(),
});

export type ItemRow = {
	idbem: number;
	patrimonio: string;
	tipo: string;
	descsbpm: string;
	numserie: string | null;
	marca: string | null;
	modelo: string | null;
	cimbpm: string | null;
	nomeRede: string | null;
	statusitem: string;
	unidadeId: string | null;
	servidorId: string | null;
	unidadeNome: string;
	servidorNome: string;
};

export type UnidadeOption = { id: string; nome: string };
export type UsuarioOption = { id: string; nome: string };

interface FormItemPatrimonioProps {
	isUpdating: boolean;
	item?: Partial<ItemRow>;
	unidades: UnidadeOption[];
	usuarios: UsuarioOption[];
}

export default function FormItemPatrimonio({
	isUpdating,
	item,
	unidades,
}: FormItemPatrimonioProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			patrimonio: item?.patrimonio ?? '',
			tipo: (item?.tipo as z.infer<typeof formSchema>['tipo']) ?? 'Computador',
			descsbpm: item?.descsbpm ?? '',
			numserie: item?.numserie ?? '',
			marca: item?.marca ?? '',
			modelo: item?.modelo ?? '',
			cimbpm: item?.cimbpm ?? '',
			nomeRede: item?.nomeRede ?? '',
			statusitem:
				(normalizarStatusItem(item?.statusitem ?? 'Ativo') as z.infer<
					typeof formSchema
				>['statusitem']) ?? 'Ativo',
			unidadeId: item?.unidadeId ?? '',
			servidorId: item?.servidorId ?? '__none__',
		},
	});

	const tipoWatch = form.watch('tipo');
	const exigeNomeRede =
		tipoWatch === 'Computador' || tipoWatch === 'Notebook';

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload: Record<string, unknown> = {
			patrimonio: values.patrimonio.trim(),
			tipo: values.tipo,
			descsbpm: values.descsbpm.trim(),
			numserie: values.numserie?.trim() || null,
			marca: values.marca?.trim() || null,
			modelo: values.modelo?.trim() || null,
			cimbpm: values.cimbpm?.trim() || null,
			nomeRede: values.nomeRede?.trim() || null,
			unidadeId: values.unidadeId,
			servidorId:
				values.servidorId && values.servidorId !== '__none__'
					? values.servidorId
					: null,
		};

		if (!isUpdating) {
			payload.statusitem = 'Ativo';
		}

		startTransition(async () => {
			try {
				if (isUpdating && item?.idbem) {
					const res = await fetch(`/api/helpdesk/itens/${item.idbem}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao atualizar', { description: data.error });
						return;
					}
					toast.success('Item atualizado');
				} else {
					const res = await fetch('/api/helpdesk/itens', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao cadastrar', { description: data.error });
						return;
					}
					toast.success('Item cadastrado');
				}
				window.location.reload();
			} catch {
				toast.error('Falha na comunicação com o servidor');
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
				<FormField
					control={form.control}
					name="patrimonio"
					render={({ field }) => (
						<FormFieldItem>
							<FormLabel>Patrimônio</FormLabel>
							<FormControl>
								<Input placeholder="Ex: 2024-001847" {...field} />
							</FormControl>
							<FormMessage />
						</FormFieldItem>
					)}
				/>
				<FormField
					control={form.control}
					name="descsbpm"
					render={({ field }) => (
						<FormFieldItem>
							<FormLabel>Descrição do equipamento</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Desktop Dell OptiPlex 7090" {...field} />
							</FormControl>
							<FormMessage />
						</FormFieldItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tipo"
					render={({ field }) => (
						<FormFieldItem>
							<FormLabel>Tipo</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Tipo do equipamento" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{TIPOS_ITEM_PATRIMONIO.map((t) => (
										<SelectItem key={t} value={t}>
											{t}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormFieldItem>
					)}
				/>
				<FormFieldItem>
					<FormLabel>Marca/Modelo</FormLabel>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="marca"
							render={({ field }) => (
								<FormFieldItem>
									<FormControl>
										<Input placeholder="Marca (ex: Dell)" {...field} />
									</FormControl>
									<FormMessage />
								</FormFieldItem>
							)}
						/>
						<FormField
							control={form.control}
							name="modelo"
							render={({ field }) => (
								<FormFieldItem>
									<FormControl>
										<Input placeholder="Modelo (ex: OptiPlex 7090)" {...field} />
									</FormControl>
									<FormMessage />
								</FormFieldItem>
							)}
						/>
					</div>
				</FormFieldItem>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="numserie"
						render={({ field }) => (
							<FormFieldItem>
								<FormLabel>Nº de série</FormLabel>
								<FormControl>
									<Input placeholder="Opcional" {...field} />
								</FormControl>
								<FormMessage />
							</FormFieldItem>
						)}
					/>
					<FormField
						control={form.control}
						name="cimbpm"
						render={({ field }) => (
							<FormFieldItem>
								<FormLabel>CIM BPM</FormLabel>
								<FormControl>
									<Input placeholder="Ex: CIM-89421" {...field} />
								</FormControl>
								<FormMessage />
							</FormFieldItem>
						)}
					/>
				</div>
				{exigeNomeRede ? (
					<FormField
						control={form.control}
						name="nomeRede"
						render={({ field }) => (
							<FormFieldItem>
								<FormLabel>Nome na rede</FormLabel>
								<FormControl>
									<Input placeholder="Ex: CAP-ASABOYA-001" {...field} />
								</FormControl>
								<FormMessage />
							</FormFieldItem>
						)}
					/>
				) : null}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="unidadeId"
						render={({ field }) => (
							<FormFieldItem>
								<FormLabel>Unidade (localização)</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione a unidade" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{unidades.map((u) => (
											<SelectItem key={u.id} value={u.id}>
												{u.nome}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormFieldItem>
						)}
					/>
					<FormField
						control={form.control}
						name="servidorId"
						render={({ field }) => (
							<FormFieldItem>
								<FormLabel>Servidor (responsável)</FormLabel>
								<FormControl>
									<CampoBuscaUsuario
										value={field.value ?? '__none__'}
										onChange={field.onChange}
										nomeInicial={
											field.value !== '__none__' &&
											item?.servidorNome &&
											item.servidorNome !== '—'
												? item.servidorNome
												: undefined
										}
										vazioValue="__none__"
										permitirVazio
										labelVazio="Sem responsável"
										placeholder="Digite o nome do servidor..."
									/>
								</FormControl>
								<FormMessage />
							</FormFieldItem>
						)}
					/>
				</div>
				{!isUpdating && (
					<p className="text-sm text-muted-foreground">
						Novos itens são cadastrados com status <strong>Ativo</strong>.
						Alterações de status são feitas pelos botões na listagem.
					</p>
				)}
				<div className="flex gap-2 items-center justify-end sticky bottom-0 bg-background pt-2">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Voltar
						</Button>
					</DialogClose>
					<Button disabled={isPending} type="submit">
						{isUpdating ? (
							<>
								Atualizar {isPending && <Loader2 className="animate-spin" />}
							</>
						) : (
							<>
								Adicionar {isPending && <Loader2 className="animate-spin" />}
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
