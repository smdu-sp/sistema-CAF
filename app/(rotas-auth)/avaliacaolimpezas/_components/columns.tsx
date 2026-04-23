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
  const media = valores.reduce((a: number, b: number) => a + b, 0) / valores.length;
  return media.toFixed(2);
};

const getVariant = (media: number): "default" | "secondary" | "outline" | "destructive" => {
  if (media >= 3.5) return "default";
  if (media >= 2.5) return "secondary";
  if (media >= 1.5) return "outline";
  return "destructive";
};

const getMensagemMedia = (media: number) => {
  if (media >= 3.5) return "Excelente";
  if (media >= 2.5) return "Bom";
  if (media >= 1.5) return "Regular";
  return "Ruim";
};

export const columns: ColumnDef<AvaliacaoRow>[] = [
  {
    accessorKey: "salaNome",
    header: "Sala",
    cell: ({ row }) => {
      const sala = row.original.sala?.nome ?? "—";
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{sala}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "mesAno",
    header: "Período",
    cell: ({ row }) => {
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      return (
        <div className="text-sm">
          {meses[row.original.mes - 1]} / {row.original.ano}
        </div>
      );
    },
  },
  {
    accessorKey: "media",
    header: "Avaliação",
    cell: ({ row }) => {
      const notas = row.original.avaliacaoCriterios.map((ac) => ac.nota);
      const media = parseFloat(getMediaNota(notas));
      const variant = getVariant(media);
      const mensagem = getMensagemMedia(media);
      return (
        <div className="flex items-center justify-center gap-2">
          <Badge variant={variant} className="text-xs">
            {getMediaNota(notas)}
          </Badge>
          <span className="text-xs hidden sm:inline text-muted-foreground">
            {mensagem}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "observacao",
    header: "Observação",
    cell: ({ row }) => {
      const obs = row.original.observacao;
      if (!obs) return <span className="text-muted-foreground">—</span>;
      const truncated =
        obs.length > 40 ? obs.substring(0, 40) + "..." : obs;
      return (
        <div
          className="text-xs sm:text-sm max-w-xs truncate"
          title={obs}
        >
          {truncated}
        </div>
      );
    },
  },
  {
    accessorKey: "criadoEm",
    header: "Criado em",
    cell: ({ row }) => {
      const data = new Date(row.original.criadoEm);
      const formatoBr = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      return <span className="text-xs sm:text-sm whitespace-nowrap">{formatoBr}</span>;
    },
  },
];
