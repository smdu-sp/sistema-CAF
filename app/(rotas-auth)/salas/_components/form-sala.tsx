'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, ChevronRight, Loader2, Minus, Plus } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { Layout } from '@prisma/client';
import { cn } from '@/lib/utils';

const STEPS = [
	{ id: 0, label: 'Dados da sala' },
	{ id: 1, label: 'Mobiliário' },
	{ id: 2, label: 'Mídia' },
	{ id: 3, label: 'Foto do layout' },
] as const;

const formSchema = z.object({
	nome: z.string().min(1, 'Nome da sala é obrigatório'),
	andar: z.string().optional(),
	numero: z.string().optional(),
	lotacao: z.coerce.number().int().positive().optional(),
	layout: z.enum(['FIXO', 'MOVEL']).optional(),
	mobiliarios: z.array(
		z.object({
			nome: z.string(),
			quantidade: z.coerce.number().int().positive().default(1),
		}),
	),
	midias: z.array(
		z.object({
			nome: z.string(),
			quantidade: z.coerce.number().int().positive().default(1),
		}),
	),
});

export type SalaRow = {
	id: string;
	nome: string;
	andar: string | null;
	numero: string | null;
	lotacao: number | null;
	layout: Layout | null;
	layoutImagemUrl: string | null;
	mobiliarios: { id: string; nome: string; quantidade: number }[];
	midias: { id: string; nome: string; quantidade: number }[];
	ativo: boolean;
};

interface FormSalaProps {
	isUpdating: boolean;
	sala?: Partial<SalaRow>;
}

function filtrarItens(
	lista: { nome: string; quantidade: number }[],
): { nome: string; quantidade: number }[] {
	return lista
		.map((x) => ({ nome: x.nome.trim(), quantidade: x.quantidade }))
		.filter((x) => x.nome.length > 0 && x.quantidade > 0);
}

