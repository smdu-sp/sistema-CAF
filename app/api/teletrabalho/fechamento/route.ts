import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { fecharCompetencia, reabrirCompetencia } from "@/lib/teletrabalho/fechamento";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const unidadeId = request.nextUrl.searchParams.get("unidadeId");
  const lista = await prisma.ttFechamentoMensal.findMany({
    where: unidadeId ? { unidadeId } : undefined,
    orderBy: [{ ano: "desc" }, { mes: "desc" }],
    include: { unidade: { select: { sigla: true, nome: true } } },
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeFechar) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body) return jsonErro("Corpo da requisição inválido");
  try {
    if (body.reabrir) {
      const fechamento = await reabrirCompetencia({
        unidadeId: String(body.unidadeId),
        ano: Number(body.ano),
        mes: Number(body.mes),
        justificativa: String(body.justificativa ?? ""),
        acesso: sessao.acesso,
        atorId: sessao.usuario.id,
      });
      return NextResponse.json(fechamento);
    }
    const fechamento = await fecharCompetencia({
      unidadeId: String(body.unidadeId),
      ano: Number(body.ano),
      mes: Number(body.mes),
      acesso: sessao.acesso,
      atorId: sessao.usuario.id,
    });
    return NextResponse.json(fechamento);
  } catch (e) {
    return jsonErro(e instanceof Error ? e.message : "Erro no fechamento");
  }
}
