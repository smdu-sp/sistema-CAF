import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { texto } from "@/lib/teletrabalho/http";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");

  if (typeof body.ativo === "boolean" && body.ativo) {
    const vigentes = await prisma.ttCargoAtividade.count({
      where: { cargoId: id, fimVigencia: null, atividade: { ativo: true } },
    });
    if (vigentes < 1) {
      return jsonErro("Cargo precisa de ao menos uma atividade vigente para ser ativado");
    }
  }

  const data: { nome?: string; ativo?: boolean } = {};
  if (typeof body.nome === "string") data.nome = texto(body.nome, 150);
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;
  const anterior = await prisma.ttCargo.findUnique({ where: { id } });
  if (!anterior) return jsonErro("Cargo não encontrado", 404);
  const cargo = await prisma.ttCargo.update({
    where: { id },
    data,
    include: { unidade: { select: { sigla: true, nome: true } } },
  });
  await registrarAuditoria({
    entidade: "TtCargo",
    entidadeId: id,
    acao: "alterar",
    atorId: sessao.usuario.id,
    estadoAnterior: anterior,
  });
  return NextResponse.json(cargo);
}
