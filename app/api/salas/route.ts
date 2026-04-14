import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import type { Layout } from "@prisma/client";

const select = {
  id: true,
  nome: true,
  andar: true,
  numero: true,
  lotacao: true,
  layout: true,
  ativo: true,
};

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  const permissao = usuario?.permissao;
  if (permissao !== "ADM" && permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const lista = await prisma.salaReserva.findMany({
    orderBy: { nome: "asc" },
    select,
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  const permissao = usuario?.permissao;
  if (permissao !== "ADM" && permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  let body: { nome?: string; andar?: string; numero?: string; lotacao?: number; layout?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }
  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  if (!nome) {
    return NextResponse.json(
      { error: "Nome da sala é obrigatório" },
      { status: 400 }
    );
  }
  const existente = await prisma.salaReserva.findFirst({
    where: { nome },
  });
  if (existente) {
    return NextResponse.json(
      { error: "Já existe uma sala com este nome" },
      { status: 409 }
    );
  }
  const andar = typeof body.andar === "string" ? body.andar.trim() || null : null;
  const numero = typeof body.numero === "string" ? body.numero.trim() || null : null;
  const lotacao =
    typeof body.lotacao === "number" && Number.isFinite(body.lotacao) && body.lotacao > 0
      ? Math.trunc(body.lotacao)
      : null;
  const layoutRaw = typeof body.layout === "string" ? body.layout.trim().toUpperCase() : "";
  const layout: Layout | null =
    layoutRaw === "FIXO" || layoutRaw === "MOVEL" ? (layoutRaw as Layout) : null;

  const sala = await prisma.salaReserva.create({
    data: { nome, andar, numero, lotacao, layout },
    select,
  });
  return NextResponse.json(sala, { status: 201 });
}
