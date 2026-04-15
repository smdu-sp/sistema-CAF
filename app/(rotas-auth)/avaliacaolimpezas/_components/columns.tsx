"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type AvaliacaoRow = {
  id: number;
  mes: number;
  ano: number;
  salaId: number;
  observacao: string | null;
  criadoEm: Date;
  sala: { nome: string } | null;
  avaliacaoCriterios: Array<{
    id: number;
    criterioAvaliacaoId: number;
    nota: "RUIM" | "REGULAR" | "BOM" | "OTIMO";
  }>;
};

const getMediaNota = (notas: string[]) => {
  const valores = notas.map((nota) => {
    switch (nota) {
      case "RUIM":
        return 1;
      case "REGULAR":
        return 2;
      case "BOM":
        return 3;
      case "OTIMO":
        return 4;
      default:
        return 0;
    }
  });
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  return media.toFixed(2);
};

const getVariant = (media: number): "default" | "secondary" | "outline" | "destructive" => {
  if (media >= 3.5) return "default";
  if (media >= 2.5) return "secondary";
  if (media >= 1.5) return "outline";
  return "destructive";
};

export const columns: ColumnDef<AvaliacaoRow>[] = [
  {
    accessorKey: "salaNome",
    header: "Sala",
    cell: ({ row }) => row.original.sala?.nome ?? "—",
  },
  {
    accessorKey: "mesAno",
    header: "Período",
    cell: ({ row }) => {
      const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
      return `${meses[row.original.mes - 1]} / ${row.original.ano}`;
    },
  },
  {
    accessorKey: "media",
    header: "Média",
    cell: ({ row }) => {
      const notas = row.original.avaliacaoCriterios.map((ac) => ac.nota);
      const media = parseFloat(getMediaNota(notas));
      const variant = getVariant(media);
      return (
        <div className="flex items-center justify-center">
          <Badge variant={variant}>{getMediaNota(notas)}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "observacao",
    header: "Observação",
    cell: ({ row }) => {
      const obs = row.original.observacao;
      if (!obs) return "—";
      return obs.length > 50 ? obs.substring(0, 50) + "..." : obs;
    },
  },
  {
    accessorKey: "criadoEm",
    header: "Criado em",
    cell: ({ row }) => new Date(row.original.criadoEm).toLocaleDateString("pt-BR"),
  },
];
