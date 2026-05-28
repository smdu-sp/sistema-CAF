/** @format */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Modulo } from "@/prisma/generated";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.usuario?.id)  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const modulo = request.nextUrl.searchParams.get("modulo") as Modulo | null;
  const usuario = await prisma.usuario.findUnique({
    where: { id: session.usuario.id },
    select: { desenvolvedor: true }
  });
  const permissoes = await prisma.permissao.findMany({
    where: {
      ...usuario?.desenvolvedor ? {} : { usuarios: { some: { usuarioId: session.usuario.id }}},
      modulo: modulo || undefined,
    },
    select: { nome: true }
  })
  return NextResponse.json({ permissoes: permissoes.map((p) => p.nome) });
}
