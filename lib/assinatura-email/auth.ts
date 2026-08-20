import { auth } from "@/lib/auth";
import { temAcessoTotalModulos } from "@/lib/permissoes";
import { prisma } from "@/lib/prisma";
import { validarPermissao } from "@/services/permissoes";
import { AE_PERMISSOES } from "./constants";

export async function obterUsuarioAutenticado() {
  const session = await auth();
  const usuario = session?.usuario;
  if (!usuario?.id) return null;
  return usuario;
}

export async function podeGerarAssinatura(): Promise<boolean> {
  const usuario = await obterUsuarioAutenticado();
  return Boolean(usuario?.id);
}

export async function podeGerenciarCadastrosAssinatura(): Promise<boolean> {
  const session = await auth();
  const usuario = session?.usuario;
  if (!usuario?.id) return false;
  if (temAcessoTotalModulos(String(usuario.permissao ?? ""), Boolean(usuario.desenvolvedor))) {
    return true;
  }
  return validarPermissao(AE_PERMISSOES.cadastros);
}

export async function buscarPerfilCompleto(usuarioId: string, login: string) {
  const loginNorm = login.trim();
  const [perfil, ramalGrupo] = await Promise.all([
    prisma.assinaturaPerfil.findUnique({
      where: { usuarioId },
      include: { setor: true },
    }),
    prisma.assinaturaGrupoRamal.findFirst({
      where: {
        OR: [
          { usuario: loginNorm },
          { usuario: loginNorm.toLowerCase() },
          { usuario: loginNorm.toUpperCase() },
        ],
      },
      select: { ramalGrupo: true },
    }),
  ]);

  return { perfil, ramalGrupo: ramalGrupo?.ramalGrupo ?? null };
}
