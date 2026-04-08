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
    numero?: string;
    lotacao?: number;
    layout?: string;
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
    numero?: string | null;
    lotacao?: number | null;
    layout?: Layout | null;
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
  if (body.numero !== undefined) {
    data.numero =
      typeof body.numero === "string"
        ? body.numero.trim() || null
        : null;
  }
  if (body.lotacao !== undefined) {
    data.lotacao =
      typeof body.lotacao === "number" &&
      Number.isFinite(body.lotacao) &&
      body.lotacao > 0
        ? Math.trunc(body.lotacao)
        : null;
  }
  if (body.layout !== undefined) {
    const layoutRaw = typeof body.layout === "string" ? body.layout.trim().toUpperCase() : "";
    data.layout =
      layoutRaw === "FIXO" || layoutRaw === "MOVEL"
        ? (layoutRaw as Layout)
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