export default function FormSala({ isUpdating, sala }: FormSalaProps) {
	const [step, setStep] = useState(0);
	const [isPending, startTransition] = useTransition();
	const [layoutImageFile, setLayoutImageFile] = useState<File | null>(null);
	const [removeLayoutImage, setRemoveLayoutImage] = useState(false);
	const [objectPreviewUrl, setObjectPreviewUrl] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: sala?.nome ?? '',
			andar: sala?.andar ?? '',
			numero: sala?.numero ?? '',
			lotacao: sala?.lotacao ?? undefined,
			layout: sala?.layout ?? undefined,
			mobiliarios: sala?.mobiliarios?.map((x) => ({ nome: x.nome, quantidade: x.quantidade })) ?? [],
			midias: sala?.midias?.map((x) => ({ nome: x.nome, quantidade: x.quantidade })) ?? [],
		},
	});

	const layoutWatch = form.watch('layout');

	const {
		fields: fieldsMobiliarios,
		append: appendMobiliario,
		remove: removeMobiliario,
	} = useFieldArray({ control: form.control, name: 'mobiliarios' });
	const {
		fields: fieldsMidias,
		append: appendMidia,
		remove: removeMidia,
	} = useFieldArray({ control: form.control, name: 'midias' });

	useEffect(() => {
		return () => {
			if (objectPreviewUrl) URL.revokeObjectURL(objectPreviewUrl);
		};
	}, [objectPreviewUrl]);

	function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0];
		if (objectPreviewUrl) {
			URL.revokeObjectURL(objectPreviewUrl);
			setObjectPreviewUrl(null);
		}
		if (!f) {
			setLayoutImageFile(null);
			return;
		}
		const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.type);
		if (!ok) {
			toast.error('Use JPEG, PNG, WebP ou GIF.');
			e.target.value = '';
			setLayoutImageFile(null);
			return;
		}
		if (f.size > 5 * 1024 * 1024) {
			toast.error('Arquivo muito grande (máx. 5 MB).');
			e.target.value = '';
			setLayoutImageFile(null);
			return;
		}
		setLayoutImageFile(f);
		setRemoveLayoutImage(false);
		setObjectPreviewUrl(URL.createObjectURL(f));
	}

	async function uploadLayoutImagem(salaId: string): Promise<boolean> {
		if (!layoutImageFile) return true;
		const fd = new FormData();
		fd.append('file', layoutImageFile);
		const res = await fetch(`/api/salas/${salaId}/layout-imagem`, {
			method: 'POST',
			body: fd,
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			toast.error('Erro ao enviar foto do layout', { description: data.error });
			return false;
		}
		return true;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const layout = values.layout;
		if (layout === 'MOVEL') {
			const temImagem =
				!!layoutImageFile ||
				(!!sala?.layoutImagemUrl && !removeLayoutImage);
			if (!temImagem) {
				toast.error('Layout móvel exige uma foto do layout.');
				setStep(3);
				return;
			}
		}

		startTransition(async () => {
			try {
				const payload: Record<string, unknown> = {
					nome: values.nome.trim(),
					andar: values.andar?.trim() || null,
					numero: values.numero?.trim() || null,
					lotacao: values.lotacao ?? null,
					layout: values.layout?.trim() || null,
					mobiliarios: filtrarItens(values.mobiliarios),
					midias: filtrarItens(values.midias),
				};

				if (layout !== 'MOVEL' || removeLayoutImage) {
					payload.layoutImagemUrl = null;
				}

				if (isUpdating && sala?.id) {
					const res = await fetch(`/api/salas/${sala.id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao atualizar', { description: data.error });
						return;
					}
					if (layout === 'MOVEL' && layoutImageFile) {
						const okUp = await uploadLayoutImagem(sala.id);
						if (!okUp) return;
					}
					toast.success('Sala atualizada');
				} else {
					const res = await fetch('/api/salas', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao cadastrar', { description: data.error });
						return;
					}
					if (layout === 'MOVEL' && layoutImageFile && data.id) {
						const okUp = await uploadLayoutImagem(data.id);
						if (!okUp) {
							toast.message('Sala criada, mas a foto não foi enviada. Edite a sala para enviar.');
						}
					}
					toast.success('Sala cadastrada');
				}
				window.location.reload();
			} catch {
				toast.error('Falha na comunicação com o servidor');
			}
		});
	}

	async function goNext() {
		if (step === 0) {
			const ok = await form.trigger(['nome', 'andar', 'numero', 'lotacao', 'layout']);
			if (!ok) return;
		}
		setStep((s) => Math.min(s + 1, STEPS.length - 1));
	}

	function goPrev() {
		setStep((s) => Math.max(s - 1, 0));
	}

	const imagemExistente = sala?.layoutImagemUrl && !removeLayoutImage;
	const previewSrc = objectPreviewUrl || (imagemExistente ? sala!.layoutImagemUrl! : null);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<nav aria-label="Etapas do cadastro" className="flex flex-wrap gap-2">
					{STEPS.map((s, i) => (
						<button
							key={s.id}
							type="button"
							onClick={() => {
								if (i <= step) setStep(i);
							}}
							className={cn(
								'flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors',
								i === step
									? 'border-primary bg-primary/10 text-foreground'
									: i < step
										? 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/60'
										: 'border-dashed border-border text-muted-foreground opacity-70',
							)}
						>
							<span
								className={cn(
									'flex size-6 items-center justify-center rounded-full text-[11px] font-semibold',
									i === step ? 'bg-primary text-primary-foreground' : 'bg-muted',
								)}
							>
								{i + 1}
							</span>
							{s.label}
						</button>
					))}
				</nav>

				{step === 0 && (
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="nome"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome da sala</FormLabel>
									<FormControl>
										<Input placeholder="Ex: Sala de reunião" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="andar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Andar (opcional)</FormLabel>
									<FormControl>
										<Input placeholder="Ex: 2º andar, Térreo" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="numero"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Número da sala (opcional)</FormLabel>
									<FormControl>
										<Input placeholder="Ex: 182-A" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lotacao"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Lotação (opcional)</FormLabel>
									<FormControl>
										<Input
											type="number"
											min={1}
											placeholder="Ex: 12"
											value={field.value ?? ''}
											onChange={(e) =>
												field.onChange(e.target.value ? Number(e.target.value) : undefined)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="layout"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Layout</FormLabel>
									<FormControl>
										<select
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring"
											value={field.value ?? ''}
											onChange={(e) =>
												field.onChange(e.target.value ? e.target.value : undefined)
											}
										>
											<option value="">Selecione</option>
											<option value="FIXO">Fixo</option>
											<option value="MOVEL">Móvel</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				)}

				{step === 1 && (
					<div className="space-y-2 rounded-md border p-3">
						<div className="flex items-center justify-between">
							<FormLabel className="m-0">Mobiliário</FormLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendMobiliario({ nome: '', quantidade: 1 })}
							>
								<Plus className="size-4" /> Adicionar
							</Button>
						</div>
						{fieldsMobiliarios.length === 0 && (
							<p className="text-xs text-muted-foreground">Nenhum item adicionado.</p>
						)}
						{fieldsMobiliarios.map((field, index) => (
							<div key={field.id} className="grid grid-cols-[1fr_120px_auto] gap-2 items-start">
								<FormField
									control={form.control}
									name={`mobiliarios.${index}.nome`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Ex: Cadeira" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`mobiliarios.${index}.quantidade`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="number"
													min={1}
													value={field.value ?? 1}
													onChange={(e) => field.onChange(Number(e.target.value || 1))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="button" variant="outline" size="icon" onClick={() => removeMobiliario(index)}>
									<Minus className="size-4" />
								</Button>
							</div>
						))}
					</div>
				)}

				{step === 2 && (
					<div className="space-y-2 rounded-md border p-3">
						<div className="flex items-center justify-between">
							<FormLabel className="m-0">Mídia</FormLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendMidia({ nome: '', quantidade: 1 })}
							>
								<Plus className="size-4" /> Adicionar
							</Button>
						</div>
						{fieldsMidias.length === 0 && (
							<p className="text-xs text-muted-foreground">Nenhum item adicionado.</p>
						)}
						{fieldsMidias.map((field, index) => (
							<div key={field.id} className="grid grid-cols-[1fr_120px_auto] gap-2 items-start">
								<FormField
									control={form.control}
									name={`midias.${index}.nome`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Ex: Projetor" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`midias.${index}.quantidade`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="number"
													min={1}
													value={field.value ?? 1}
													onChange={(e) => field.onChange(Number(e.target.value || 1))}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="button" variant="outline" size="icon" onClick={() => removeMidia(index)}>
									<Minus className="size-4" />
								</Button>
							</div>
						))}
					</div>
				)}

				{step === 3 && (
					<div className="space-y-4">
						{layoutWatch === 'MOVEL' ? (
							<>
								<p className="text-sm text-muted-foreground">
									Envie uma imagem (JPEG, PNG, WebP ou GIF, até 5 MB) mostrando o layout móvel desta sala.
								</p>
								<div className="space-y-2">
									<FormLabel htmlFor="layout-imagem">Arquivo</FormLabel>
									<Input
										id="layout-imagem"
										type="file"
										accept="image/jpeg,image/png,image/webp,image/gif"
										onChange={onFileChange}
									/>
								</div>
								{imagemExistente && !layoutImageFile && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											setRemoveLayoutImage(true);
											setLayoutImageFile(null);
											if (objectPreviewUrl) {
												URL.revokeObjectURL(objectPreviewUrl);
												setObjectPreviewUrl(null);
											}
										}}
									>
										Remover foto atual
									</Button>
								)}
								{previewSrc && !removeLayoutImage && (
									<div className="rounded-md border bg-muted/20 p-2">
										<p className="mb-2 text-xs text-muted-foreground">Pré-visualização</p>
										<img
											src={previewSrc}
											alt="Pré-visualização do layout"
											className="max-h-56 w-full rounded object-contain"
										/>
									</div>
								)}
							</>
						) : (
							<p className="text-sm text-muted-foreground">
								Layout fixo não exige foto do layout. Se alterar para &quot;Móvel&quot; nos dados da sala,
								volte a esta etapa para enviar a imagem.
							</p>
						)}
					</div>
				)}

				<div className="flex flex-wrap items-center justify-between gap-2 border-t pt-4">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Fechar
						</Button>
					</DialogClose>
					<div className="flex flex-wrap gap-2">
						{step > 0 && (
							<Button type="button" variant="outline" onClick={goPrev}>
								<ChevronLeft className="size-4" /> Anterior
							</Button>
						)}
						{step < STEPS.length - 1 && (
							<Button type="button" onClick={() => void goNext()}>
								Próximo <ChevronRight className="size-4" />
							</Button>
						)}
						{step === STEPS.length - 1 && (
							<Button disabled={isPending} type="submit">
								{isUpdating ? (
									<>
										Salvar {isPending && <Loader2 className="ml-2 inline size-4 animate-spin" />}
									</>
								) : (
									<>
										Cadastrar {isPending && <Loader2 className="ml-2 inline size-4 animate-spin" />}
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}
