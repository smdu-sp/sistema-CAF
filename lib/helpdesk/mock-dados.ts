/** Dados mock de unidades (help desk) e coordenadorias (cadastro principal). */

export const UNIDADES_RAW = [
  "AUDITÓRIO",
  "CAEPP",
  "CAF",
  "CAF > DGP",
  "CAF > DLC",
  "CAF > DOF",
  "CAF > DSUP",
  "CAP",
  "CAP > ARTHUR SABOYA",
  "CAP > DEPROT",
  "CAP > DPCI",
  "CAP > DPD",
  "CAP > NÚCLEO DE ATENDIMENTO",
  "CASE",
  "CASE > DCAD",
  "CASE > DDU",
  "CASE > DLE",
  "CASE > STEL",
  "CEPEUC",
  "CGPATRI",
  "COMIN",
  "COMIN > DCIGP",
  "COMIN > DCIMP",
  "CONTRU",
  "CONTRU > DACESS",
  "CONTRU > DINS",
  "CONTRU > DLR",
  "CONTRU > DSUS",
  "COSH",
  "DEUSO",
  "GABINETE",
  "GABINETE > ASCOM",
  "GABINETE > ATAJ",
  "GABINETE > ATECC",
  "GABINETE > ATIC",
  "GEOINFO",
  "GTEC",
  "ILUME",
  "PARHIS",
  "PARHIS > DHGP",
  "PARHIS > DHMP",
  "PARHIS > DHPP",
  "PARHIS > DPS",
  "PLANURB",
  "RESID",
  "RESID > DRGP",
  "RESID > DRH",
  "RESID > DRVE",
  "SERVIN",
  "SERVIN > DSIGP",
] as const;

export type UnidadeMock = {
  codigo: string;
  nome: string;
  raiz: string;
  sigla: string;
  sala: string | null;
};

export function buildUnidadesMock(): UnidadeMock[] {
  return UNIDADES_RAW.map((full, i) => {
    const parts = full.split(" > ");
    const raiz = parts[0];
    const sigla = parts[parts.length - 1];
    const isSub = parts.length > 1;
    return {
      codigo: `UND-${String(i + 1).padStart(3, "0")}`,
      nome: full,
      raiz,
      sigla,
      sala: isSub ? `Sala ${sigla}` : null,
    };
  });
}

/** Coordenadorias = raízes hierárquicas das unidades. */
export function buildCoordenadoriasMock(): string[] {
  return [...new Set(UNIDADES_RAW.map((u) => u.split(" > ")[0]))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}
