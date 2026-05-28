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
	nome: z.string().min(1, 'Nome é obrigatório'),
});

export type CoordenadoriaRow = {
	id: string;
	nome: string;
	ativo: boolean;
};

interface FormCoordenadoriaProps {
	isUpdating: boolean;
	coordenadoria?: Partial<CoordenadoriaRow>;
}

export default function FormCoordenadoria({
	isUpdating,
	coordenadoria,
}: FormCoordenadoriaProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nome: coordenadoria?.nome ?? '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		startTransition(async () => {
			try {
				if (isUpdating && coordenadoria?.id) {
					const res = await fetch(`/api/coordenadorias/${coordenadoria.id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ nome: values.nome.trim() }),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao atualizar', { description: data.error });
						return;
					}
					toast.success('Coordenadoria atualizada');
				} else {
					const res = await fetch('/api/coordenadorias', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ nome: values.nome.trim() }),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error('Erro ao cadastrar', { description: data.error });
						return;
					}
					toast.success('Coordenadoria cadastrada');
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
								<Input
									placeholder="Ex: Coordenadoria de TI"
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
