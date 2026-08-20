'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  rf: z.string().min(1, 'RF é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefoneSetor: z.string().optional(),
  unidadeId: z.string().min(1, 'Unidade é obrigatória'),
  cargoId: z.string().min(1, 'Cargo é obrigatório'),
  grupo: z.string(),
});

export type ServidorTtRow = {
  id: string;
  rf: string;
  nome: string;
  email: string;
  telefoneSetor: string | null;
  unidadeId: string;
  cargoId: string;
  ativo: boolean;
  unidade: { id: string; nome: string; sigla: string };
  cargo: { id: string; nome: string };
  escala: { grupo: number } | null;
};

export default function FormServidor({
  isUpdating,
  servidor,
  unidades,
  cargos,
}: {
  isUpdating: boolean;
  servidor?: Partial<ServidorTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
  cargos: { id: string; nome: string; unidadeId: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rf: servidor?.rf ?? '',
      nome: servidor?.nome ?? '',
      email: servidor?.email ?? '',
      telefoneSetor: servidor?.telefoneSetor ?? '',
      unidadeId: servidor?.unidadeId ?? unidades[0]?.id ?? '',
      cargoId: servidor?.cargoId ?? '',
      grupo: String(servidor?.escala?.grupo ?? 1),
    },
  });
  const unidadeId = form.watch('unidadeId');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const url = isUpdating && servidor?.id ? `/api/teletrabalho/servidores/${servidor.id}` : '/api/teletrabalho/servidores';
      const res = await fetch(url, {
        method: isUpdating ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, grupo: Number(values.grupo) }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success(isUpdating ? 'Servidor atualizado' : 'Servidor cadastrado');
      window.location.reload();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="rf" render={({ field }) => (
          <FormItem>
            <FormLabel>RF</FormLabel>
            <FormControl><Input maxLength={7} disabled={isUpdating} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail funcional</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="telefoneSetor" render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone setorial</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="unidadeId" render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                {unidades.map((u) => <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>)}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="cargoId" render={({ field }) => (
          <FormItem>
            <FormLabel>Cargo</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="">Selecione</option>
                {cargos.filter((c) => c.unidadeId === unidadeId).map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="grupo" render={({ field }) => (
          <FormItem>
            <FormLabel>Grupo de escala</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="1">Grupo 1</option>
                <option value="2">Grupo 2</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-2 items-center justify-end">
          <DialogClose asChild><Button type="button" variant="outline">Voltar</Button></DialogClose>
          <Button disabled={isPending} type="submit">
            {isUpdating ? 'Atualizar' : 'Adicionar'} {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
