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
  unidadeId: z.string().min(1, 'Unidade é obrigatória'),
});

export type CargoTtRow = {
  id: string;
  nome: string;
  unidadeId: string;
  ativo: boolean;
  unidade: { sigla: string; nome: string };
};

export default function FormCargo({
  isUpdating,
  cargo,
  unidades,
}: {
  isUpdating: boolean;
  cargo?: Partial<CargoTtRow>;
  unidades: { id: string; sigla: string; nome: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: cargo?.nome ?? '', unidadeId: cargo?.unidadeId ?? unidades[0]?.id ?? '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const url = isUpdating && cargo?.id ? `/api/teletrabalho/cargos/${cargo.id}` : '/api/teletrabalho/cargos';
      const res = await fetch(url, {
        method: isUpdating ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success(isUpdating ? 'Cargo atualizado' : 'Cargo cadastrado');
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
                {unidades.map((u) => <option key={u.id} value={u.id}>{u.sigla} — {u.nome}</option>)}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do cargo</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-2 justify-end">
          <DialogClose asChild><Button type="button" variant="outline">Voltar</Button></DialogClose>
          <Button disabled={isPending} type="submit">{isUpdating ? 'Atualizar' : 'Adicionar'} {isPending && <Loader2 className="animate-spin" />}</Button>
        </div>
      </form>
    </Form>
  );
}
