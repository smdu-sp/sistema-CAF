import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { podeGerenciarCadastrosAssinatura } from "@/lib/assinatura-email/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await podeGerenciarCadastrosAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  let body: { nome?: string; ativo?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const data: { nome?: string; ativo?: boolean } = {};
  if (typeof body.nome === "string") {
    const nome = body.nome.trim();
    if (nome) {
      const existente = await prisma.assinaturaSetor.findFirst({
        where: { nome, id: { not: id } },
      });
      if (existente) {
        return NextResponse.json({ error: "Já existe uma unidade com este nome" }, { status: 409 });
      }
      data.nome = nome;
    }
  }
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const setor = await prisma.assinaturaSetor.update({
    where: { id },
    data,
    select: { id: true, nome: true, ativo: true },
  });
  return NextResponse.json(setor);
}
