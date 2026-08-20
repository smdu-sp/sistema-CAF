import { NextRequest, NextResponse } from "next/server";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";
import { listarUnidadesParaImpressao } from "@/lib/gestao-pessoas/servidores";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeImprimir) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const mes = Number(request.nextUrl.searchParams.get("mes"));
  const ano = Number(request.nextUrl.searchParams.get("ano"));

  if (!mes || !ano) {
    return NextResponse.json({ error: "Informe mês e ano" }, { status: 400 });
  }

  const { carga, unidades } = await listarUnidadesParaImpressao(
    mes,
    ano,
    sessao.acesso
  );

  return NextResponse.json({
    disponivel: Boolean(carga),
    unidades,
  });
}
