import { NextRequest, NextResponse } from "next/server";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";
import { gerarPdfFolhaPonto } from "@/lib/gestao-pessoas/gerar-folha-ponto-pdf";
import { buscarServidoresParaImpressao } from "@/lib/gestao-pessoas/servidores";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeImprimir) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const mes = Number(request.nextUrl.searchParams.get("mes"));
  const ano = Number(request.nextUrl.searchParams.get("ano"));
  const prefixo = request.nextUrl.searchParams.get("prefixo");
  const rf = request.nextUrl.searchParams.get("rf");

  if (!mes || !ano) {
    return NextResponse.json({ error: "Informe mês e ano" }, { status: 400 });
  }

  try {
    const servidores = await buscarServidoresParaImpressao(
      mes,
      ano,
      prefixo,
      rf,
      sessao.acesso
    );

    if (servidores.length === 0) {
      return NextResponse.json(
        { error: "Nenhum servidor encontrado para os filtros informados." },
        { status: 404 }
      );
    }

    const pdf = await gerarPdfFolhaPonto(servidores, mes, ano);
    const nomeArquivo = `FFI_${String(mes).padStart(2, "0")}_${ano}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${nomeArquivo}"`,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao gerar PDF";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
