import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { idsUnidadesAcesso } from "@/lib/teletrabalho/permissoes";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";
import { parseDataIso } from "@/lib/teletrabalho/datas";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeAdesoes && !sessao.acesso.podeCadastros) {
    return jsonErro("Sem permissão", 403);
  }
  const unidadeId = request.nextUrl.searchParams.get("unidadeId");
  const filtroIds = idsUnidadesAcesso(sessao.acesso);
  const lista = await prisma.ttTermoAdesao.findMany({
    where: {
      servidor: {
        ...(unidadeId ? { unidadeId } : {}),
        ...(filtroIds ? { unidadeId: { in: filtroIds } } : {}),
      },
    },
    orderBy: { dataAssinatura: "desc" },
    include: {
      servidor: { select: { id: true, nome: true, rf: true, unidade: { select: { sigla: true } } } },
    },
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeAdesoes) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  const servidorId = typeof body.servidorId === "string" ? body.servidorId : "";
  if (!servidorId) return jsonErro("Servidor é obrigatório");
  const termo = await prisma.ttTermoAdesao.create({
    data: {
      servidorId,
      dataAssinatura: parseDataIso(String(body.dataAssinatura)),
      dataCienciaChefia: body.dataCienciaChefia ? parseDataIso(String(body.dataCienciaChefia)) : null,
      situacao: body.situacao === "vigente" || body.situacao === "encerrado" ? body.situacao : "pendente",
    },
    include: {
      servidor: { select: { id: true, nome: true, rf: true, unidade: { select: { sigla: true } } } },
    },
  });
  await registrarAuditoria({ entidade: "TtTermoAdesao", entidadeId: termo.id, acao: "criar", atorId: sessao.usuario.id });
  return NextResponse.json(termo, { status: 201 });
}
