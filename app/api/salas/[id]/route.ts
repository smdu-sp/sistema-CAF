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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  const permissao = usuario?.permissao;
  if (permissao !== "ADM" && permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }
  let body: {
    nome?: string;
    andar?: string;
    localizacao?: string;
    ativo?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }
  const data: {
    nome?: string;
    andar?: string | null;
    localizacao?: string | null;
    ativo?: boolean;
  } = {};
  if (typeof body.nome === "string") {
    const nome = body.nome.trim();
    if (nome) {
      const existente = await prisma.sala.findFirst({
        where: { nome, id: { not: id } },
      });
      if (existente) {
        return NextResponse.json(
          { error: "Já existe uma sala com este nome" },
          { status: 409 }
        );
      }
      data.nome = nome;
    }
  }
  if (body.andar !== undefined) {
    data.andar =
      typeof body.andar === "string" ? body.andar.trim() || null : null;
  }
  if (body.localizacao !== undefined) {
    data.localizacao =
      typeof body.localizacao === "string"
        ? body.localizacao.trim() || null
        : null;
  }
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo para atualizar" },
      { status: 400 }
    );
  }
  const sala = await prisma.sala.update({
    where: { id },
    data,
    select,
  });
  return NextResponse.json(sala);
}
