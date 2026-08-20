import { prisma } from "@/lib/prisma";
import { parseArquivoSigpeg } from "./parse-sigpeg";
import { garantirUnidadeEh } from "./permissoes";

export type ResultadoImportacao = {
  mes: number;
  ano: number;
  totalRegistros: number;
  cargaId: string;
};

export async function importarCargaSigpeg(
  conteudo: string,
  mes: number,
  ano: number,
  importadoPorId: string
): Promise<ResultadoImportacao> {
  const linhas = parseArquivoSigpeg(conteudo);
  if (linhas.length === 0) {
    throw new Error("Arquivo vazio ou formato inválido.");
  }

  const unidadesUnicas = new Map<string, string>();
  for (const l of linhas) {
    if (l.codigoEh) unidadesUnicas.set(l.codigoEh, l.nomeUnidade);
  }
  for (const [codigoEh, nome] of unidadesUnicas) {
    await garantirUnidadeEh(codigoEh, nome);
  }

  const carga = await prisma.$transaction(async (tx) => {
    const existente = await tx.gpCargaMensal.findUnique({
      where: { mes_ano: { mes, ano } },
    });
    if (existente) {
      await tx.gpServidorVinculo.deleteMany({ where: { cargaId: existente.id } });
      await tx.gpCargaMensal.delete({ where: { id: existente.id } });
    }

    await tx.gpServidor.updateMany({ data: { ultimaCarga: false } });

    const novaCarga = await tx.gpCargaMensal.create({
      data: {
        mes,
        ano,
        totalRegistros: linhas.length,
        importadoPorId,
      },
    });

    for (const l of linhas) {
      const servidor = await tx.gpServidor.upsert({
        where: { rf: l.rf },
        create: {
          rf: l.rf,
          nome: l.nome,
          vinculo: l.vinculo || null,
          nomeCargo: l.nomeCargo || null,
          refCargo: l.refCargo || null,
          unidadeEh: l.codigoEh || null,
          nomeUnidade: l.nomeUnidade || null,
          ultimaCarga: true,
        },
        update: {
          nome: l.nome,
          vinculo: l.vinculo || null,
          nomeCargo: l.nomeCargo || null,
          refCargo: l.refCargo || null,
          unidadeEh: l.codigoEh || null,
          nomeUnidade: l.nomeUnidade || null,
          ultimaCarga: true,
        },
      });

      await tx.gpServidorVinculo.create({
        data: {
          cargaId: novaCarga.id,
          servidorId: servidor.id,
          rf: l.rf,
          nome: l.nome,
          vinculo: l.vinculo || null,
          especie: l.especie || null,
          inicio: l.inicio || null,
          termino: l.termino || null,
          codigoCargo: l.codigoCargo || null,
          nomeCargo: l.nomeCargo || null,
          refCargo: l.refCargo || null,
          codigoEh: l.codigoEh,
          nomeUnidade: l.nomeUnidade,
          relJurAdm: l.relJurAdm || null,
          tipoEvento: l.tipoEvento || null,
          inicioExerc: l.inicioExerc || null,
          titularRf: l.titularRf || null,
          numVincTit: l.numVincTit || null,
          nomeFuncTit: l.nomeFuncTit || null,
          inicioRem: l.inicioRem || null,
          fimRem: l.fimRem || null,
          observacao: l.observacao || null,
          vaga: l.vaga || null,
        },
      });
    }

    return novaCarga;
  });

  return {
    mes,
    ano,
    totalRegistros: linhas.length,
    cargaId: carga.id,
  };
}
