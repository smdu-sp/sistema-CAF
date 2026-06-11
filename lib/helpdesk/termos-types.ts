export const NOME_PREFEITURA = "PREFEITURA DO MUNICÍPIO DE SÃO PAULO";
export const NOME_SECRETARIA = "SECRETARIA MUNICIPAL DE URBANISMO E LICENCIAMENTO";

export type FormatoTermo = "docx" | "pdf";

export type BemTermo = {
  patrimonio: string;
  descricao: string;
  serviceTag?: string;
  quantidade?: number;
};

export type TermoEntregaPayload = {
  tipo: "entrega";
  bens: BemTermo[];
  dataEntrega: string;
  dataRecebimento: string;
  unidadeEntregador: string;
  unidadeRecebedor: string;
  nomeEntregador: string;
  nomeRecebedor: string;
  rfEntregador: string;
  rfRecebedor: string;
};

export type OficioSaidaPayload = {
  tipo: "oficio-saida";
  dataCidade: string;
  dataDia: number;
  dataMes: string;
  dataAno: number;
  numeroOficio: string;
  bens: BemTermo[];
  nomeSignatario: string;
  rfSignatario: string;
  cargoSignatario: string;
  setorSignatario: string;
  destinatario: string;
};

export type TermoResponsabilidadePayload = {
  tipo: "responsabilidade";
  solicitante: string;
  rf: string;
  setorUnidade: string;
  telefone: string;
  patrimonio: string;
  tipoEquipamento: string;
  marcaModelo: string;
  numeroSerie: string;
  dataRetirada: string;
  dataDevolucao: string;
  objetivoUso: string;
  localUso: string;
  condicaoPerfeita: boolean;
  problemasDescricao: string;
  dataCidade: string;
  dataDia: number;
  dataMes: string;
  dataAno: number;
};

export type TermoPayload =
  | TermoEntregaPayload
  | OficioSaidaPayload
  | TermoResponsabilidadePayload;

export const MESES_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

export function nomeArquivoTermo(
  tipo: TermoPayload["tipo"],
  formato: FormatoTermo = "docx"
): string {
  const map: Record<TermoPayload["tipo"], Record<FormatoTermo, string>> = {
    entrega: {
      docx: "termo-entrega-bens.docx",
      pdf: "termo-entrega-bens.pdf",
    },
    "oficio-saida": {
      docx: "oficio-saida-predio.docx",
      pdf: "oficio-saida-predio.pdf",
    },
    responsabilidade: {
      docx: "termo-responsabilidade.docx",
      pdf: "termo-responsabilidade.pdf",
    },
  };
  return map[tipo][formato];
}
