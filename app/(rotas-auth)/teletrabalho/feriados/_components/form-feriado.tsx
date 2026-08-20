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
  data: z.string().min(1, 'Data é obrigatória'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.enum(['nacional', 'municipal', 'ponto_facultativo']),
});

export type FeriadoRow = {
  id: string;
  data: Date | string;
  nome: string;
  tipo: 'nacional' | 'municipal' | 'ponto_facultativo';
  ativo: boolean;
};

export default function FormFeriado({ isUpdating, feriado }: { isUpdating: boolean; feriado?: Partial<FeriadoRow> }) {
  const [isPending, startTransition] = useTransition();
  const dataIso = feriado?.data ? String(feriado.data).slice(0, 10) : '';
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { data: dataIso, nome: feriado?.nome ?? '', tipo: feriado?.tipo ?? 'nacional' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const url = isUpdating && feriado?.id ? `/api/teletrabalho/feriados/${feriado.id}` : '/api/teletrabalho/feriados';
      const res = await fetch(url, {
        method: isUpdating ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success(isUpdating ? 'Feriado atualizado' : 'Feriado cadastrado');
      window.location.reload();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isUpdating && (
          <FormField control={form.control} name="data" render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="tipo" render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="nacional">Nacional</option>
                <option value="municipal">Municipal</option>
                <option value="ponto_facultativo">Ponto facultativo</option>
              </select>
            </FormControl>
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
