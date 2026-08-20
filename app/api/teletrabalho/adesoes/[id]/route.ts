import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { parseDataIso } from "@/lib/teletrabalho/datas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeAdesoes) return jsonErro("Sem permissão", 403);
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const anterior = await prisma.ttTermoAdesao.findUnique({ where: { id } });
  if (!anterior) return jsonErro("Termo não encontrado", 404);
  const data: {
    situacao?: "pendente" | "vigente" | "encerrado";
    dataCienciaChefia?: Date | null;
  } = {};
  if (body.situacao === "pendente" || body.situacao === "vigente" || body.situacao === "encerrado") {
    data.situacao = body.situacao;
  }
  if (body.dataCienciaChefia !== undefined) {
    data.dataCienciaChefia = body.dataCienciaChefia ? parseDataIso(String(body.dataCienciaChefia)) : null;
  }
  const termo = await prisma.ttTermoAdesao.update({
    where: { id },
    data,
    include: {
      servidor: { select: { id: true, nome: true, rf: true, unidade: { select: { sigla: true } } } },
    },
  });
  await registrarAuditoria({
    entidade: "TtTermoAdesao",
    entidadeId: id,
    acao: "alterar",
    atorId: sessao.usuario.id,
    estadoAnterior: anterior,
  });
  return NextResponse.json(termo);
}
