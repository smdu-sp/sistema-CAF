import { NextRequest, NextResponse } from "next/server";
import { parseEquipamentoBody } from "@/lib/inventario/equipamento";
import {
  equipamentoListSelect,
  exigeInventario,
  validarRelacoes,
} from "@/lib/inventario/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const gate = await exigeInventario();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const lista = await prisma.invEquipamento.findMany({
    orderBy: [{ statusRede: "asc" }, { hostname: "asc" }, { id: "asc" }],
    select: equipamentoListSelect,
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
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

  const parsed = parseEquipamentoBody(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const validacao = await validarRelacoes(parsed.data);
  if (validacao) {
    return NextResponse.json({ error: validacao.error }, { status: 400 });
  }

  const equipamento = await prisma.invEquipamento.create({
    data: { ...parsed.data, metodoColeta: "manual" },
    select: equipamentoListSelect,
  });

  return NextResponse.json(equipamento, { status: 201 });
}
