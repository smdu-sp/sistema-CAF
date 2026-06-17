/** @format */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { temAcessoTotalModulos } from "@/lib/permissoes";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ permissao: string }> }
) {
  const session = await auth();
  if (!session?.usuario?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { permissao: nomePermissao } = await params;
  const usuario = await prisma.usuario.findUnique({
    where: { id: session.usuario.id },
    select: { desenvolvedor: true, permissao: true },
  });
  if (
    temAcessoTotalModulos(
      usuario?.permissao ?? session.usuario.permissao ?? "",
      usuario?.desenvolvedor ?? session.usuario.desenvolvedor,
    )
  ) {
    return NextResponse.json({ temPermissao: true });
  }
  const vinculo = await prisma.usuarioPermissao.findFirst({
    where: {
      usuarioId: session.usuario.id,
      permissao: { nome: nomePermissao },
    },
  });

  return NextResponse.json({ temPermissao: !!vinculo });
}
