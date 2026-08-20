import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { idsUnidadesAcesso, podeVerUnidade } from "@/lib/teletrabalho/permissoes";
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

export async function GET() {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;

  const filtroIds = idsUnidadesAcesso(sessao.acesso);
  const lista = await prisma.ttUnidade.findMany({
    where: filtroIds ? { id: { in: filtroIds } } : undefined,
    orderBy: { nome: "asc" },
    select,
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);

  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");

  const nome = texto(body.nome);
  const sigla = texto(body.sigla, 20).toUpperCase();
  if (!nome || !sigla) return jsonErro("Nome e sigla são obrigatórios");

  const codigoEh = texto(body.codigoEh, 15) || null;
  const parentId = typeof body.parentId === "string" && body.parentId ? body.parentId : null;
  const chefiaId = typeof body.chefiaId === "string" && body.chefiaId ? body.chefiaId : null;

  if (codigoEh) {
    const dup = await prisma.ttUnidade.findUnique({ where: { codigoEh } });
    if (dup) return jsonErro("Já existe unidade com este código EH", 409);
  }

  const unidade = await prisma.ttUnidade.create({
    data: { nome, sigla, codigoEh, parentId, chefiaId },
    select,
  });
  await registrarAuditoria({
    entidade: "TtUnidade",
    entidadeId: unidade.id,
    acao: "criar",
    atorId: sessao.usuario.id,
  });
  return NextResponse.json(unidade, { status: 201 });
}

export { podeVerUnidade };
