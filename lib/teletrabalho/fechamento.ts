import { prisma } from "@/lib/prisma";
import { registrarAuditoria } from "./auditoria";
import { partesData } from "./datas";
import type { AcessoTeletrabalho } from "./permissoes";
import { podeValidarUnidade } from "./permissoes";

export async function fecharCompetencia(params: {
  unidadeId: string;
  ano: number;
  mes: number;
  acesso: AcessoTeletrabalho;
  atorId: string;
}) {
  if (!podeValidarUnidade(params.acesso, params.unidadeId) && !params.acesso.acessoTotal && !params.acesso.ehCafDgp) {
    throw new Error("Sem permissão para fechar esta competência.");
  }

  const inicio = new Date(Date.UTC(params.ano, params.mes - 1, 1));
  const fim = new Date(Date.UTC(params.ano, params.mes, 0));

  const pendentes = await prisma.ttRegistroDiario.count({
    where: {
      unidadeId: params.unidadeId,
      excluidoEm: null,
      data: { gte: inicio, lte: fim },
      estado: { in: ["RASCUNHO", "ENVIADO", "DEVOLVIDO"] },
    },
  });
  if (pendentes > 0) {
    throw new Error("Há registros em rascunho, enviados ou devolvidos nesta competência.");
  }

  const fechamento = await prisma.ttFechamentoMensal.upsert({
    where: {
      unidadeId_ano_mes: {
        unidadeId: params.unidadeId,
        ano: params.ano,
        mes: params.mes,
      },
    },
    create: {
      unidadeId: params.unidadeId,
      ano: params.ano,
      mes: params.mes,
      situacao: "fechado",
      fechadoEm: new Date(),
      fechadoPorId: params.atorId,
    },
    update: {
      situacao: "fechado",
      fechadoEm: new Date(),
      fechadoPorId: params.atorId,
      reabertoEm: null,
      reabertoPorId: null,
      justificativaReabertura: null,
    },
  });

  await registrarAuditoria({
    entidade: "TtFechamentoMensal",
    entidadeId: fechamento.id,
    acao: "fechar",
    atorId: params.atorId,
    estadoAnterior: { ano: params.ano, mes: params.mes },
  });

  return fechamento;
}

export async function reabrirCompetencia(params: {
  unidadeId: string;
  ano: number;
  mes: number;
  justificativa: string;
  acesso: AcessoTeletrabalho;
  atorId: string;
}) {
  const justificativa = params.justificativa.trim();
  if (!justificativa) throw new Error("Justificativa é obrigatória para reabrir a competência.");
  if (!params.acesso.acessoTotal && !params.acesso.ehCafDgp && !podeValidarUnidade(params.acesso, params.unidadeId)) {
    throw new Error("Sem permissão para reabrir esta competência.");
  }

  const fechamento = await prisma.ttFechamentoMensal.findUnique({
    where: {
      unidadeId_ano_mes: {
        unidadeId: params.unidadeId,
        ano: params.ano,
        mes: params.mes,
      },
    },
  });
  if (!fechamento || fechamento.situacao !== "fechado") {
    throw new Error("Competência não está fechada.");
  }

  const atualizado = await prisma.ttFechamentoMensal.update({
    where: { id: fechamento.id },
    data: {
      situacao: "aberto",
      reabertoEm: new Date(),
      reabertoPorId: params.atorId,
      justificativaReabertura: justificativa,
    },
  });

  await registrarAuditoria({
    entidade: "TtFechamentoMensal",
    entidadeId: fechamento.id,
    acao: "reabrir",
    atorId: params.atorId,
    estadoAnterior: { situacao: "fechado" },
  });

  return atualizado;
}

export async function competenciaFechada(unidadeId: string, data: Date): Promise<boolean> {
  const { ano, mes } = partesData(data);
  const fechamento = await prisma.ttFechamentoMensal.findUnique({
    where: { unidadeId_ano_mes: { unidadeId, ano, mes } },
  });
  return fechamento?.situacao === "fechado";
}
