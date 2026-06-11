import type {
  BemTermo,
  OficioSaidaPayload,
  TermoEntregaPayload,
  TermoPayload,
  TermoResponsabilidadePayload,
} from "./termos-types";

/** Constantes compartilhadas — DOCX usa half-points (pt × 2). */
export const LAYOUT = {
  fonte: "Calibri",
  fontePdf: "Roboto",
  corpoPt: 11,
  tituloPt: 14,
  subtituloPt: 12,
  secretariaPt: 12,
  brasaoLargura: 120,
  brasaoAltura: 54,
  margemPaginaPt: 40,
  margemTopoComCabecalhoPt: 90,
  linhasVaziasTabelaBens: 0,
  espacoParagrafoPt: 6,
  espacoTituloPt: 10,
} as const;

export type BlocoParagrafo = {
  tipo: "paragrafo";
  texto: string;
  negrito?: boolean;
  centralizado?: boolean;
  tamanhoPt?: number;
  recuo?: boolean;
};

export type BlocoEspaco = { tipo: "espaco"; alturaPt?: number };

export type BlocoTabelaBens2 = {
  tipo: "tabela-bens-2";
  bens: { patrimonio: string; descricao: string; serviceTag?: string }[];
};

export type BlocoTabelaBens4 = {
  tipo: "tabela-bens-4";
  bens: BemTermo[];
};

export type BlocoTabela2Colunas = {
  tipo: "tabela-2colunas";
  linhas: [string, string][];
  cabecalhoNegrito?: boolean;
};

export type BlocoTabelaAssinaturas = {
  tipo: "tabela-assinaturas";
  rotulos: [string, string];
  linhasVazias?: number;
};

export type BlocoRodape = { tipo: "rodape"; blocos: BlocoTermo[]; alturaPt?: number };

export type BlocoTermo =
  | BlocoParagrafo
  | BlocoEspaco
  | BlocoTabelaBens2
  | BlocoTabelaBens4
  | BlocoTabela2Colunas
  | BlocoTabelaAssinaturas
  | BlocoRodape;

function espaco(alturaPt: number = LAYOUT.espacoParagrafoPt): BlocoEspaco {
  return { tipo: "espaco", alturaPt };
}

function paragrafo(
  texto: string,
  opts: Omit<BlocoParagrafo, "tipo" | "texto"> = {}
): BlocoParagrafo {
  return { tipo: "paragrafo", texto, ...opts };
}

function linhasVaziasTabela(qtdItens: number): [string, string, string][] {
  const faltam = Math.max(0, LAYOUT.linhasVaziasTabelaBens - qtdItens);
  return Array.from({ length: faltam }, () => ["", "", ""]);
}

function linhasVaziasTabela4(qtdItens: number): [string, string, string, string][] {
  const faltam = Math.max(0, LAYOUT.linhasVaziasTabelaBens - qtdItens);
  return Array.from({ length: faltam }, () => ["", "", "", ""]);
}

function montarEntrega(data: TermoEntregaPayload): BlocoTermo[] {
  return [
    paragrafo("TERMO DE ENTREGA", { negrito: true, centralizado: true, tamanhoPt: LAYOUT.tituloPt }),
    espaco(LAYOUT.espacoTituloPt),
    paragrafo(
      "Recebi nesta data os Bens Patrimoniais descritos no presente termo de responsabilidade e recebimento, cuja movimentação/aceite será registrada no Sistema de Bens Patrimoniais - SBPM, ou via processo SEI, nos termos da legislação que rege a matéria."
    ),
    espaco(),
    { tipo: "tabela-bens-2", bens: data.bens },
    {
      tipo: "rodape",
      blocos: [
        {
          tipo: "tabela-2colunas",
          linhas: [
            [`Entregue em ${data.dataEntrega}`, `Recebido em ${data.dataRecebimento}`],
            [`UNIDADE: ${data.unidadeEntregador}`, `UNIDADE: ${data.unidadeRecebedor}`],
            [`NOME: ${data.nomeEntregador}`, `NOME: ${data.nomeRecebedor}`],
            [`RF: ${data.rfEntregador}`, `RF: ${data.rfRecebedor}`],
          ],
        },
        espaco(30),
        espaco(),
        espaco(),
        {
          tipo: "tabela-assinaturas",
          rotulos: ["CARIMBO/ASSINATURA DO ENTREGADOR", "CARIMBO/ASSINATURA DO RECEBEDOR"],
          linhasVazias: 3,
        },
      ],
    },
  ];
}

