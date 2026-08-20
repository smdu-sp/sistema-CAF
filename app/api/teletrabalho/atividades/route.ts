import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { idsUnidadesAcesso } from "@/lib/teletrabalho/permissoes";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { texto } from "@/lib/teletrabalho/http";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const unidadeId = request.nextUrl.searchParams.get("unidadeId");
  const filtroIds = idsUnidadesAcesso(sessao.acesso);
  const lista = await prisma.ttAtividade.findMany({
    where: {
      ...(unidadeId ? { unidadeId } : {}),
      ...(filtroIds ? { unidadeId: { in: filtroIds } } : {}),
    },
    orderBy: [{ categoria: { ordem: "asc" } }, { descricao: "asc" }],
    include: {
      categoria: { select: { id: true, nome: true, ordem: true } },
      unidade: { select: { sigla: true } },
      cargos: {
        where: { fimVigencia: null },
        include: { cargo: { select: { id: true, nome: true } } },
      },
    },
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const descricao = typeof body.descricao === "string" ? body.descricao.trim() : "";
  const unidadeId = texto(body.unidadeId, 40);
  const categoriaId = texto(body.categoriaId, 40);
  if (!descricao || !unidadeId || !categoriaId) {
    return jsonErro("Descrição, unidade e categoria são obrigatórias");
  }
  const atividade = await prisma.ttAtividade.create({
    data: { descricao, unidadeId, categoriaId },
    include: {
      categoria: { select: { id: true, nome: true, ordem: true } },
      unidade: { select: { sigla: true } },
      cargos: { where: { fimVigencia: null }, include: { cargo: { select: { id: true, nome: true } } } },
    },
  });
  await registrarAuditoria({ entidade: "TtAtividade", entidadeId: atividade.id, acao: "criar", atorId: sessao.usuario.id });
  return NextResponse.json(atividade, { status: 201 });
}
