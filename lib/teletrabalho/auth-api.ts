import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterAcessoTeletrabalho, type AcessoTeletrabalho } from "./permissoes";

export async function obterSessaoTeletrabalho(): Promise<
  | { error: NextResponse }
  | { usuario: { id: string; desenvolvedor: boolean }; acesso: AcessoTeletrabalho }
> {
  const session = await auth();
  const usuarioSessao = (session as { usuario?: { id?: string } })?.usuario;
  if (!usuarioSessao?.id) {
    return { error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioSessao.id },
    select: { id: true, desenvolvedor: true, permissao: true },
  });
  if (!usuario) {
    return { error: NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 }) };
  }

  const acesso = await obterAcessoTeletrabalho(
    usuario.id,
    usuario.desenvolvedor,
    String(usuario.permissao),
  );
  if (!acesso.podeVisualizar) {
    return { error: NextResponse.json({ error: "Sem permissão" }, { status: 403 }) };
  }

  return { usuario: { id: usuario.id, desenvolvedor: usuario.desenvolvedor }, acesso };
}

export function jsonErro(mensagem: string, status = 400) {
  return NextResponse.json({ error: mensagem }, { status });
}
