import { NextRequest, NextResponse } from "next/server";
import { exigeInventario, verificarApiKeyColeta } from "@/lib/inventario/api-helpers";
import { STATUS_SOLICITACAO, type StatusSolicitacao } from "@/lib/inventario/buscas";
import { prisma } from "@/lib/prisma";

function parseId(idParam: string): number | null {
  const id = Number.parseInt(idParam, 10);
  if (!Number.isFinite(id) || id < 1) return null;
  return id;
}

/** Atualiza status/resultado — usado pelo coletor (API key). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = verificarApiKeyColeta(request);
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (id === null) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const existente = await prisma.invColetaSolicitacao.findUnique({ where: { id } });
  if (!existente) {
    return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
  }

  let body: { status?: unknown; resultado?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const status = body.status;
  if (typeof status !== "string" || !STATUS_SOLICITACAO.includes(status as StatusSolicitacao)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }
  const resultado =
    typeof body.resultado === "string" ? body.resultado.slice(0, 5000) : undefined;

  const finalizada = status === "concluida" || status === "erro";
  const atualizada = await prisma.invColetaSolicitacao.update({
    where: { id },
    data: {
      status: status as StatusSolicitacao,
      ...(resultado !== undefined ? { resultado } : {}),
      ...(finalizada ? { processadoEm: new Date() } : {}),
    },
    select: { id: true, status: true },
  });

  return NextResponse.json(atualizada);
}

/** Cancela/remove uma solicitação — usado pela UI (sessão). */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await exigeInventario();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (id === null) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const existente = await prisma.invColetaSolicitacao.findUnique({ where: { id } });
  if (!existente) {
    return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
  }

  await prisma.invColetaSolicitacao.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
