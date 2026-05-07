"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { formatarData } from "@/lib/utils";

export type AvaliacaoRow = {
  id: number;
  mes: number;
  ano: number;
  salaId: number;
  observacao: string | null;
  criadoEm: Date;
  sala: { nome: string } | null;
  avaliador?: { nome: string } | null;
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
        return 2.5;
      case "REGULAR":
        return 5;
      case "BOM":
        return 7.5;
      case "OTIMO":
        return 10;
      default:
        return 0;
    }
  });
  const media = valores.reduce((a: number, b: number) => a + b, 0) / valores.length;
  return media.toFixed(2);
};

const getVariant = (media: number): "default" | "secondary" | "outline" | "destructive" => {
  if (media >= 8.5) return "default";
  if (media >= 6) return "secondary";
  if (media >= 3.5) return "outline";
  return "destructive";
};



export const columns: ColumnDef<AvaliacaoRow>[] = [
  {
    accessorKey: "media",
    header: "Avaliação",
    cell: ({ row }) => {
      const notas = row.original.avaliacaoCriterios.map((ac) => ac.nota);
      const media = parseFloat(getMediaNota(notas));
      const variant = getVariant(media);
      return (
        <div className="flex gap-2">
          <Badge variant={variant} className="text-xs">
            {getMediaNota(notas)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "salaNome",
    header: "Sala",
    cell: ({ row }) => {
      const sala = row.original.sala?.nome ?? "—";
      return (
        <div className="flex flex-col whitespace-nowrap">
          <span className="font-medium text-sm">{sala}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "mesAno",
    header: "Período",
    cell: ({ row }) => {
      return <div className="text-xs sm:text-sm whitespace-nowrap">{formatarData(new Date(row.original.ano, row.original.mes - 1), "mes-ano")}</div>;
    },
  },

  {
    accessorKey: "observacao",
    header: "Observação",
    cell: ({ row }) => {
      const obs = row.original.observacao;
      if (!obs) return <span className="text-muted-foreground">—</span>;
      const truncated = obs.length > 40 ? obs.substring(0, 40) + "..." : obs;
      return (
        <div className="text-xs sm:text-sm max-w-xs truncate" title={obs}>
          {truncated}
        </div>
      );
    },
  },
  {
    accessorKey: "criadoEm",
    header: "Criado em",
    cell: ({ row }) => {
      return <div className="text-xs sm:text-sm whitespace-nowrap">{formatarData(new Date(row.original.criadoEm))}</div>;
    },
  },
];
