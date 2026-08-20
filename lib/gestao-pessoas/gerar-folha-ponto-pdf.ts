import { join } from "path";
import pdfMake from "pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import {
  DIAS_SEMANA,
  ehFeriado,
  obterFeriadosDoAno,
} from "./feriados";
import type { ServidorParaImpressao } from "./constants";

const NOME_SECRETARIA =
  "29 - SECRETARIA MUNICIPAL DE URBANISMO E LICENCIAMENTO";

/** Largura útil da página (A4 com margens 20/10 pt), equivalente ao width=700 do legado. */
const LARGURA_CONTEUDO = 515;

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
  paddingLeft: () => 3,
  paddingRight: () => 3,
  paddingTop: () => 3,
  paddingBottom: () => 3,
};

function cabecalhoSecretaria(): Content {
  return {
    stack: [
      {
        image: "brasao",
        width: 150,
        alignment: "center",
        margin: [0, 0, 0, 4],
      },
      {
        text: NOME_SECRETARIA,
        bold: true,
        fontSize: 9,
        alignment: "center",
        margin: [0, 0, 0, 6],
      },
    ],
  };
}

function tituloFfi(): Content {
  return {
    table: {
      widths: [LARGURA_CONTEUDO],
      body: [
        [
          {
            text: "FOLHA DE FREQUÊNCIA INDIVIDUAL - F. F. I.",
            bold: true,
            fontSize: 8,
            alignment: "center",
            fillColor: "#BDBDBD",
          },
        ],
      ],
    },
    layout: layoutTabela,
    margin: [0, 0, 0, 4],
  };
}

function dadosServidor(
  servidor: ServidorParaImpressao,
  mes: number,
  ano: number
): Content {
  const mesAno = `${String(mes).padStart(2, "0")}/${ano}`;
  return {
    table: {
      widths: [LARGURA_CONTEUDO],
      body: [
        [
          {
            text: [
              { text: " NOME: ", bold: true },
              servidor.nome,
              "\n",
              { text: "RF: ", bold: true },
              servidor.rf,
              { text: " - VÍNCULO:", bold: true },
              " ",
              servidor.vinculo ?? "",
              "\n",
              { text: "EH:", bold: true },
              " ",
              servidor.codigoEh,
              "\n",
              { text: "UNIDADE:", bold: true },
              " ",
              servidor.nomeUnidade,
              "\n",
              { text: "MÊS / ANO REFERENCIA:", bold: true },
              " ",
              mesAno,
            ],
            fontSize: 12,
            margin: [5, 5, 5, 5],
          },
        ],
      ],
    },
    layout: layoutTabela,
    margin: [0, 0, 0, 4],
  };
}

function linhaHorario(): Content {
  return {
    text: [
      { text: "HORÁRIO:", bold: true },
      " _______:_______ às _______:_______",
    ],
    fontSize: 8,
    alignment: "center",
    margin: [0, 0, 0, 4],
  };
}

function celulaDia(
  texto: string,
  opts: { bold?: boolean; cinza?: boolean; alinhamento?: "left" | "center" } = {}
): Content {
  return {
    text: texto,
    bold: opts.bold,
    fontSize: 7,
    alignment: opts.alinhamento ?? "center",
    fillColor: opts.cinza ? "#BDBDBD" : undefined,
    margin: [0, 2, 0, 2],
  };
}

