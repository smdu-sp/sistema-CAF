import { NextRequest, NextResponse } from "next/server";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { exigeInventario } from "@/lib/inventario/api-helpers";
import { parseBuscaBody } from "@/lib/inventario/buscas";
import { prisma } from "@/lib/prisma";

const listSelect = {
  id: true,
  alvo: true,
  tipoAlvo: true,
  status: true,
  resultado: true,
  processadoEm: true,
  criadoEm: true,
  solicitante: { select: { id: true, nome: true } },
} as const;

export async function GET() {
  const gate = await exigeInventario();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const lista = await prisma.invColetaSolicitacao.findMany({
    orderBy: { criadoEm: "desc" },
    take: 100,
    select: listSelect,
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const sessao = await getSessaoHelpdesk();
  if ("error" in sessao) {
    return NextResponse.json({ error: sessao.error }, { status: sessao.status });
  }
  const gate = await exigeInventario();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }

  const parsed = parseBuscaBody(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const solicitacao = await prisma.invColetaSolicitacao.create({
    data: {
      alvo: parsed.data.alvo,
      tipoAlvo: parsed.data.tipoAlvo,
      solicitadoPor: sessao.usuario.id,
    },
    select: listSelect,
  });

  return NextResponse.json(solicitacao, { status: 201 });
}
