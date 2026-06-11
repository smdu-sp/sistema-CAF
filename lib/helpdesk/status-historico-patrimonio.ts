import type { Prisma } from "@prisma/client";
import {
  STATUS_ITEM_PATRIMONIO,
  normalizarStatusItem,
  type StatusItemPatrimonio,
} from "./item-patrimonio";

export const STATUS_ALTERAVEIS_VIA_BOTAO = [
  "Manutenção",
  "Estoque",
  "Para Descarte",
  "Descartado",
  "Doado",
] as const satisfies readonly StatusItemPatrimonio[];

export type StatusAlteravelViaBotao = (typeof STATUS_ALTERAVEIS_VIA_BOTAO)[number];

export const FILTROS_STATUS_INVENTARIO = [
  { key: "Todos", label: "Todos" },
  { key: "Ativo", label: "Ativo" },
  { key: "Manutenção", label: "Manutenção" },
  { key: "Estoque", label: "Estoque" },
  { key: "Para Descarte", label: "Sep. p/ Descarte" },
  { key: "Baixado", label: "Baixado" },
  { key: "Descartado", label: "Descartado" },
  { key: "Doado", label: "Doado" },
  { key: "Inativo", label: "Inativo" },
] as const;

export function parseAlteracaoStatusBody(body: Record<string, unknown>): {
  data?: { statusNovo: StatusItemPatrimonio; motivo: string };
  error?: string;
} {
  const statusRaw =
    typeof body.statusitem === "string" ? body.statusitem.trim() : "";
  const motivoRaw = typeof body.motivo === "string" ? body.motivo.trim() : "";

  if (!statusRaw) {
    return { error: "Status de destino é obrigatório" };
  }

  const statusNovo = normalizarStatusItem(statusRaw);
  if (!STATUS_ITEM_PATRIMONIO.includes(statusNovo as StatusItemPatrimonio)) {
    return { error: "Status inválido" };
  }

  if (statusNovo === "Baixado") {
    return {
      error: "Use o fluxo de baixa formal para alterar o status para Baixado",
    };
  }

  if (!motivoRaw) {
    return { error: "Motivo da alteração é obrigatório" };
  }

  if (motivoRaw.length > 2000) {
    return { error: "Motivo: máximo 2000 caracteres" };
  }

  return {
    data: {
      statusNovo: statusNovo as StatusItemPatrimonio,
      motivo: motivoRaw,
    },
  };
}

type Tx = Prisma.TransactionClient;

export async function registrarHistoricoStatusItem(
  tx: Tx,
  params: {
    idItem: number;
    statusAnterior: string;
    statusNovo: string;
    motivo: string;
    idUsuario: string;
  }
) {
  return tx.hdItemPatrimonioStatusHistorico.create({
    data: {
      idItem: params.idItem,
      statusAnterior: params.statusAnterior || null,
      statusNovo: params.statusNovo,
      motivo: params.motivo,
      idUsuario: params.idUsuario,
    },
  });
}

export async function alterarStatusItemPatrimonio(
  tx: Tx,
  params: {
    idItem: number;
    statusAnterior: string;
    statusNovo: StatusItemPatrimonio;
    motivo: string;
    idUsuario: string;
    limparServidor?: boolean;
  }
) {
  await tx.hdItemPatrimonio.update({
    where: { idbem: params.idItem },
    data: {
      statusitem: params.statusNovo,
      ...(params.limparServidor ? { servidorId: null } : {}),
    },
  });

  await registrarHistoricoStatusItem(tx, {
    idItem: params.idItem,
    statusAnterior: params.statusAnterior,
    statusNovo: params.statusNovo,
    motivo: params.motivo,
    idUsuario: params.idUsuario,
  });
}
