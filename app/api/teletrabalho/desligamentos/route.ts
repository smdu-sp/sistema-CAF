import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { parseDataIso } from "@/lib/teletrabalho/datas";

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeAdesoes) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const servidorId = typeof body.servidorId === "string" ? body.servidorId : "";
  const motivo = typeof body.motivo === "string" ? body.motivo.trim() : "";
  if (!servidorId || !motivo) return jsonErro("Servidor e motivo são obrigatórios");

  const desligamento = await prisma.$transaction(async (tx) => {
    const criado = await tx.ttTermoDesligamento.create({
      data: {
        servidorId,
        data: parseDataIso(String(body.data)),
        iniciativa: body.iniciativa === "chefia" ? "chefia" : "servidor",
        motivo,
      },
    });
    await tx.ttTermoAdesao.updateMany({
      where: { servidorId, situacao: "vigente" },
      data: { situacao: "encerrado" },
    });
    return criado;
  });

  await registrarAuditoria({
    entidade: "TtTermoDesligamento",
    entidadeId: desligamento.id,
    acao: "criar",
    atorId: sessao.usuario.id,
  });
  return NextResponse.json(desligamento, { status: 201 });
}
