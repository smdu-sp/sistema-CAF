import { NextRequest, NextResponse } from "next/server";
import { verificarApiKeyColeta } from "@/lib/inventario/api-helpers";
import { prisma } from "@/lib/prisma";

/**
 * Consumido pelo coletor (.ps1): retorna as solicitações de coleta pendentes.
 * Autenticação por API key. O coletor marca cada uma como processando/concluida
 * via PATCH /api/inventario/buscas/[id].
 */
export async function GET(request: NextRequest) {
  const gate = verificarApiKeyColeta(request);
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const pendentes = await prisma.invColetaSolicitacao.findMany({
    where: { status: "pendente" },
    orderBy: { criadoEm: "asc" },
    take: 50,
    select: { id: true, alvo: true, tipoAlvo: true },
  });

  return NextResponse.json(pendentes);
}
