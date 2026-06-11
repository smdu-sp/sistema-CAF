import { readFileSync } from "fs";
import { join } from "path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import {
  LAYOUT,
  linhasVaziasBens2,
  linhasVaziasBens4,
  montarBlocosTermo,
  type BlocoTermo,
} from "./termos-conteudo";
import { NOME_SECRETARIA } from "./termos-types";
import type { TermoPayload } from "./termos-types";

let brasaoCache: Buffer | null = null;

function lerBrasao(): Buffer {
  if (!brasaoCache) {
    brasaoCache = readFileSync(join(process.cwd(), "public", "brasao.png"));
  }
  return brasaoCache;
}

function ptDocx(pt: number): number {
  return pt * 2;
}

function margemDocx(pt: number): number {
  return pt * 20;
}

const SEM_BORDA = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const BORDA_TABELA = {
  top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
};

function criarCabecalhoDocumento(): Header {
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          ...SEM_BORDA,
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 14, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                borders: SEM_BORDA,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new ImageRun({
                        type: "png",
                        data: lerBrasao(),
                        transformation: {
                          width: LAYOUT.brasaoLargura,
                          height: LAYOUT.brasaoAltura,
                        },
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 86, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                borders: SEM_BORDA,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    children: [
                      new TextRun({
                        text: NOME_SECRETARIA,
                        bold: true,
                        size: ptDocx(LAYOUT.secretariaPt),
                        font: LAYOUT.fonte,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function cell(
  text: string,
  opts: { bold?: boolean; width?: number; center?: boolean; minHeight?: number; shade?: boolean } = {}
): TableCell {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [
        new TextRun({
          text,
          bold: opts.bold,
          size: ptDocx(LAYOUT.corpoPt),
          font: LAYOUT.fonte,
        }),
      ],
    }),
  ];

  if (opts.minHeight) {
    for (let i = 0; i < opts.minHeight - 1; i++) {
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: "" })] }));
    }
  }

  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    borders: BORDA_TABELA,
    shading: opts.shade ? { fill: "D9D9D9", val: ShadingType.CLEAR, color: "auto" } : undefined,
    children: paragraphs,
  });
}

function paragrafoDocx(bloco: Extract<BlocoTermo, { tipo: "paragrafo" }>): Paragraph {
  const tamanho = bloco.tamanhoPt ?? LAYOUT.corpoPt;
  return new Paragraph({
    alignment: bloco.centralizado ? AlignmentType.CENTER : AlignmentType.BOTH,
    indent: bloco.recuo ? { firstLine: margemDocx(18) } : undefined,
    spacing: { after: margemDocx(LAYOUT.espacoParagrafoPt) },
    children: [
      new TextRun({
        text: bloco.texto,
        bold: bloco.negrito,
        size: ptDocx(tamanho),
        font: LAYOUT.fonte,
      }),
    ],
  });
}

function espacoDocx(bloco: Extract<BlocoTermo, { tipo: "espaco" }>): Paragraph {
  return new Paragraph({
    spacing: { after: margemDocx(bloco.alturaPt ?? LAYOUT.espacoParagrafoPt) },
    children: [new TextRun({ text: "" })],
  });
}

function tabelaBens2Docx(bloco: Extract<BlocoTermo, { tipo: "tabela-bens-2" }>): Table {
  const vazias = linhasVaziasBens2(bloco.bens.length);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell("Nº PATRIMONIAL", { bold: true, width: 25, shade: true }),
          cell("Nº DE SÉRIE", { bold: true, width: 25, shade: true }),
          cell("DESCRIÇÃO DO BEM", { bold: true, width: 50, shade: true }),
        ],
      }),
      ...bloco.bens.map(
        (b) =>
          new TableRow({
            children: [
              cell(b.patrimonio, { width: 25 }),
              cell(b.serviceTag ?? "", { width: 25 }),
              cell(b.descricao, { width: 50 }),
            ],
          })
      ),
      ...vazias.map(
        ([a, b, c]) =>
          new TableRow({
            children: [cell(a, { width: 25, minHeight: 1 }), cell(b, { width: 25, minHeight: 1 }), cell(c, { width: 50, minHeight: 1 })],
          })
      ),
    ],
  });
}

