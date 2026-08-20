import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validarPermissao } from "@/services/permissoes";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const temPermissao = await validarPermissao("usuarios.importar");
  if (!temPermissao) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: "asc" },
    select: {
      id: true,
      nome: true,
      login: true,
      email: true,
      telefone: true,
      permissao: true,
      coordenadoriaId: true,
      coordenadoria: { select: { id: true, nome: true } },
    },
  });
  return NextResponse.json(usuarios);
}
