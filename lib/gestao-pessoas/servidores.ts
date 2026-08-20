import { prisma } from "@/lib/prisma";
import {
  deduplicarServidoresParaImpressao,
  prefixoEh,
} from "./constants";
import type { AcessoGestaoPessoas } from "./permissoes";
import { usuarioPodeAcessarPrefixoEh } from "./permissoes";

export async function listarUnidadesParaImpressao(
  mes: number,
  ano: number,
  acesso: AcessoGestaoPessoas
) {
  const carga = await prisma.gpCargaMensal.findUnique({
    where: { mes_ano: { mes, ano } },
  });
  if (!carga) return { carga: null, unidades: [] as { prefixoEh: string; codigoEh: string; nomeUnidade: string }[] };

  const vinculos = await prisma.gpServidorVinculo.findMany({
    where: { cargaId: carga.id },
    select: { codigoEh: true, nomeUnidade: true },
    distinct: ["codigoEh"],
    orderBy: { codigoEh: "asc" },
  });

  const agrupadas = new Map<string, { codigoEh: string; nomeUnidade: string }>();
  for (const v of vinculos) {
    const prefixo = prefixoEh(v.codigoEh);
    if (!acesso.ehDgp && !usuarioPodeAcessarPrefixoEh(acesso, prefixo)) {
      continue;
    }
    if (!agrupadas.has(prefixo)) {
      agrupadas.set(prefixo, { codigoEh: v.codigoEh, nomeUnidade: v.nomeUnidade });
    }
  }

  return {
    carga,
    unidades: [...agrupadas.entries()].map(([prefixoEh, u]) => ({
      prefixoEh,
      codigoEh: u.codigoEh,
      nomeUnidade: u.nomeUnidade,
    })),
  };
}

export async function buscarServidoresParaImpressao(
  mes: number,
  ano: number,
  prefixoFiltro: string | null,
  rfFiltro: string | null,
  acesso: AcessoGestaoPessoas
) {
  const carga = await prisma.gpCargaMensal.findUnique({
    where: { mes_ano: { mes, ano } },
  });
  if (!carga) {
    throw new Error(
      `Carga de ${String(mes).padStart(2, "0")}/${ano} não disponível. Importe o arquivo SIGPEG.`
    );
  }

  const where: {
    cargaId: string;
    codigoEh?: { startsWith: string };
    rf?: string;
  } = { cargaId: carga.id };

  if (rfFiltro) {
    where.rf = rfFiltro;
  } else if (prefixoFiltro) {
    if (!acesso.ehDgp && !usuarioPodeAcessarPrefixoEh(acesso, prefixoFiltro)) {
      throw new Error("Sem permissão para esta unidade.");
    }
    where.codigoEh = { startsWith: prefixoEh(prefixoFiltro) };
  } else if (!acesso.ehDgp) {
    const prefixos = acesso.prefixosPermitidos;
    if (prefixos.length === 0) {
      throw new Error("Sem unidades vinculadas ao seu usuário.");
    }
  }

  let registros = await prisma.gpServidorVinculo.findMany({
    where,
    select: {
      rf: true,
      nome: true,
      vinculo: true,
      codigoEh: true,
      nomeUnidade: true,
      refCargo: true,
    },
  });

  if (!rfFiltro && !prefixoFiltro && !acesso.ehDgp) {
    const prefixosSet = new Set(acesso.prefixosPermitidos);
    registros = registros.filter((r) =>
      prefixosSet.has(prefixoEh(r.codigoEh))
    );
  }

  return deduplicarServidoresParaImpressao(registros);
}
