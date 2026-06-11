import { prisma } from "@/lib/prisma";

/** Vincula coordenadoria local pelo campo raiz/sigla da unidade HD. */
export async function resolverCoordenadoriaPorUnidade(unidadeId: string) {
  const unidade = await prisma.hdUnidade.findUnique({
    where: { id: unidadeId },
    select: { raiz: true, sigla: true, nome: true },
  });
  if (!unidade) return null;

  const candidatos = [unidade.raiz, unidade.sigla].filter(Boolean);
  for (const termo of candidatos) {
    const coord = await prisma.coordenadoria.findFirst({
      where: {
        ativo: true,
        OR: [
          { nome: { contains: termo } },
          { nome: { startsWith: termo } },
        ],
      },
    });
    if (coord) return coord;
  }

  return prisma.coordenadoria.findFirst({
    where: {
      ativo: true,
      nome: { contains: unidade.nome.split(" > ")[0] ?? unidade.nome },
    },
  });
}
