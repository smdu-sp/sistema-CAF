/** @format */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ permissao: string }> }
) {
  const session = await auth();
  if (!session?.usuario?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const { permissao } = await params;
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: session.usuario.id,
      OR: [
        { desenvolvedor: true },
        { permissoes: { some: { permissao: { nome: permissao }}}},
      ]
    },
    include: {
      permissoes: true,
    }
  });

  return NextResponse.json({ temPermissao: !!usuario });
}
