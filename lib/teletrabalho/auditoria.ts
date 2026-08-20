import { prisma } from "@/lib/prisma";
import type { TtAuditAcao } from "@/prisma/generated";

export async function registrarAuditoria(params: {
  entidade: string;
  entidadeId: string;
  acao: TtAuditAcao;
  atorId?: string | null;
  estadoAnterior?: unknown;
}) {
  await prisma.ttAuditLog.create({
    data: {
      entidade: params.entidade,
      entidadeId: params.entidadeId,
      acao: params.acao,
      atorId: params.atorId ?? null,
      estadoAnterior:
        params.estadoAnterior === undefined
          ? null
          : JSON.stringify(params.estadoAnterior),
    },
  });
}
