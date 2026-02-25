import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

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
  const lista = await prisma.coordenadoria.findMany({
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, ativo: true },
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
  let body: { nome?: string };
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
      { error: "Nome da coordenadoria é obrigatório" },
      { status: 400 }
    );
  }
  const existente = await prisma.coordenadoria.findFirst({
    where: { nome },
  });
  if (existente) {
    return NextResponse.json(
      { error: "Já existe uma coordenadoria com este nome" },
      { status: 409 }
    );
  }
  const coordenadoria = await prisma.coordenadoria.create({
    data: { nome },
    select: { id: true, nome: true, ativo: true },
  });
  return NextResponse.json(coordenadoria, { status: 201 });
}
