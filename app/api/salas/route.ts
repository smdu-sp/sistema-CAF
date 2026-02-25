import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

const select = {
  id: true,
  nome: true,
  andar: true,
  localizacao: true,
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
  const lista = await prisma.sala.findMany({
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
  let body: { nome?: string; andar?: string; localizacao?: string };
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
  const existente = await prisma.sala.findFirst({
    where: { nome },
  });
  if (existente) {
    return NextResponse.json(
      { error: "Já existe uma sala com este nome" },
      { status: 409 }
    );
  }
  const andar = typeof body.andar === "string" ? body.andar.trim() || null : null;
  const localizacao =
    typeof body.localizacao === "string" ? body.localizacao.trim() || null : null;

  const sala = await prisma.sala.create({
    data: { nome, andar, localizacao },
    select,
  });
  return NextResponse.json(sala, { status: 201 });
}
