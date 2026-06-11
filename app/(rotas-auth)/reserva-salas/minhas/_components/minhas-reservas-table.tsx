"use client";

import DataTable from "@/components/data-table";
import { columns } from "./columns";
import type { ReservaRow } from "./columns";
import { useSearchParams } from "next/navigation";

/** Dados recebidos do servidor (datas podem vir como string após serialização). */
type ReservaInput = {
  id: string;
  salaNome: string;
  coordenadoriaNome: string | null;
  inicio: string | Date;
  fim: string | Date;
  titulo: string | null;
  layoutEscolhidoDescricao?: string | null;

  status: ReservaRow["status"];
};

function toRow(r: ReservaInput): ReservaRow {
  return {
    id: r.id,
    salaNome: r.salaNome,
    coordenadoriaNome: r.coordenadoriaNome,

    inicio: typeof r.inicio === "string" ? r.inicio : r.inicio.toISOString(),

    fim: typeof r.fim === "string" ? r.fim : r.fim.toISOString(),

    titulo: r.titulo,
    layoutEscolhidoDescricao: r.layoutEscolhidoDescricao ?? null,
    status: r.status,
  };
}

interface MinhasReservasTableProps {
  reservas: ReservaInput[];

  totalItens: number;
}

export function MinhasReservasTable({
  reservas,
  totalItens,
}: MinhasReservasTableProps) {
  const searchParams = useSearchParams();

  const pagina = Number(searchParams.get("pagina")) || 1;

  const limite = Number(searchParams.get("limite")) || 10;

  const rows = reservas.map(toRow);

  return (
    <DataTable
      columns={columns}
      data={rows}
      paginaAtual={pagina}
      limitePorPagina={limite}
      totalItens={totalItens}
      labelItemSingular="reserva"
      labelItemPlural="reservas"
    />
  );
}
