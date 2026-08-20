import { join } from "path";
import pdfMake from "pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { formatarDataBr } from "./datas";

const NOME_SECRETARIA =
  "29 - SECRETARIA MUNICIPAL DE URBANISMO E LICENCIAMENTO";

let pdfInicializado = false;
let brasaoPath = "";

function inicializarPdfMake() {
  if (pdfInicializado) return;
  const pdf = pdfMake as typeof pdfMake & {
    virtualfs: { writeFileSync: (nome: string, dados: string, encoding: string) => void };
    setFonts: (fonts: unknown) => void;
    setLocalAccessPolicy: (fn: () => boolean) => void;
  };
  for (const [nome, dados] of Object.entries(vfsFonts as Record<string, string>)) {
    pdf.virtualfs.writeFileSync(nome, dados, "base64");
  }
  pdf.setFonts({
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  });
  pdf.setLocalAccessPolicy(() => true);
  brasaoPath = join(process.cwd(), "public", "brasao.png");
  pdfInicializado = true;
}

export type LinhaRelatorio = {
  data: Date;
  servidorNome: string;
  servidorRf: string;
  atividades: string;
  pontuacao: number;
  processos: string | null;
  observacoes: string | null;
};

export async function gerarPdfRelatorioMensal(params: {
  titulo: string;
  unidade: string;
  competencia: string;
  linhas: LinhaRelatorio[];
}): Promise<Buffer> {
  inicializarPdfMake();

  const cabecalho: Content = {
    stack: [
      { image: "brasao", width: 120, alignment: "center", margin: [0, 0, 0, 4] },
      { text: NOME_SECRETARIA, bold: true, fontSize: 9, alignment: "center" },
      { text: params.titulo, bold: true, fontSize: 11, alignment: "center", margin: [0, 8, 0, 2] },
      { text: `${params.unidade} — ${params.competencia}`, fontSize: 9, alignment: "center", margin: [0, 0, 0, 10] },
    ],
  };

  const body: Content[][] = [
    [
      { text: "Data", bold: true, fontSize: 8 },
      { text: "Servidor", bold: true, fontSize: 8 },
      { text: "Atividades", bold: true, fontSize: 8 },
      { text: "Pts", bold: true, fontSize: 8 },
      { text: "Processos / obs.", bold: true, fontSize: 8 },
    ],
  ];

  for (const linha of params.linhas) {
    body.push([
      { text: formatarDataBr(linha.data), fontSize: 8 },
      { text: `${linha.servidorNome}\nRF ${linha.servidorRf}`, fontSize: 8 },
      { text: linha.atividades || "—", fontSize: 7 },
      { text: String(linha.pontuacao), fontSize: 8, alignment: "center" },
      { text: [linha.processos, linha.observacoes].filter(Boolean).join("\n") || "—", fontSize: 7 },
    ]);
  }

  if (params.linhas.length === 0) {
    body.push([
      { text: "Nenhum registro validado nesta competência.", fontSize: 8 },
      { text: "" },
      { text: "" },
      { text: "" },
      { text: "" },
    ]);
  }

  const doc: TDocumentDefinitions = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [30, 30, 30, 30],
    images: { brasao: brasaoPath },
    content: [
      cabecalho,
      {
        table: {
          headerRows: 1,
          widths: [60, 120, "*", 30, 140],
          body,
        },
        layout: {
          hLineWidth: () => 0.4,
          vLineWidth: () => 0.4,
        },
      },
    ],
  };

  return pdfMake.createPdf(doc).getBuffer();
}

function escaparXml(valor: string): string {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function gerarPlanilhaRelatorioMensal(params: {
  titulo: string;
  unidade: string;
  competencia: string;
  linhas: LinhaRelatorio[];
}): Buffer {
  const rows = params.linhas
    .map((l) => {
      const cells = [
        formatarDataBr(l.data),
        l.servidorNome,
        l.servidorRf,
        l.atividades,
        String(l.pontuacao),
        l.processos ?? "",
        l.observacoes ?? "",
      ]
        .map((c) => `<Cell><Data ss:Type="String">${escaparXml(c)}</Data></Cell>`)
        .join("");
      return `<Row>${cells}</Row>`;
    })
    .join("");

  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="Relatorio">
<Table>
<Row><Cell><Data ss:Type="String">${escaparXml(params.titulo)}</Data></Cell></Row>
<Row><Cell><Data ss:Type="String">${escaparXml(`${params.unidade} — ${params.competencia}`)}</Data></Cell></Row>
<Row></Row>
<Row>
<Cell><Data ss:Type="String">Data</Data></Cell>
<Cell><Data ss:Type="String">Servidor</Data></Cell>
<Cell><Data ss:Type="String">RF</Data></Cell>
<Cell><Data ss:Type="String">Atividades</Data></Cell>
<Cell><Data ss:Type="String">Pontuação</Data></Cell>
<Cell><Data ss:Type="String">Processos</Data></Cell>
<Cell><Data ss:Type="String">Observações</Data></Cell>
</Row>
${rows}
</Table>
</Worksheet>
</Workbook>`;

  return Buffer.from(xml, "utf-8");
}
