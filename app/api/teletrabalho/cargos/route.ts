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
  const lista = await prisma.ttCargo.findMany({
    where: {
      ...(unidadeId ? { unidadeId } : {}),
      ...(filtroIds ? { unidadeId: { in: filtroIds } } : {}),
    },
    orderBy: { nome: "asc" },
    include: { unidade: { select: { sigla: true, nome: true } } },
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeCadastros) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const nome = texto(body.nome, 150);
  const unidadeId = texto(body.unidadeId, 40);
  if (!nome || !unidadeId) return jsonErro("Nome e unidade são obrigatórios");
  const cargo = await prisma.ttCargo.create({
    data: { nome, unidadeId },
    include: { unidade: { select: { sigla: true, nome: true } } },
  });
  await registrarAuditoria({ entidade: "TtCargo", entidadeId: cargo.id, acao: "criar", atorId: sessao.usuario.id });
  return NextResponse.json(cargo, { status: 201 });
}