function tabelaBens4Docx(bloco: Extract<BlocoTermo, { tipo: "tabela-bens-4" }>): Table {
  const vazias = linhasVaziasBens4(bloco.bens.length);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell("NÚMERO PATRIMÔNIO", { bold: true, width: 25, shade: true }),
          cell("DESCRIÇÃO", { bold: true, width: 35, shade: true }),
          cell("SERVICE TAG", { bold: true, width: 25, shade: true }),
          cell("QTDE", { bold: true, width: 15, center: true, shade: true }),
        ],
      }),
      ...bloco.bens.map(
        (b) =>
          new TableRow({
            children: [
              cell(b.patrimonio, { width: 25 }),
              cell(b.descricao, { width: 35 }),
              cell(b.serviceTag ?? "", { width: 25 }),
              cell(String(b.quantidade ?? 1), { width: 15, center: true }),
            ],
          })
      ),
      ...vazias.map(
        ([a, b, c, d]) =>
          new TableRow({
            children: [
              cell(a, { width: 25, minHeight: 1 }),
              cell(b, { width: 35, minHeight: 1 }),
              cell(c, { width: 25, minHeight: 1 }),
              cell(d, { width: 15, minHeight: 1, center: true }),
            ],
          })
      ),
    ],
  });
}

function tabela2ColunasDocx(bloco: Extract<BlocoTermo, { tipo: "tabela-2colunas" }>): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: bloco.linhas.map(
      ([a, b]) =>
        new TableRow({
          children: [cell(a, { width: 50 }), cell(b, { width: 50 })],
        })
    ),
  });
}

function tabelaAssinaturasDocx(bloco: Extract<BlocoTermo, { tipo: "tabela-assinaturas" }>): Table {
  function cellAssinatura(rotulo: string): TableCell {
    return new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: SEM_BORDA,
      children: [
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000", space: 4 } },
          spacing: { before: margemDocx(20), after: margemDocx(4) },
          children: [new TextRun({ text: "" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: margemDocx(LAYOUT.espacoParagrafoPt) },
          children: [new TextRun({ text: rotulo, bold: true, size: ptDocx(LAYOUT.corpoPt), font: LAYOUT.fonte })],
        }),
      ],
    });
  }
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      ...SEM_BORDA,
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [cellAssinatura(bloco.rotulos[0]), cellAssinatura(bloco.rotulos[1])],
      }),
    ],
  });
}

function renderBlocoDocx(bloco: BlocoTermo): (Paragraph | Table)[] {
  switch (bloco.tipo) {
    case "paragrafo":
      return [paragrafoDocx(bloco)];
    case "espaco":
      return [espacoDocx(bloco)];
    case "tabela-bens-2":
      return [tabelaBens2Docx(bloco)];
    case "tabela-bens-4":
      return [tabelaBens4Docx(bloco)];
    case "tabela-2colunas":
      return [tabela2ColunasDocx(bloco)];
    case "tabela-assinaturas":
      return [tabelaAssinaturasDocx(bloco)];
    case "rodape":
      // A4 em twips ≈ 16838; margens 90+40 → corpo ≈ 14708; estimativa do rodapé ≈ 3800 twips
      return [
        new Paragraph({
          spacing: { before: margemDocx(300) },
          children: [new TextRun({ text: "" })],
        }),
        ...bloco.blocos.flatMap(renderBlocoDocx),
      ];
  }
}

function gerarDocumento(payload: TermoPayload): Document {
  const blocos = montarBlocosTermo(payload);
  const children = blocos.flatMap(renderBlocoDocx);

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: margemDocx(LAYOUT.margemTopoComCabecalhoPt),
              right: margemDocx(LAYOUT.margemPaginaPt),
              bottom: margemDocx(LAYOUT.margemPaginaPt),
              left: margemDocx(LAYOUT.margemPaginaPt),
            },
          },
        },
        headers: {
          default: criarCabecalhoDocumento(),
        },
        children,
      },
    ],
  });
}

export async function gerarDocumentoTermo(payload: TermoPayload): Promise<Buffer> {
  return Packer.toBuffer(gerarDocumento(payload));
}
