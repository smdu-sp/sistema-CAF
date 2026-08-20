'use client';

import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  unidadeId: z.string().min(1),
  categoriaId: z.string().min(1, 'Categoria é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  cargoId: z.string().optional(),
  pontuacao: z.string().optional(),
});

export type AtividadeTtRow = {
  id: string;
  unidadeId: string;
  categoriaId: string;
  descricao: string;
  ativo: boolean;
  categoria: { id: string; nome: string; ordem: number };
  unidade: { sigla: string };
  cargos: { pontuacao: number; cargo: { id: string; nome: string } }[];
};

export default function FormAtividade({
  isUpdating,
  atividade,
  unidades,
  categorias,
  cargos,
}: {
  isUpdating: boolean;
  atividade?: Partial<AtividadeTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
  categorias: { id: string; nome: string; unidadeId: string }[];
  cargos: { id: string; nome: string; unidadeId: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unidadeId: atividade?.unidadeId ?? unidades[0]?.id ?? '',
      categoriaId: atividade?.categoriaId ?? '',
      descricao: atividade?.descricao ?? '',
      cargoId: '',
      pontuacao: '',
    },
  });
  const unidadeId = form.watch('unidadeId');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const url = isUpdating && atividade?.id ? `/api/teletrabalho/atividades/${atividade.id}` : '/api/teletrabalho/atividades';
      const res = await fetch(url, {
        method: isUpdating ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unidadeId: values.unidadeId, categoriaId: values.categoriaId, descricao: values.descricao }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      if (!isUpdating && values.cargoId && values.pontuacao) {
        await fetch('/api/teletrabalho/cargo-atividades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cargoId: values.cargoId, atividadeId: data.id, pontuacao: Number(values.pontuacao) }),
        });
      }
      toast.success(isUpdating ? 'Atividade atualizada' : 'Atividade cadastrada');
      window.location.reload();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="unidadeId" render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" disabled={isUpdating} {...field}>
                {unidades.map((u) => <option key={u.id} value={u.id}>{u.sigla}</option>)}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="categoriaId" render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="">Selecione</option>
                {categorias.filter((c) => c.unidadeId === unidadeId).map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="descricao" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Textarea rows={4} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        {!isUpdating && (
          <>
            <FormField control={form.control} name="cargoId" render={({ field }) => (
              <FormItem>
                <FormLabel>Associar ao cargo (opcional)</FormLabel>
                <FormControl>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                    <option value="">Depois</option>
                    {cargos.filter((c) => c.unidadeId === unidadeId).map((c) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="pontuacao" render={({ field }) => (
              <FormItem>
                <FormLabel>Pontuação da associação</FormLabel>
                <FormControl><Input type="number" min={0} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </>
        )}
        <div className="flex gap-2 justify-end">
          <DialogClose asChild><Button type="button" variant="outline">Voltar</Button></DialogClose>
          <Button disabled={isPending} type="submit">{isUpdating ? 'Atualizar' : 'Adicionar'} {isPending && <Loader2 className="animate-spin" />}</Button>
        </div>
      </form>
    </Form>
  );
}
