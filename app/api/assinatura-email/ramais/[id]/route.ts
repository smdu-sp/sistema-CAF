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

  let body: { usuario?: string; ramalGrupo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const data: { usuario?: string; ramalGrupo?: string } = {};
  if (typeof body.usuario === "string") {
    const usuario = body.usuario.trim();
    if (usuario) {
      const existente = await prisma.assinaturaGrupoRamal.findFirst({
        where: { usuario, id: { not: id } },
      });
      if (existente) {
        return NextResponse.json(
          { error: "Já existe ramal cadastrado para este login" },
          { status: 409 },
        );
      }
      data.usuario = usuario;
    }
  }
  if (typeof body.ramalGrupo === "string") {
    const ramalGrupo = body.ramalGrupo.trim();
    if (ramalGrupo) data.ramalGrupo = ramalGrupo;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nenhum campo para atualizar" }, { status: 400 });
  }

  const ramal = await prisma.assinaturaGrupoRamal.update({
    where: { id },
    data,
    select: { id: true, usuario: true, ramalGrupo: true },
  });
  return NextResponse.json(ramal);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await podeGerenciarCadastrosAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  await prisma.assinaturaGrupoRamal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
