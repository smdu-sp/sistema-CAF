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
  servidorId: z.string().min(1, 'Servidor é obrigatório'),
  dataAssinatura: z.string().min(1, 'Data de assinatura é obrigatória'),
  dataCienciaChefia: z.string().optional(),
  situacao: z.enum(['pendente', 'vigente', 'encerrado']),
});

export type AdesaoRow = {
  id: string;
  servidorId: string;
  dataAssinatura: Date | string;
  dataCienciaChefia: Date | string | null;
  situacao: 'pendente' | 'vigente' | 'encerrado';
  servidor: { id: string; nome: string; rf: string; unidade: { sigla: string } };
};

export default function FormAdesao({
  isUpdating,
  adesao,
  servidores,
}: {
  isUpdating: boolean;
  adesao?: Partial<AdesaoRow>;
  servidores: { id: string; nome: string; rf: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      servidorId: adesao?.servidorId ?? '',
      dataAssinatura: adesao?.dataAssinatura ? String(adesao.dataAssinatura).slice(0, 10) : '',
      dataCienciaChefia: adesao?.dataCienciaChefia ? String(adesao.dataCienciaChefia).slice(0, 10) : '',
      situacao: adesao?.situacao ?? 'pendente',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const url = isUpdating && adesao?.id ? `/api/teletrabalho/adesoes/${adesao.id}` : '/api/teletrabalho/adesoes';
      const res = await fetch(url, {
        method: isUpdating ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) { toast.error('Erro', { description: data.error }); return; }
      toast.success(isUpdating ? 'Termo atualizado' : 'Termo cadastrado');
      window.location.reload();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="servidorId" render={({ field }) => (
          <FormItem>
            <FormLabel>Servidor</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" disabled={isUpdating} {...field}>
                <option value="">Selecione</option>
                {servidores.map((s) => <option key={s.id} value={s.id}>{s.nome} ({s.rf})</option>)}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="dataAssinatura" render={({ field }) => (
          <FormItem>
            <FormLabel>Data de assinatura</FormLabel>
            <FormControl><Input type="date" disabled={isUpdating} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="dataCienciaChefia" render={({ field }) => (
          <FormItem>
            <FormLabel>Ciência da chefia</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="situacao" render={({ field }) => (
          <FormItem>
            <FormLabel>Situação</FormLabel>
            <FormControl>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" {...field}>
                <option value="pendente">Pendente</option>
                <option value="vigente">Vigente</option>
                <option value="encerrado">Encerrado</option>
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
