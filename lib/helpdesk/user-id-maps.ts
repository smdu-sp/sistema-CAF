import { prisma } from "@/lib/prisma";
import { buildUserIdMaps } from "./mappers";

/**
 * Mesmo critério do GET /api/helpdesk/chamados: todos os usuários ativos
 * mais IDs extras referenciados no chamado (ex.: usuários inativos).
 * Evita IDs numéricos diferentes entre carregamento inicial e updates parciais.
 */
export async function getHelpdeskUserIdMaps(extraUserIds?: Iterable<string>) {
  const ativos = await prisma.usuario.findMany({
    where: { status: true },
    select: { id: true },
  });
  const userUuidSet = new Set(ativos.map((u) => u.id));
  if (extraUserIds) {
    for (const id of extraUserIds) userUuidSet.add(id);
  }
  return buildUserIdMaps(userUuidSet);
}
