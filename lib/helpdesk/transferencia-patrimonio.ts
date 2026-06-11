import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

export const UNIDADE_ATIC_SIGLA = "ATIC";

export const UNIDADE_ATIC_LABEL =
  "ATIC (Assessoria de Tecnologia da Informação e Comunicação)";

export async function buscarUnidadeAtic(tx: Tx) {
  const candidatas = await tx.hdUnidade.findMany({
    where: { ativo: true },
    select: { id: true, nome: true, sigla: true },
  });

  const exata = candidatas.find(
    (u) => u.sigla.trim().toUpperCase() === UNIDADE_ATIC_SIGLA
  );
  if (exata) return exata;

  const prefixoAtic = candidatas.find((u) => {
    const sigla = u.sigla.trim().toUpperCase();
    return sigla === UNIDADE_ATIC_SIGLA || sigla.startsWith(`${UNIDADE_ATIC_SIGLA} `);
  });
  if (prefixoAtic) return prefixoAtic;

  return tx.hdUnidade.findFirst({
    where: {
      ativo: true,
      nome: { contains: "Assessoria" },
    },
    select: { id: true, nome: true, sigla: true },
  });
}

export async function movimentarItemParaAtic(
  tx: Tx,
  params: {
    idItem: number;
    idUsuario: string;
    observacao: string;
  }
): Promise<{
  transferiu: boolean;
  unidadeAticNome: string;
  servidorAnterior: string | null;
  localizacaoAnterior: string | null;
}> {
  const atic = await buscarUnidadeAtic(tx);
  if (!atic) {
    throw new Error(
      "Unidade ATIC não encontrada no cadastro. Cadastre a unidade ATIC antes de alterar o status."
    );
  }

  const item = await tx.hdItemPatrimonio.findUnique({
    where: { idbem: params.idItem },
    include: {
      unidade: { select: { id: true, nome: true, sigla: true } },
      servidor: { select: { nome: true } },
    },
  });

  if (!item) {
    throw new Error("Item não encontrado");
  }

  const servidorAnterior = item.servidor?.nome?.trim() || null;
  const localizacaoAnterior =
    item.unidade?.sigla?.trim() || item.unidade?.nome?.trim() || null;
  const jaNaAtic = item.unidadeId === atic.id;
  const temServidor = Boolean(item.servidorId);

  const precisaMovimentar = !jaNaAtic || temServidor;

  if (!precisaMovimentar) {
    return {
      transferiu: false,
      unidadeAticNome: atic.nome,
      servidorAnterior,
      localizacaoAnterior,
    };
  }

  const cab = await tx.hdTransferenciaCabecalho.create({
    data: {
      cimbpm: "TRF-PENDENTE",
      observacao: params.observacao,
      idUsuarioRegistro: params.idUsuario,
      idUnidadeDestino: atic.id,
    },
  });

  const ano = new Date().getFullYear();
  await tx.hdTransferenciaCabecalho.update({
    where: { id: cab.id },
    data: { cimbpm: `TRF-${ano}-${String(cab.id).padStart(4, "0")}` },
  });

  await tx.hdTransferenciaItem.create({
    data: {
      cabecalhoId: cab.id,
      idItem: params.idItem,
      servidorAnterior: servidorAnterior,
      servidorAtual: null,
    },
  });

  await tx.hdItemPatrimonio.update({
    where: { idbem: params.idItem },
    data: {
      unidadeId: atic.id,
      servidorId: null,
    },
  });

  return {
    transferiu: true,
    unidadeAticNome: atic.nome,
    servidorAnterior,
    localizacaoAnterior,
  };
}