function montarOficio(data: OficioSaidaPayload): BlocoTermo[] {
  return [
    paragrafo(
      `${data.dataCidade}, ${data.dataDia} de ${data.dataMes} de ${data.dataAno}.`,
      { centralizado: true }
    ),
    espaco(),
    paragrafo(`Ofício nº ${data.numeroOficio}`, { centralizado: true }),
    espaco(LAYOUT.espacoTituloPt),
    espaco(LAYOUT.espacoTituloPt),
    paragrafo("Prezado Senhor,"),
    paragrafo(
      "Venho informar através do presente que estamos retirando das dependências do condomínio o equipamento abaixo relacionado:",
      { recuo: true }
    ),
    espaco(),
    { tipo: "tabela-bens-4", bens: data.bens },
    {
      tipo: "rodape",
      alturaPt: 260,
      blocos: [
        paragrafo("Atenciosamente,"),
        espaco(LAYOUT.espacoTituloPt),
        espaco(LAYOUT.espacoTituloPt),
        paragrafo(data.nomeSignatario, { centralizado: true }),
        paragrafo(`RF: ${data.rfSignatario}`, { centralizado: true }),
        paragrafo(data.cargoSignatario, { centralizado: true }),
        paragrafo(data.setorSignatario, { centralizado: true }),
        espaco(LAYOUT.espacoTituloPt),
        espaco(LAYOUT.espacoTituloPt),
        paragrafo(`Ao ${data.destinatario}`, { centralizado: true }),
      ],
    },
  ];
}

function montarResponsabilidade(data: TermoResponsabilidadePayload): BlocoTermo[] {
  const marcadorPerfeito = "(   )";
  const marcadorProblemas = "(   )";

  const blocos: BlocoTermo[] = [
    paragrafo("TERMO DE RESPONSABILIDADE", {
      negrito: true,
      centralizado: true,
      tamanhoPt: LAYOUT.tituloPt,
    }),
    paragrafo("EMPRÉSTIMO DE EQUIPAMENTO", {
      negrito: true,
      centralizado: true,
      tamanhoPt: LAYOUT.subtituloPt,
    }),
    espaco(LAYOUT.espacoTituloPt),
    paragrafo(`Solicitante: ${data.solicitante}`),
    paragrafo(`RF: ${data.rf}`),
    paragrafo(`Setor/ Unidade: ${data.setorUnidade}`),
    paragrafo(`Telefone: ${data.telefone}`),
    espaco(),
    paragrafo(`Número de Registro Patrimonial: ${data.patrimonio}`),
    paragrafo(`Tipo do Equipamento: ${data.tipoEquipamento}`),
    paragrafo(`Marca e Modelo: ${data.marcaModelo}`),
    paragrafo(`Número de Série: ${data.numeroSerie}`),
    espaco(),
    paragrafo(`Data de Retirada: ${data.dataRetirada}`),
    paragrafo(`Data de Devolução: ${data.dataDevolucao || "______________________"}`),
    paragrafo(`Objetivo de Uso: ${data.objetivoUso}`),
    paragrafo(`Local de Uso: ${data.localUso}`),
    espaco(),
    paragrafo(
      "Declaro estar ciente de que é minha responsabilidade manter o equipamento em perfeito estado de conservação e me comprometo a pagar o valor correspondente caso danifique ou perca por uso inadequado, negligência ou extravio, hipóteses em que comunicarei imediatamente a Prefeitura de São Paulo. Afirmo ter verificado, antes da retirada, que o equipamento se encontrava:"
    ),
    paragrafo(`${marcadorPerfeito} Em perfeitas condições de uso e bom estado de conservação`),
    paragrafo(`${marcadorProblemas} Com os seguintes problemas e/ ou danos (descrevê-los):`),
    espaco(),
  ];

  if (!data.condicaoPerfeita) {
    blocos.push(
      paragrafo(data.problemasDescricao || "____________________________________________________________________")
    );
  } else {
    blocos.push(espaco(), espaco(), espaco());
    blocos.push(paragrafo("____________________________________________________________________"));
  }

  blocos.push(
    espaco(LAYOUT.espacoTituloPt),
    espaco(LAYOUT.espacoTituloPt),
    paragrafo(
      `${data.dataCidade}, ${data.dataDia} de ${data.dataMes} de ${data.dataAno}`,
      { centralizado: true }
    )
  );

  return blocos;
}

export function montarBlocosTermo(payload: TermoPayload): BlocoTermo[] {
  switch (payload.tipo) {
    case "entrega":
      return montarEntrega(payload);
    case "oficio-saida":
      return montarOficio(payload);
    case "responsabilidade":
      return montarResponsabilidade(payload);
    default:
      throw new Error("Tipo de termo inválido");
  }
}

export function linhasVaziasBens2(qtdItens: number): [string, string, string][] {
  return linhasVaziasTabela(qtdItens);
}

export function linhasVaziasBens4(qtdItens: number): [string, string, string, string][] {
  return linhasVaziasTabela4(qtdItens);
}
