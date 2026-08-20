import { join } from "path";
import pdfMake from "pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import {
  LAYOUT,
  linhasVaziasBens2,
  linhasVaziasBens4,
  montarBlocosTermo,
  type BlocoTermo,
} from "./termos-conteudo";
import { NOME_SECRETARIA } from "./termos-types";
import type { TermoPayload } from "./termos-types";

let pdfInicializado = false;
let brasaoPath = "";

function inicializarPdfMake() {
  if (pdfInicializado) return;
  for (const [nome, dados] of Object.entries(vfsFonts as Record<string, string>)) {
    pdfMake.virtualfs.writeFileSync(nome, dados, "base64");
  }
  pdfMake.setFonts({
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  });
  pdfMake.setLocalAccessPolicy(() => true);
  brasaoPath = join(process.cwd(), "public", "brasao.png");
  pdfInicializado = true;
}

const layoutTabela = {
  hLineWidth: () => 0.5,
  vLineWidth: () => 0.5,
  hLineColor: () => "#000000",
  vLineColor: () => "#000000",
  paddingLeft: () => 6,
  paddingRight: () => 6,
  paddingTop: () => 5,
  paddingBottom: () => 5,
};

function cabecalhoPdf(): Content {
  return {
    margin: [
      LAYOUT.margemPaginaPt,
      16,
      LAYOUT.margemPaginaPt,
      8,
    ],
    table: {
      widths: [LAYOUT.brasaoLargura + 4, "*"],
      body: [
        [
          {
            image: "brasao",
            width: LAYOUT.brasaoLargura,
            margin: [0, 2, 0, 0],
          },
          {
            stack: [
              {
                text: NOME_SECRETARIA,
                bold: true,
                fontSize: LAYOUT.secretariaPt,
                alignment: "center",
              },
            ],
            margin: [8, Math.round((LAYOUT.brasaoAltura - LAYOUT.secretariaPt) / 2), 8, 0],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingBottom: () => 8,
    },
  };
}

function celula(texto: string, opts: { bold?: boolean; alignment?: "left" | "center"; fillColor?: string } = {}) {
  return {
    text: texto,
    bold: opts.bold,
    alignment: opts.alignment ?? "left",
    fontSize: LAYOUT.corpoPt,
    margin: [0, 2, 0, 2],
    ...(opts.fillColor ? { fillColor: opts.fillColor } : {}),
  };
}

function paragrafoPdf(bloco: Extract<BlocoTermo, { tipo: "paragrafo" }>): Content {
  return {
    text: bloco.texto,
    bold: bloco.negrito,
    alignment: bloco.centralizado ? "center" : "justify",
    fontSize: bloco.tamanhoPt ?? LAYOUT.corpoPt,
    margin: [bloco.recuo ? 18 : 0, 0, 0, LAYOUT.espacoParagrafoPt],
  };
}

function espacoPdf(bloco: Extract<BlocoTermo, { tipo: "espaco" }>): Content {
  return { text: "", margin: [0, 0, 0, bloco.alturaPt ?? LAYOUT.espacoParagrafoPt] };
}

function tabelaBens2Pdf(bloco: Extract<BlocoTermo, { tipo: "tabela-bens-2" }>): Content {
  const vazias = linhasVaziasBens2(bloco.bens.length);
  return {
    table: {
      headerRows: 1,
      widths: ["25%", "25%", "50%"],
      body: [
        [
          celula("Nº PATRIMONIAL", { bold: true, fillColor: "#D9D9D9" }),
          celula("Nº DE SÉRIE", { bold: true, fillColor: "#D9D9D9" }),
          celula("DESCRIÇÃO DO BEM", { bold: true, fillColor: "#D9D9D9" }),
        ],
        ...bloco.bens.map((b) => [
          celula(b.patrimonio),
          celula(b.serviceTag ?? ""),
          celula(b.descricao),
        ]),
        ...vazias.map(([a, b, c]) => [celula(a), celula(b), celula(c)]),
      ],
    },
    layout: layoutTabela,
    margin: [0, 0, 0, LAYOUT.espacoParagrafoPt],
  };
}

function tabelaBens4Pdf(bloco: Extract<BlocoTermo, { tipo: "tabela-bens-4" }>): Content {
  const vazias = linhasVaziasBens4(bloco.bens.length);
  return {
    table: {
      headerRows: 1,
      widths: ["25%", "35%", "25%", "15%"],
      body: [
        [
          celula("NÚMERO PATRIMÔNIO", { bold: true, fillColor: "#D9D9D9" }),
          celula("DESCRIÇÃO", { bold: true, fillColor: "#D9D9D9" }),
          celula("SERVICE TAG", { bold: true, fillColor: "#D9D9D9" }),
          celula("QTDE", { bold: true, alignment: "center", fillColor: "#D9D9D9" }),
        ],
        ...bloco.bens.map((b) => [
          celula(b.patrimonio),
          celula(b.descricao),
          celula(b.serviceTag ?? ""),
          celula(String(b.quantidade ?? 1), { alignment: "center" }),
        ]),
        ...vazias.map(([a, b, c, d]) => [
          celula(a),
          celula(b),
          celula(c),
          celula(d, { alignment: "center" }),
        ]),
      ],
    },
    layout: layoutTabela,
    margin: [0, 0, 0, LAYOUT.espacoParagrafoPt],
  };
}

function tabela2ColunasPdf(bloco: Extract<BlocoTermo, { tipo: "tabela-2colunas" }>): Content {
  return {
    table: {
      widths: ["50%", "50%"],
      body: bloco.linhas.map(([a, b]) => [celula(a), celula(b)]),
    },
    layout: layoutTabela,
    margin: [0, 0, 0, LAYOUT.espacoParagrafoPt],
  };
}

function tabelaAssinaturasPdf(bloco: Extract<BlocoTermo, { tipo: "tabela-assinaturas" }>): Content {
  function coluna(rotulo: string) {
    return {
      stack: [
        { canvas: [{ type: "line", x1: 0, y1: 10, x2: 230, y2: 10, lineWidth: 0.5, lineColor: "#000000" }] },
        { text: rotulo, bold: true, fontSize: LAYOUT.corpoPt, alignment: "center", margin: [0, 6, 0, 0] },
      ],
    };
  }
  return {
    columns: [coluna(bloco.rotulos[0]), coluna(bloco.rotulos[1])],
    columnGap: 20,
    margin: [0, 0, 0, LAYOUT.espacoParagrafoPt],
  };
}

function renderBlocoPdf(bloco: BlocoTermo): Content {
  switch (bloco.tipo) {
    case "paragrafo":
      return paragrafoPdf(bloco);
    case "espaco":
      return espacoPdf(bloco);
    case "tabela-bens-2":
      return tabelaBens2Pdf(bloco);
    case "tabela-bens-4":
      return tabelaBens4Pdf(bloco);
    case "tabela-2colunas":
      return tabela2ColunasPdf(bloco);
    case "tabela-assinaturas":
      return tabelaAssinaturasPdf(bloco);
    case "rodape": {
      const alturaRodape = bloco.alturaPt ?? 190;
      const y = 841 - LAYOUT.margemPaginaPt - alturaRodape;
      const largura = 595 - 2 * LAYOUT.margemPaginaPt;
      return {
        absolutePosition: { x: LAYOUT.margemPaginaPt, y },
        width: largura,
        stack: bloco.blocos.map(renderBlocoPdf),
      };
    }
  }
}

function gerarDocumentoPdf(payload: TermoPayload): TDocumentDefinitions {
  const blocos = montarBlocosTermo(payload);
  return {
    defaultStyle: { font: LAYOUT.fontePdf, fontSize: LAYOUT.corpoPt },
    pageMargins: [
      LAYOUT.margemPaginaPt,
      LAYOUT.margemTopoComCabecalhoPt,
      LAYOUT.margemPaginaPt,
      LAYOUT.margemPaginaPt,
    ],
    images: { brasao: brasaoPath },
    header: () => cabecalhoPdf(),
    content: blocos.map(renderBlocoPdf),
  };
}

export async function gerarDocumentoTermoPdf(payload: TermoPayload): Promise<Buffer> {
  inicializarPdfMake();
  return pdfMake.createPdf(gerarDocumentoPdf(payload)).getBuffer();
}
