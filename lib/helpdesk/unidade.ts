import { prisma } from "@/lib/prisma";

const unidadeSelectBasico = {
  id: true,
  nome: true,
  sigla: true,
  raiz: true,
  codigo: true,
} as const;

/** Unidades ativas cadastradas em hd.unidades. */
export async function listarUnidadesAtivasHelpdesk() {
  return prisma.hdUnidade.findMany({
    where: { ativo: true },
    select: unidadeSelectBasico,
    orderBy: [{ raiz: "asc" }, { nome: "asc" }],
  });
}

/** Deriva raiz e sigla a partir do nome hierárquico (ex.: "CAF > DGP"). */
export function parseNomeUnidade(nomeCompleto: string) {
  const parts = nomeCompleto
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    throw new Error("Nome da unidade é obrigatório");
  }
  const nome = parts.join(" > ");
  return {
    nome,
    raiz: parts[0],
    sigla: parts[parts.length - 1],
  };
}
