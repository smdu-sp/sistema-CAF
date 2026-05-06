"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { AvaliacaoRow } from "./columns";

// Dados mockados
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

interface FormAvaliacaoProps {
  isUpdating: boolean;
  avaliacao?: Partial<AvaliacaoRow>;
}

export default function FormAvaliacao({ isUpdating, avaliacao }: FormAvaliacaoProps) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = useForm({
    defaultValues: {
      salaId: String(avaliacao?.salaId ?? ""),
      mes: String(avaliacao?.mes ?? new Date().getMonth() + 1),
      ano: String(avaliacao?.ano ?? new Date().getFullYear()),
      observacao: avaliacao?.observacao ?? "",
      criterios: mockCriterios.map((c) => ({
        criterioId: c.id,
        nota: avaliacao?.avaliacaoCriterios?.find((ac) => ac.criterioAvaliacaoId === c.id)?.nota || "BOM",
      })),
    },
  });

  function onSubmit(values: any) {
    // Limpar erros anteriores
    const newErrors: Record<string, string> = {};

    // Validação: Sala é obrigatória
    if (!values.salaId || values.salaId === "") {
      newErrors.salaId = "Selecione uma sala";
    }

    // Validação: Mês é obrigatório
    if (!values.mes || values.mes === "") {
      newErrors.mes = "Selecione um mês";
    }

    // Validação: Ano é obrigatório
    if (!values.ano || values.ano === "") {
      newErrors.ano = "Insira um ano";
    } else {
      const ano = parseInt(values.ano, 10);
      if (isNaN(ano) || ano < 2000 || ano > new Date().getFullYear() + 1) {
        newErrors.ano = `Ano deve estar entre 2000 e ${new Date().getFullYear() + 1}`;
      }
    }

    // Validação: Observação é obrigatória
    if (!values.observacao || values.observacao.trim() === "") {
      newErrors.observacao = "Insira uma observação";
    }

    // Validação: Critérios são obrigatórios
    if (!values.criterios || values.criterios.length === 0) {
      newErrors.criterios = "Selecione notas para todos os critérios";
    } else {
      const todosCriteriosPreenchidos = values.criterios.every((c: any) => c.nota && c.nota !== "");
      if (!todosCriteriosPreenchidos) {
        newErrors.criterios = "Todos os critérios devem ter uma nota selecionada";
      }
    }

    // Se houver erros, mostrar e retornar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Limpar erros se tudo OK
    setErrors({});

    const salaId = parseInt(values.salaId, 10);
    const mes = parseInt(values.mes, 10);
    const ano = parseInt(values.ano, 10);

    const payload = {
      salaId,
      mes,
      ano,
      observacao: values.observacao,
      criterios: values.criterios.map((c: any) => ({
        criterioId: c.criterioId,
        nota: c.nota,
      })),
    };

    startTransition(() => {
      setTimeout(() => {
        console.log("Avaliação para enviar:", payload);
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
              <FormLabel>Sala <span className="text-red-500">*</span></FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={errors.salaId ? "border-red-500" : ""}>
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
              {errors.salaId && (
                <p className="text-red-500 text-sm mt-1">{errors.salaId}</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mês <span className="text-red-500">*</span></FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className={errors.mes ? "border-red-500" : ""}>
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
              {errors.mes && (
                <p className="text-red-500 text-sm mt-1">{errors.mes}</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ano"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2024"
                  {...field}
                  className={errors.ano ? "border-red-500" : ""}
                />
              </FormControl>
              {errors.ano && (
                <p className="text-red-500 text-sm mt-1">{errors.ano}</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  placeholder="Observações sobre a avaliação"
                  {...field}
                  className={errors.observacao ? "border-red-500" : ""}
                />
              </FormControl>
              {errors.observacao && (
                <p className="text-red-500 text-sm mt-1">{errors.observacao}</p>
              )}
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Critérios de Avaliação <span className="text-red-500">*</span></FormLabel>
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
                      <SelectTrigger className={`h-8 ${errors.criterios ? "border-red-500" : ""}`}>
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
                </FormItem>
              )}
            />
          ))}
          {errors.criterios && (
            <p className="text-red-500 text-sm mt-1">{errors.criterios}</p>
          )}
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
