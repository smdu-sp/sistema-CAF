import { prisma } from "@/lib/prisma";

export async function usuarioPodeAcessarChamado(
  chamadoId: number,
  usuarioId: string,
  isStaff: boolean
): Promise<boolean> {
  if (isStaff) return true;

  const chamado = await prisma.hdChamado.findFirst({
    where: {
      id: chamadoId,
      OR: [
        { solicitanteId: usuarioId },
        { abertoEmNomeDeId: usuarioId },
        { usuarios: { some: { usuarioId } } },
      ],
    },
    select: { id: true },
  });

  return !!chamado;
}
