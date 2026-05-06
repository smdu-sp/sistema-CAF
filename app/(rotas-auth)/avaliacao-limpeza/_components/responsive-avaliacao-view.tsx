"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/data-table";
import { columns } from "./columns";

export interface AvaliacaoData {
  id: number;
  mes: number;
  ano: number;
  salaId: number;
  avaliadoPor?: string;
  observacao: string | null;
  criadoEm: Date;
  sala: { nome: string } | null;
  avaliador?: { nome: string } | null;
  avaliacaoCriterios: Array<{
    id: number;
    criterioAvaliacaoId: number;
    nota: "RUIM" | "REGULAR" | "BOM" | "OTIMO";
  }>;
}

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

interface ResponsiveAvaliacaoViewProps {
  data: AvaliacaoData[];
  loading?: boolean;
}

export default function ResponsiveAvaliacaoView({ data, loading = false }: ResponsiveAvaliacaoViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Carregando avaliações...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View - Hidden em mobile */}
      <div className="hidden md:block w-full">
        <DataTable columns={columns} data={data} />
      </div>

      {/* Mobile View - Hidden em desktop */}
      <div className="md:hidden w-full space-y-4">
        {data.map((avaliacao) => {
          const notas = avaliacao.avaliacaoCriterios.map((ac) => ac.nota);
          const media = parseFloat(getMediaNota(notas));
          const variant = getVariant(media);
          const mensagem = getMensagemMedia(media);
          const avaliador = avaliacao.avaliador?.nome ?? avaliacao.avaliadoPor ?? "—";
          const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
          const data_criacao = new Date(avaliacao.criadoEm);
          const formatoBr = data_criacao.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          });

          return (
            <Card key={avaliacao.id} className="p-4 border border-border">
              {/* Header com Sala */}
              <div className="mb-3 pb-3 border-b border-border/50">
                <h3 className="font-semibold text-base text-foreground">{avaliacao.sala?.nome ?? "—"}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {meses[avaliacao.mes - 1]} / {avaliacao.ano}
                </p>
              </div>

              {/* Avaliação */}
              <div className="mb-3 pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Avaliação</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={variant} className="text-xs">
                      {getMediaNota(notas)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{mensagem}</span>
                  </div>
                </div>
              </div>

              {/* Avaliador */}
              <div className="mb-3 pb-3 border-b border-border/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">Avaliador</p>
                <p className="text-sm text-foreground">{avaliador}</p>
              </div>

              {/* Observação */}
              <div className="mb-3 pb-3 border-b border-border/50">
                <p className="text-xs text-muted-foreground font-medium mb-1">Observação</p>
                <p className="text-sm text-foreground line-clamp-2">{avaliacao.observacao ?? "—"}</p>
              </div>

              {/* Data */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Criado em</p>
                <p className="text-sm text-foreground">{formatoBr}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
