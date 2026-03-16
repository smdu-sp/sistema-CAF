import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { listarUsuariosPorPrefixo } from "@/lib/auth/ldap";
import type { Permissao } from "@prisma/client";

/**
 * POST /api/usuarios/importar-lote
 * Importa do AD todos os usuários cujo login começa com "D" (permissão USR – podem reservar)
 * e todos os que começam com "X" (permissão TEC – importados mas não podem reservar salas).
 * Apenas ADM e DEV podem chamar.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const usuarioSessao = (session as any).usuario;
  if (usuarioSessao?.permissao !== "ADM" && usuarioSessao?.permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const regras: { prefixo: string; permissao: Permissao }[] = [
    { prefixo: "D", permissao: "USR" },
    { prefixo: "X", permissao: "TEC" },
  ];

  const resultado: {
    importadosD: number;
    importadosX: number;
    atualizadosD: number;
    atualizadosX: number;
    erros: string[];
  } = {
    importadosD: 0,
    importadosX: 0,
    atualizadosD: 0,
    atualizadosX: 0,
    erros: [],
  };

  for (const { prefixo, permissao } of regras) {
    let usuariosAD: { login: string; nome: string; email: string; avatar?: string }[];
    try {
      usuariosAD = await listarUsuariosPorPrefixo(prefixo);
    } catch (e) {
      resultado.erros.push(`Erro ao buscar usuários "${prefixo}*" no AD: ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    for (const u of usuariosAD) {
      if (!u.login?.trim() || !u.nome?.trim() || !u.email?.trim()) {
        resultado.erros.push(`Usuário ${u.login} ignorado: dados incompletos.`);
        continue;
      }

      try {
        const existia = await prisma.usuario.findUnique({
          where: { login: u.login },
          select: { id: true, permissao: true },
        });

        await prisma.usuario.upsert({
          where: { login: u.login },
          update: {
            nome: u.nome,
            email: u.email,
            permissao,
            ...(u.avatar ? { avatar: u.avatar } : {}),
          },
          create: {
            login: u.login,
            nome: u.nome,
            email: u.email,
            permissao,
            status: true,
            ...(u.avatar ? { avatar: u.avatar } : {}),
          },
        });

        if (prefixo === "D") {
          if (existia) resultado.atualizadosD++;
          else resultado.importadosD++;
        } else {
          if (existia) resultado.atualizadosX++;
          else resultado.importadosX++;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        resultado.erros.push(`${u.login}: ${msg}`);
      }
    }
  }

  return NextResponse.json(resultado, { status: 200 });
}
