import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";

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

  const anterior = await prisma.ttAtividade.findUnique({ where: { id } });
  if (!anterior) return jsonErro("Atividade não encontrada", 404);

  const data: { descricao?: string; categoriaId?: string; ativo?: boolean } = {};
  if (typeof body.descricao === "string") data.descricao = body.descricao.trim();
  if (typeof body.categoriaId === "string") data.categoriaId = body.categoriaId;
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;

  const atividade = await prisma.ttAtividade.update({
    where: { id },
    data,
    include: {
      categoria: { select: { id: true, nome: true, ordem: true } },
      unidade: { select: { sigla: true } },
      cargos: { where: { fimVigencia: null }, include: { cargo: { select: { id: true, nome: true } } } },
    },
  });
  await registrarAuditoria({
    entidade: "TtAtividade",
    entidadeId: id,
    acao: "alterar",
    atorId: sessao.usuario.id,
    estadoAnterior: anterior,
  });
  return NextResponse.json(atividade);
}
