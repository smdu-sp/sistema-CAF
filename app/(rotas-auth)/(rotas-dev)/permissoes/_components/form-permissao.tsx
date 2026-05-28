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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { PermissaoRow } from './columns';

const formSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório'),
	descricao: z.string().optional(),
	modulo: z.enum(['reserva_salas', 'avaliacao_limpeza']),
});

interface FormPermissaoProps {
	isUpdating: boolean;
	permissao?: Partial<PermissaoRow>;
}

export default function FormPermissao({ isUpdating, permissao }: FormPermissaoProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: permissao?.nome ?? '',
			descricao: permissao?.descricao ?? '',
			modulo: (permissao?.modulo as 'reserva_salas' | 'avaliacao_limpeza') ?? 'reserva_salas',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			try {
				if (isUpdating && permissao?.id) {
					const res = await fetch(`/api/permissoes/${permissao.id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(values),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao atualizar', { description: data.error });
						return;
					}
					toast.success('Permissão atualizada');
				} else {
					const res = await fetch('/api/permissoes', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(values),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao cadastrar', { description: data.error });
						return;
					}
					toast.success('Permissão cadastrada');
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
					name="nome"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder="Ex: reserva_salas.sala.criar" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="modulo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Módulo</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione o módulo" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="reserva_salas">Reserva de Salas</SelectItem>
									<SelectItem value="avaliacao_limpeza">Avaliação de Limpeza</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="descricao"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição</FormLabel>
							<FormControl>
								<Textarea placeholder="Descreva a permissão..." {...field} />
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
							<>Atualizar {isPending && <Loader2 className="animate-spin" />}</>
						) : (
							<>Adicionar {isPending && <Loader2 className="animate-spin" />}</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
