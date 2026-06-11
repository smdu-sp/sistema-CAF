import { prisma } from "@/lib/prisma";

/** Verifica se o usuário é ponto focal ativo de alguma unidade. */
export async function usuarioEhPontoFocal(usuarioId: string): Promise<boolean> {
  const n = await prisma.hdPontoFocalUnidade.count({
    where: { usuarioId, ativo: true },
  });
  return n > 0;
}

/** Unidades em que o usuário é ponto focal. */
export async function unidadesDoPontoFocal(usuarioId: string) {
  const vinculos = await prisma.hdPontoFocalUnidade.findMany({
    where: { usuarioId, ativo: true },
    include: {
      unidade: {
        select: { id: true, nome: true, sigla: true, raiz: true, codigo: true },
      },
    },
    orderBy: { unidade: { nome: "asc" } },
  });
  return vinculos.map((v) => v.unidade);
}

export async function pontoFocalDaUnidade(
  usuarioId: string,
  unidadeId: string
): Promise<boolean> {
  const v = await prisma.hdPontoFocalUnidade.findFirst({
    where: { usuarioId, unidadeId, ativo: true },
  });
  return !!v;
}
