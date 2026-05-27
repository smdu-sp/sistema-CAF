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
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	codigo: z
		.string()
		.min(1, 'Código é obrigatório')
		.max(20, 'Máximo 20 caracteres'),
	nome: z.string().min(1, 'Nome é obrigatório'),
	sala: z.string().max(120, 'Máximo 120 caracteres').optional(),
});

export type UnidadeRow = {
	id: string;
	codigo: string;
	nome: string;
	raiz: string;
	sigla: string;
	sala: string | null;
	ativo: boolean;
};

interface FormUnidadeProps {
	isUpdating: boolean;
	unidade?: Partial<UnidadeRow>;
}

export default function FormUnidade({ isUpdating, unidade }: FormUnidadeProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			codigo: unidade?.codigo ?? '',
			nome: unidade?.nome ?? '',
			sala: unidade?.sala ?? '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload = {
			codigo: values.codigo.trim().toUpperCase(),
			nome: values.nome.trim(),
			sala: values.sala?.trim() || null,
		};

		startTransition(async () => {
			try {
				if (isUpdating && unidade?.id) {
					const res = await fetch(`/api/helpdesk/unidades/${unidade.id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao atualizar', { description: data.error });
						return;
					}
					toast.success('Unidade atualizada');
				} else {
					const res = await fetch('/api/helpdesk/unidades', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao cadastrar', { description: data.error });
						return;
					}
					toast.success('Unidade cadastrada');
				}
				window.location.reload();
			} catch {
				toast.error('Falha na comunicação com o servidor');
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="codigo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Código</FormLabel>
							<FormControl>
								<Input placeholder="Ex: UND-051" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome completo</FormLabel>
							<FormControl>
								<Input
									placeholder="Ex: CAF > DGP ou apenas CAF"
									{...field}
								/>
							</FormControl>
							<p className="text-xs text-muted-foreground">
								Use &quot; &gt; &quot; para sub-unidades. Raiz e sigla são geradas automaticamente.
							</p>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="sala"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Sala</FormLabel>
							<FormControl>
								<Input
									placeholder="Ex: Sala 12 (opcional)"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-2 items-center justify-end">
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
