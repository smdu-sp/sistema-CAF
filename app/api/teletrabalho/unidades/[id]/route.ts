import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { texto } from "@/lib/teletrabalho/http";

const select = {
  id: true,
  nome: true,
  sigla: true,
  codigoEh: true,
  parentId: true,
  chefiaId: true,
  ativo: true,
  parent: { select: { id: true, sigla: true, nome: true } },
  chefia: { select: { id: true, nome: true, rf: true } },
};

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

  const data: {
    nome?: string;
    sigla?: string;
    codigoEh?: string | null;
    parentId?: string | null;
    chefiaId?: string | null;
    ativo?: boolean;
  } = {};

  if (typeof body.nome === "string") data.nome = texto(body.nome);
  if (typeof body.sigla === "string") data.sigla = texto(body.sigla, 20).toUpperCase();
  if (body.codigoEh !== undefined) data.codigoEh = texto(body.codigoEh, 15) || null;
  if (body.parentId !== undefined) data.parentId = body.parentId || null;
  if (body.chefiaId !== undefined) data.chefiaId = body.chefiaId || null;
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;

  const anterior = await prisma.ttUnidade.findUnique({ where: { id } });
  if (!anterior) return jsonErro("Unidade não encontrada", 404);

  const unidade = await prisma.ttUnidade.update({ where: { id }, data, select });
  await registrarAuditoria({
    entidade: "TtUnidade",
    entidadeId: id,
    acao: "alterar",
    atorId: sessao.usuario.id,
    estadoAnterior: anterior,
  });
  return NextResponse.json(unidade);
}
