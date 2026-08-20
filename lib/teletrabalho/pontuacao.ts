import { prisma } from "@/lib/prisma";
import { parseDataIso } from "./datas";

export type ItemPontuacao = {
  atividadeId: string;
  quantidade: number;
  descricaoSnapshot: string;
  pontuacaoUnitaria: number;
  pontuacaoItem: number;
};

export async function atividadesVigentesDoCargo(cargoId: string, data: Date) {
  const associacoes = await prisma.ttCargoAtividade.findMany({
    where: {
      cargoId,
      inicioVigencia: { lte: data },
      OR: [{ fimVigencia: null }, { fimVigencia: { gte: data } }],
      atividade: { ativo: true },
    },
    include: {
      atividade: {
        include: { categoria: true },
      },
    },
    orderBy: [
      { atividade: { categoria: { ordem: "asc" } } },
      { atividade: { descricao: "asc" } },
    ],
  });

  return associacoes.map((a) => ({
    cargoAtividadeId: a.id,
    atividadeId: a.atividadeId,
    descricao: a.atividade.descricao,
    categoria: a.atividade.categoria.nome,
    categoriaOrdem: a.atividade.categoria.ordem,
    pontuacao: a.pontuacao,
  }));
}

export async function calcularPontuacao(
  cargoId: string,
  data: Date,
  itens: { atividadeId: string; quantidade: number }[],
): Promise<{ total: number; itens: ItemPontuacao[] }> {
  const vigentes = await atividadesVigentesDoCargo(cargoId, data);
  const porId = new Map(vigentes.map((v) => [v.atividadeId, v]));
  const calculados: ItemPontuacao[] = [];

  for (const item of itens) {
    if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
      throw new Error("Quantidade deve ser um inteiro maior que zero.");
    }
    const vigente = porId.get(item.atividadeId);
    if (!vigente) {
      throw new Error("Atividade não vigente para o cargo na data do registro.");
    }
    calculados.push({
      atividadeId: item.atividadeId,
      quantidade: item.quantidade,
      descricaoSnapshot: vigente.descricao,
      pontuacaoUnitaria: vigente.pontuacao,
      pontuacaoItem: vigente.pontuacao * item.quantidade,
    });
  }

  const total = calculados.reduce((acc, i) => acc + i.pontuacaoItem, 0);
  return { total, itens: calculados };
}

export { parseDataIso };
