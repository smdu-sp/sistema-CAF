import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { podeVerUnidade } from "@/lib/teletrabalho/permissoes";
import { registrarAuditoria } from "@/lib/teletrabalho/auditoria";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const unidadeId = request.nextUrl.searchParams.get("unidadeId");
  if (!unidadeId) return jsonErro("unidadeId é obrigatório");
  if (!podeVerUnidade(sessao.acesso, unidadeId) && !sessao.acesso.acessoTotal) {
    return jsonErro("Sem permissão", 403);
  }
  const [regime, servidores] = await Promise.all([
    prisma.ttRegimeEscala.findUnique({ where: { unidadeId } }),
    prisma.ttServidor.findMany({
      where: { unidadeId, ativo: true },
      select: {
        id: true,
        nome: true,
        rf: true,
        escala: true,
      },
      orderBy: { nome: "asc" },
    }),
  ]);
  return NextResponse.json({ regime, servidores });
}

export async function PUT(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeEscala) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  if (!body?.unidadeId) return jsonErro("unidadeId é obrigatório");

  const regime = await prisma.ttRegimeEscala.upsert({
    where: { unidadeId: body.unidadeId },
    update: {
      diasRemotos: Number(body.diasRemotos) || 2,
      diasPresenciais: Number(body.diasPresenciais) || 3,
      gruposRodizio: Number(body.gruposRodizio) || 2,
      algoritmo: body.algoritmo === "personalizado" ? "personalizado" : "atecc_grupos_2",
    },
    create: {
      unidadeId: body.unidadeId,
      diasRemotos: Number(body.diasRemotos) || 2,
      diasPresenciais: Number(body.diasPresenciais) || 3,
      gruposRodizio: Number(body.gruposRodizio) || 2,
      algoritmo: body.algoritmo === "personalizado" ? "personalizado" : "atecc_grupos_2",
    },
  });

  if (Array.isArray(body.escalas)) {
    for (const item of body.escalas as { servidorId: string; grupo: number }[]) {
      await prisma.ttEscalaServidor.upsert({
        where: { servidorId: item.servidorId },
        update: { grupo: item.grupo === 2 ? 2 : 1 },
        create: { servidorId: item.servidorId, grupo: item.grupo === 2 ? 2 : 1 },
      });
    }
  }

  await registrarAuditoria({
    entidade: "TtRegimeEscala",
    entidadeId: regime.id,
    acao: "alterar",
    atorId: sessao.usuario.id,
  });
  return NextResponse.json(regime);
}
