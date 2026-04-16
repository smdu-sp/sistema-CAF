"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Layout } from "@prisma/client";

const formSchema = z.object({
  nome: z.string().min(1, "Nome da sala é obrigatório"),
  andar: z.string().optional(),
  numero: z.string().optional(),
  lotacao: z.number().int().positive().optional(),
  layout: z.string().optional(),
});

export type SalaRow = {
  id: string;
  nome: string;
  andar: string | null;
  numero: string | null;
  lotacao: number | null;
  layout: Layout | null;
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
      nome: sala?.nome ?? "",
      andar: sala?.andar ?? "",
      numero: sala?.numero ?? "",
      lotacao: sala?.lotacao ?? undefined,
      layout: sala?.layout ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const payload = {
          nome: values.nome.trim(),
          andar: values.andar?.trim() || null,
          numero: values.numero?.trim() || null,
          lotacao: values.lotacao ?? null,
          layout: values.layout?.trim() || null,
        };
        if (isUpdating && sala?.id) {
          const res = await fetch(`/api/salas/${sala.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error("Erro ao atualizar", { description: data.error });
            return;
          }
          toast.success("Sala atualizada");
        } else {
          const res = await fetch("/api/salas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error("Erro ao cadastrar", { description: data.error });
            return;
          }
          toast.success("Sala cadastrada");
        }
        window.location.reload();
      } catch {
        toast.error("Falha na comunicação com o servidor");
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
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da sala (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 182-A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lotacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lotação (opcional)</FormLabel>
              <FormControl>
                <Input type="number" min={1} placeholder="Ex: 12" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="layout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Layout (opcional)</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                >
                  <option value="">Selecione</option>
                  <option value="FIXO">Fixo</option>
                  <option value="MOVEL">Móvel</option>
                </select>
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
            {isUpdating ? <>Atualizar {isPending && <Loader2 className="animate-spin" />}</> : <>Adicionar {isPending && <Loader2 className="animate-spin" />}</>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
