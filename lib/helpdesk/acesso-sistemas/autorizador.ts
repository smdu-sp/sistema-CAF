import { prisma } from "@/lib/prisma";
import { listarRfsSubordinadosSgu } from "@/lib/sgu/responsaveis";

/** Usuário pode ver filtro de autorizações (coordenador/diretor ou responsável cadastrado). */
export async function usuarioEhAutorizadorAcesso(usuarioId: string): Promise<boolean> {
  const comoResponsavel = await prisma.hdSolicitacaoAcesso.count({
    where: { responsavelAutorizacaoId: usuarioId },
  });
  if (comoResponsavel > 0) return true;

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { login: true, coordenadoriaId: true },
  });
  if (!usuario) return false;

  if (usuario.coordenadoriaId) {
    const vinculo = await prisma.hdSolicitacaoAcesso.count({
      where: { coordenadoriaId: usuario.coordenadoriaId },
    });
    if (vinculo > 0) return true;
  }

  const obs = await prisma.hdChamadoUsuario.count({
    where: {
      usuarioId,
      papel: "observador",
      chamado: { areaAtual: "acesso_sistemas", solicitacaoAcesso: { isNot: null } },
    },
  });
  return obs > 0;
}

export async function filtroSolicitacoesParaAutorizador(usuarioId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { login: true, coordenadoriaId: true, coordenadoria: { select: { nome: true } } },
  });
  if (!usuario) return { OR: [{ id: -1 }] };

  const or: Record<string, unknown>[] = [
    { responsavelAutorizacaoId: usuarioId },
    {
      chamado: {
        usuarios: { some: { usuarioId, papel: "observador" } },
      },
    },
  ];

  if (usuario.coordenadoriaId) {
    or.push({ coordenadoriaId: usuario.coordenadoriaId });
  }

  const rfsSub = await listarRfsSubordinadosSgu({
    nomeSetor: usuario.coordenadoria?.nome ?? null,
  });
  if (rfsSub.length > 0) {
    or.push({ rfBeneficiario: { in: rfsSub } });
  }

  return { OR: or };
}
