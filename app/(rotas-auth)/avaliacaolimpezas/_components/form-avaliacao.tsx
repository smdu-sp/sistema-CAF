"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { AvaliacaoRow } from "./columns";

// Dados mockados (sem requisições)
const mockSalas = [
  { id: 1, nome: "Sala de Reuniões A" },
  { id: 2, nome: "Sala de Reuniões B" },
  { id: 3, nome: "Auditório Principal" },
  { id: 4, nome: "Sala de Treinamento" },
];

const mockCriterios = [
  { id: 1, nome: "Limpeza de Pisos" },
  { id: 2, nome: "Limpeza de Móveis" },
  { id: 3, nome: "Organização Geral" },
];

const formSchema = z.object({
  salaId: z.coerce.number().int().positive("Sala é obrigatória"),
  mes: z.coerce.number().int().min(1).max(12, "Mês inválido"),
  ano: z.coerce.number().int().min(2000),
  observacao: z.string().optional(),
  criterios: z
    .array(
      z.object({
        criterioId: z.coerce.number().int(),
        nota: z.enum(["RUIM", "REGULAR", "BOM", "OTIMO"], {
          errorMap: () => ({ message: "Nota inválida" }),
        }),
      }),
    )
    .min(1, "Avalie pelo menos um critério"),
});

interface FormAvaliacaoProps {
  isUpdating: boolean;
  avaliacao?: Partial<AvaliacaoRow>;
}

export default function FormAvaliacao({ isUpdating, avaliacao }: FormAvaliacaoProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salaId: avaliacao?.salaId ?? 0,
      mes: avaliacao?.mes ?? new Date().getMonth() + 1,
      ano: avaliacao?.ano ?? new Date().getFullYear(),
      observacao: avaliacao?.observacao ?? "",
      criterios:
        avaliacao?.avaliacaoCriterios?.map((ac) => ({
          criterioId: ac.criterioAvaliacaoId,
          nota: ac.nota,
        })) ??
        mockCriterios.map((c) => ({
          criterioId: c.id,
          nota: "BOM" as const,
        })),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      // Simula o processamento
      setTimeout(() => {
        toast.success(isUpdating ? "Avaliação atualizada!" : "Avaliação cadastrada!");
        form.reset();
      }, 1000);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="salaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala</FormLabel>
              <Select value={String(field.value)} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockSalas.map((sala) => (
                    <SelectItem key={sala.id} value={String(sala.id)}>
                      {sala.nome}
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
          name="mes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mês</FormLabel>
              <Select value={String(field.value)} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map((mes, idx) => (
                    <SelectItem key={idx} value={String(idx + 1)}>
                      {mes}
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
          name="ano"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Observações sobre a avaliação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Critérios de Avaliação</FormLabel>
          {mockCriterios.map((criterio, idx) => (
            <FormField
              key={criterio.id}
              control={form.control}
              name={`criterios.${idx}.nota`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{criterio.nome}</FormLabel>
                  <Select value={field.value || "BOM"} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RUIM">Ruim</SelectItem>
                      <SelectItem value="REGULAR">Regular</SelectItem>
                      <SelectItem value="BOM">Bom</SelectItem>
                      <SelectItem value="OTIMO">Ótimo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdating ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
