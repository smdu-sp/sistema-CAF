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
import {
	STATUS_REDE,
	STATUS_REDE_META,
	TIPOS_EQUIPAMENTO,
	TIPO_EQUIPAMENTO_LABEL,
} from '@/lib/inventario/equipamento';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { EquipamentoRow, UnidadeRef, UsuarioRef } from './tipos';

const NENHUM = '__nenhum__';

const formSchema = z.object({
	tipo: z.enum(TIPOS_EQUIPAMENTO),
	statusRede: z.enum(STATUS_REDE),
	hostname: z.string().max(200).optional(),
	nome: z.string().max(200).optional(),
	ip: z.string().max(45).optional(),
	mac: z.string().max(20).optional(),
	fabricante: z.string().max(150).optional(),
	modelo: z.string().max(200).optional(),
	numserie: z.string().max(200).optional(),
	unidadeId: z.string().optional(),
	servidorId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormEquipamentoProps {
	isUpdating: boolean;
	equipamento?: Partial<EquipamentoRow>;
	unidades: UnidadeRef[];
	usuarios: UsuarioRef[];
}

export default function FormEquipamento({
	isUpdating,
	equipamento,
	unidades,
	usuarios,
}: FormEquipamentoProps) {
	const [isPending, startTransition] = useTransition();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tipo: equipamento?.tipo ?? 'desktop',
			statusRede: equipamento?.statusRede ?? 'nunca_visto',
			hostname: equipamento?.hostname ?? '',
			nome: equipamento?.nome ?? '',
			ip: equipamento?.ip ?? '',
			mac: equipamento?.mac ?? '',
			fabricante: equipamento?.fabricante ?? '',
			modelo: equipamento?.modelo ?? '',
			numserie: equipamento?.numserie ?? '',
			unidadeId: equipamento?.unidadeId ?? NENHUM,
			servidorId: equipamento?.servidorId ?? NENHUM,
		},
	});

	async function onSubmit(values: FormValues) {
		const payload = {
			tipo: values.tipo,
			statusRede: values.statusRede,
			hostname: values.hostname?.trim() || null,
			nome: values.nome?.trim() || null,
			ip: values.ip?.trim() || null,
			mac: values.mac?.trim() || null,
			fabricante: values.fabricante?.trim() || null,
			modelo: values.modelo?.trim() || null,
			numserie: values.numserie?.trim() || null,
			unidadeId: values.unidadeId === NENHUM ? null : values.unidadeId,
			servidorId: values.servidorId === NENHUM ? null : values.servidorId,
		};

		startTransition(async () => {
			try {
				const url = isUpdating
					? `/api/inventario/equipamentos/${equipamento?.id}`
					: '/api/inventario/equipamentos';
				const res = await fetch(url, {
					method: isUpdating ? 'PATCH' : 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
				const data = await res.json();
				if (!res.ok) {
					toast.error(isUpdating ? 'Erro ao atualizar' : 'Erro ao cadastrar', {
						description: data.error,
					});
					return;
				}
				toast.success(isUpdating ? 'Equipamento atualizado' : 'Equipamento cadastrado');
				window.location.reload();
			} catch {
				toast.error('Falha na comunicação com o servidor');
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="tipo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{TIPOS_EQUIPAMENTO.map((t) => (
											<SelectItem key={t} value={t}>
												{TIPO_EQUIPAMENTO_LABEL[t]}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="statusRede"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status de rede</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{STATUS_REDE.map((s) => (
											<SelectItem key={s} value={s}>
												{STATUS_REDE_META[s].label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="hostname"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Hostname</FormLabel>
								<FormControl>
									<Input placeholder="Ex: PC-DGP-012" {...field} />
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
								<FormLabel>Nome / apelido</FormLabel>
								<FormControl>
									<Input placeholder="Opcional" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="ip"
						render={({ field }) => (
							<FormItem>
								<FormLabel>IP</FormLabel>
								<FormControl>
									<Input placeholder="Ex: 10.75.32.10" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="mac"
						render={({ field }) => (
							<FormItem>
								<FormLabel>MAC</FormLabel>
								<FormControl>
									<Input placeholder="Ex: 00:1A:2B:..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="fabricante"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Fabricante</FormLabel>
								<FormControl>
									<Input placeholder="Ex: Dell" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="modelo"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Modelo</FormLabel>
								<FormControl>
									<Input placeholder="Ex: OptiPlex 7090" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="numserie"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número de série</FormLabel>
							<FormControl>
								<Input placeholder="Opcional" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-3">
					<FormField
						control={form.control}
						name="unidadeId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Unidade</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value={NENHUM}>— Nenhuma —</SelectItem>
										{unidades.map((u) => (
											<SelectItem key={u.id} value={u.id}>
												{u.nome}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="servidorId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Responsável</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Selecione" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value={NENHUM}>— Nenhum —</SelectItem>
										{usuarios.map((u) => (
											<SelectItem key={u.id} value={u.id}>
												{u.nome}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex gap-2 items-center justify-end">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Voltar
						</Button>
					</DialogClose>
					<Button disabled={isPending} type="submit">
						{isUpdating ? 'Atualizar' : 'Adicionar'}
						{isPending && <Loader2 className="animate-spin" />}
					</Button>
				</div>
			</form>
		</Form>
	);
}
