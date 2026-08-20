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
  nome: z.string().min(1, 'Nome é obrigatório'),
  sigla: z.string().min(1, 'Sigla é obrigatória').max(20),
  codigoEh: z.string().max(15).optional(),
  parentId: z.string().optional(),
  chefiaId: z.string().optional(),
});

export type UnidadeTtRow = {
  id: string;
  nome: string;
  sigla: string;
  codigoEh: string | null;
  parentId: string | null;
  chefiaId: string | null;
  ativo: boolean;
  parent: { id: string; sigla: string; nome: string } | null;
  chefia: { id: string; nome: string; rf: string } | null;
};

export default function FormUnidadeTt({
  isUpdating,
  unidade,
  unidades,
  servidores,
}: {
  isUpdating: boolean;
  unidade?: Partial<UnidadeTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
  servidores: { id: string; nome: string; rf: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: unidade?.nome ?? '',
      sigla: unidade?.sigla ?? '',
      codigoEh: unidade?.codigoEh ?? '',
      parentId: unidade?.parentId ?? '',
      chefiaId: unidade?.chefiaId ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      nome: values.nome.trim(),
      sigla: values.sigla.trim(),
      codigoEh: values.codigoEh?.trim() || null,
      parentId: values.parentId || null,
      chefiaId: values.chefiaId || null,
    };
    startTransition(async () => {
      try {
        const url = isUpdating && unidade?.id ? `/api/teletrabalho/unidades/${unidade.id}` : '/api/teletrabalho/unidades';
        const res = await fetch(url, {
          method: isUpdating ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error('Erro', { description: data.error });
          return;
        }
        toast.success(isUpdating ? 'Unidade atualizada' : 'Unidade cadastrada');
        window.location.reload();
      } catch {
        toast.error('Falha na comunicação com o servidor');
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="sigla" render={({ field }) => (
          <FormItem>
            <FormLabel>Sigla</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="codigoEh" render={({ field }) => (
          <FormItem>
            <FormLabel>Código EH</FormLabel>
            <FormControl><Input maxLength={15} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="parentId" render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade superior</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="">Nenhuma</option>
                {unidades.filter((u) => u.id !== unidade?.id).map((u) => (
                  <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="chefiaId" render={({ field }) => (
          <FormItem>
            <FormLabel>Chefia responsável</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="">Não definida</option>
                {servidores.map((s) => (
                  <option key={s.id} value={s.id}>{s.nome} ({s.rf})</option>
                ))}
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
