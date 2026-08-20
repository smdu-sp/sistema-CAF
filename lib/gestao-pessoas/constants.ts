/** Código EH da Divisão de Gestão de Pessoas (DGP) — CAF/DGP */
export const GP_EH_DGP = "291000020000000";

export const GP_PERMISSOES = {
  visualizar: "gestao_pessoas.modulo.visualizar",
  importar: "gestao_pessoas.importacao.executar",
  imprimir: "gestao_pessoas.folha_ponto.imprimir",
  gerenciarPermissoes: "gestao_pessoas.permissoes.gerenciar",
} as const;

export type GpPapelUnidade = "usuario" | "administrador" | "dgp";

export function prefixoEh(codigoEh: string): string {
  const limpo = codigoEh.trim();
  if (limpo.length >= 6) return limpo.slice(0, 6);
  return limpo.padEnd(6, "0");
}

/** Cargo comissionado tem prioridade na listagem (lógica legada SIGPEG). */
export function refCargoPrioritaria(ref: string | null | undefined): boolean {
  if (!ref) return false;
  const r = ref.toUpperCase();
  return (
    r.startsWith("DAS") ||
    r.startsWith("DAI") ||
    r === "CHG" ||
    r.startsWith("SM")
  );
}

export type ServidorParaImpressao = {
  rf: string;
  nome: string;
  vinculo: string | null;
  codigoEh: string;
  nomeUnidade: string;
  refCargo: string | null;
};

/**
 * Deduplica servidores por RF priorizando cargos comissionados (DAS/DAI/CHG/SM),
 * replicando a query UNION do sistema legado.
 */
export function deduplicarServidoresParaImpressao<
  T extends ServidorParaImpressao,
>(registros: T[]): T[] {
  const porRf = new Map<string, T[]>();
  for (const r of registros) {
    const lista = porRf.get(r.rf) ?? [];
    lista.push(r);
    porRf.set(r.rf, lista);
  }

  const resultado: T[] = [];
  for (const lista of porRf.values()) {
    const prioritarios = lista.filter((r) => refCargoPrioritaria(r.refCargo));
    if (prioritarios.length > 0) {
      resultado.push(prioritarios[0]);
    } else if (lista.length > 0) {
      resultado.push(lista[0]);
    }
  }

  return resultado.sort((a, b) => {
    const cmpUnid = a.codigoEh.localeCompare(b.codigoEh);
    if (cmpUnid !== 0) return cmpUnid;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });
}
