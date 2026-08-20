import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buscarUsuarioNoAD } from "@/lib/auth/ldap";
import { validarPermissao } from "@/services/permissoes";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const temPermissao = await validarPermissao("usuarios.importar");
  if (!temPermissao) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { login } = await req.json();
  if (!login) {
    return NextResponse.json({ error: "Login é obrigatório" }, { status: 400 });
  }

  // Busca dados do usuário no Active Directory via conta de serviço
  const ldapUser = await buscarUsuarioNoAD(login);
  if (!ldapUser) {
    return NextResponse.json(
      { error: "Usuário não encontrado no Active Directory ou LDAP não configurado." },
      { status: 404 },
    );
  }

  // Cria ou atualiza o usuário no banco local
  const usuario = await prisma.usuario.upsert({
    where: { login },
    update: {
      nome: ldapUser.nome,
      email: ldapUser.email,
      telefone: ldapUser.telefone ?? null,
      ...(ldapUser.avatar ? { avatar: ldapUser.avatar } : {}),
    },
    create: {
      login,
      nome: ldapUser.nome,
      email: ldapUser.email,
      permissao: "USR",
      status: true,
      telefone: ldapUser.telefone ?? null,
      ...(ldapUser.avatar ? { avatar: ldapUser.avatar } : {}),
    },
  });

  return NextResponse.json(usuario, { status: 201 });
}
