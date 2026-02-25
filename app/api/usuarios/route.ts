import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  if (usuario?.permissao !== "ADM" && usuario?.permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }
  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      login: true,
      email: true,
      permissao: true,
      coordenadoriaId: true,
      coordenadoria: { select: { id: true, nome: true } },
    },
  });
  return NextResponse.json(usuarios);
}
