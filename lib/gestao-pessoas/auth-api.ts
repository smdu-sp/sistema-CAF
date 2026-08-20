import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterAcessoGestaoPessoas } from "@/lib/gestao-pessoas/permissoes";

export async function obterSessaoGestaoPessoas() {
  const session = await auth();
  const usuarioId = (session as { usuario?: { id?: string } })?.usuario?.id;
  if (!usuarioId) {
    return { error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { id: true, desenvolvedor: true },
  });
  if (!usuario) {
    return { error: NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 }) };
  }

  const acesso = await obterAcessoGestaoPessoas(usuario.id, usuario.desenvolvedor);
  return { usuario, acesso };
}
