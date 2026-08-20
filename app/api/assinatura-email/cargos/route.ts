import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  obterUsuarioAutenticado,
  podeGerarAssinatura,
  podeGerenciarCadastrosAssinatura,
} from "@/lib/assinatura-email/auth";

export async function GET() {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!(await podeGerarAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const lista = await prisma.assinaturaCargo.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    select: { id: true, nome: true, ativo: true },
  });
  return NextResponse.json(lista);
}

export async function POST(request: NextRequest) {
  if (!(await podeGerenciarCadastrosAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  let body: { nome?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  if (!nome) {
    return NextResponse.json({ error: "Nome do cargo é obrigatório" }, { status: 400 });
  }

  const existente = await prisma.assinaturaCargo.findFirst({ where: { nome } });
  if (existente) {
    return NextResponse.json({ error: "Já existe um cargo com este nome" }, { status: 409 });
  }

  const cargo = await prisma.assinaturaCargo.create({
    data: { nome },
    select: { id: true, nome: true, ativo: true },
  });
  return NextResponse.json(cargo, { status: 201 });
}