function tabelaDias(mes: number, ano: number): Content {
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const feriados = obterFeriadosDoAno(ano);

  const header1 = [
    { text: "DIA", bold: true, fontSize: 8, alignment: "center" as const, fillColor: "#BDBDBD", rowSpan: 3 },
    { text: "HORÁRIO", bold: true, fontSize: 7, alignment: "center" as const, colSpan: 4, fillColor: "#BDBDBD" },
    {},
    {},
    {},
    { text: "ASSINATURA", bold: true, fontSize: 7, alignment: "center" as const, rowSpan: 3, fillColor: "#BDBDBD" },
    { text: "OBSERVAÇÕES", bold: true, fontSize: 7, alignment: "center" as const, rowSpan: 3, fillColor: "#BDBDBD" },
  ];

  const header2 = [
    {},
    { text: "ENTRADA", bold: true, fontSize: 8, alignment: "center" as const, rowSpan: 2, fillColor: "#BDBDBD" },
    { text: "ALMOÇO", bold: true, fontSize: 7, alignment: "center" as const, colSpan: 2, fillColor: "#BDBDBD" },
    {},
    { text: "SAÍDA", bold: true, fontSize: 7, alignment: "center" as const, rowSpan: 2, fillColor: "#BDBDBD" },
    {},
    {},
  ];

  const header3 = [
    {},
    {},
    { text: "SAÍDA", bold: true, fontSize: 8, alignment: "center" as const, fillColor: "#BDBDBD" },
    { text: "ENTRADA", bold: true, fontSize: 7, alignment: "center" as const, fillColor: "#BDBDBD" },
    {},
    {},
    {},
  ];

  const body: Content[][] = [header1, header2, header3] as Content[][];

  for (let dia = 1; dia <= 31; dia++) {
    const data = new Date(ano, mes - 1, dia);
    const diaSemana = DIAS_SEMANA[data.getDay()];
    const foraDoMes = dia > ultimoDia;
    const fimDeSemana = diaSemana === "DOMINGO" || diaSemana === "SÁBADO";
    const feriado = !foraDoMes && ehFeriado(data, feriados);
    const cinza = foraDoMes || fimDeSemana || feriado;
    const traco = " ------------- ";
    const obs = foraDoMes
      ? traco.trim()
      : feriado
        ? "FERIADO"
        : fimDeSemana
          ? diaSemana
          : "";

    body.push([
      celulaDia(String(dia), { bold: true, cinza }),
      celulaDia(foraDoMes ? traco : "", { cinza }),
      celulaDia(foraDoMes ? traco : "", { cinza }),
      celulaDia(foraDoMes ? traco : "", { cinza }),
      celulaDia(foraDoMes ? traco : "", { cinza }),
      celulaDia(foraDoMes ? traco : "", { cinza }),
      celulaDia(obs, { cinza, alinhamento: cinza && !foraDoMes ? "left" : "center" }),
    ]);
  }

  return {
    table: {
      widths: [28, 65, 65, 65, 65, 100, "*"],
      body,
    },
    layout: layoutTabela,
    margin: [0, 0, 0, 6],
  };
}

function blocoApontamento(): Content {
  const cols = ["EVENTO", "INÍCIO", "FINAL", "QUANT."];
  const header = [
    ...cols.map((c) => ({
      text: c,
      bold: true,
      fontSize: 7,
      alignment: "center" as const,
      fillColor: "#BDBDBD",
    })),
    ...cols.map((c) => ({
      text: c,
      bold: true,
      fontSize: 7,
      alignment: "center" as const,
      fillColor: "#BDBDBD",
    })),
  ];
  const linhasVazias = Array.from({ length: 6 }, () =>
    Array(8).fill({ text: " ", fontSize: 7, margin: [0, 4, 0, 4] })
  );
  return {
    table: {
      widths: Array(8).fill("*"),
      body: [
        [
          {
            text: "APONTAMENTO",
            bold: true,
            fontSize: 8,
            alignment: "center",
            colSpan: 8,
            fillColor: "#BDBDBD",
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
        ],
        header,
        ...linhasVazias,
      ],
    },
    layout: layoutTabela,
    margin: [0, 0, 0, 8],
  };
}

function assinaturaChefia(): Content {
  return {
    fontSize: 11,
    alignment: "center",
    margin: [0, 12, 0, 0],
    text: [
      "________________________________________________________\n",
      { text: "Carimbo e assinatura da Chefia Imediata", bold: true },
    ],
  };
}

function paginaServidor(
  servidor: ServidorParaImpressao,
  mes: number,
  ano: number
): Content[] {
  return [
    cabecalhoSecretaria(),
    tituloFfi(),
    dadosServidor(servidor, mes, ano),
    linhaHorario(),
    tabelaDias(mes, ano),
    blocoApontamento(),
    assinaturaChefia(),
  ];
}

export async function gerarPdfFolhaPonto(
  servidores: ServidorParaImpressao[],
  mes: number,
  ano: number
): Promise<Buffer> {
  inicializarPdfMake();

  const conteudo: Content[] = [];
  for (let i = 0; i < servidores.length; i++) {
    if (i > 0) conteudo.push({ text: "", pageBreak: "before" });
    conteudo.push(...paginaServidor(servidores[i], mes, ano));
  }

  const doc: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [20, 5, 10, 10],
    defaultStyle: { font: "Roboto", fontSize: 8 },
    images: { brasao: brasaoPath },
    content: conteudo,
  };

  return pdfMake.createPdf(doc).getBuffer();
}
