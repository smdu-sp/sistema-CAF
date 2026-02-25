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
	nome: z.string().min(1, 'Nome da sala é obrigatório'),
	andar: z.string().optional(),
	localizacao: z.string().optional(),
});

export type SalaRow = {
	id: string;
	nome: string;
	andar: string | null;
	localizacao: string | null;
	ativo: boolean;
};

interface FormSalaProps {
	isUpdating: boolean;
	sala?: Partial<SalaRow>;
}

export default function FormSala({ isUpdating, sala }: FormSalaProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: sala?.nome ?? '',
			andar: sala?.andar ?? '',
			localizacao: sala?.localizacao ?? '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			try {
				const payload = {
					nome: values.nome.trim(),
					andar: values.andar?.trim() || null,
					localizacao: values.localizacao?.trim() || null,
				};
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
					toast.success('Sala cadastrada');
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
							<FormLabel>Nome da sala</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Sala de Reuniões 1" {...field} />
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
					name="localizacao"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Localização (opcional)</FormLabel>
							<FormControl>
								<Input placeholder="Ex: Bloco A, Ala Norte" {...field} />
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
