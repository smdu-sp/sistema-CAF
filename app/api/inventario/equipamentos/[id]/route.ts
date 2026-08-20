import { NextRequest, NextResponse } from "next/server";
import { parseEquipamentoBody } from "@/lib/inventario/equipamento";
import {
  equipamentoDetalheSelect,
  equipamentoListSelect,
  exigeInventario,
  validarRelacoes,
} from "@/lib/inventario/api-helpers";
import { prisma } from "@/lib/prisma";

function parseId(idParam: string): number | null {
  const id = Number.parseInt(idParam, 10);
  if (!Number.isFinite(id) || id < 1) return null;
  return id;
}

export async function GET(
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

  const equipamento = await prisma.invEquipamento.findUnique({
    where: { id },
    select: equipamentoDetalheSelect,
  });
  if (!equipamento) {
    return NextResponse.json(
      { error: "Equipamento não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(equipamento);
}

export async function PATCH(
  request: NextRequest,
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

  const existente = await prisma.invEquipamento.findUnique({ where: { id } });
  if (!existente) {
    return NextResponse.json(
      { error: "Equipamento não encontrado" },
      { status: 404 }
    );
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

  const parsed = parseEquipamentoBody(body, { partial: true });
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  if (!parsed.data || Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo para atualizar" },
      { status: 400 }
    );
  }

  const validacao = await validarRelacoes(parsed.data, id);
  if (validacao) {
    return NextResponse.json({ error: validacao.error }, { status: 400 });
  }

  const equipamento = await prisma.invEquipamento.update({
    where: { id },
    data: parsed.data,
    select: equipamentoListSelect,
  });

  return NextResponse.json(equipamento);
}

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

  const existente = await prisma.invEquipamento.findUnique({ where: { id } });
  if (!existente) {
    return NextResponse.json(
      { error: "Equipamento não encontrado" },
      { status: 404 }
    );
  }

  // Filhos (hardware/discos/softwares/histórico/localizações/alertas) caem por cascade.
  await prisma.invEquipamento.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
