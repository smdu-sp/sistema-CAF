import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";
import { prefixoEh } from "@/lib/gestao-pessoas/constants";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeVisualizar) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const mes = Number(request.nextUrl.searchParams.get("mes"));
  const ano = Number(request.nextUrl.searchParams.get("ano"));
  const prefixo = request.nextUrl.searchParams.get("prefixo");

  const carga =
    mes && ano
      ? await prisma.gpCargaMensal.findUnique({
          where: { mes_ano: { mes, ano } },
        })
      : null;

  if (!carga) {
    const servidores = await prisma.gpServidor.findMany({
      where: { ultimaCarga: true },
      orderBy: [{ unidadeEh: "asc" }, { nome: "asc" }],
      take: 500,
    });
    return NextResponse.json({ servidores, fonte: "cadastro" });
  }

  const where: { cargaId: string; codigoEh?: { startsWith: string } } = {
    cargaId: carga.id,
  };

  if (prefixo) {
    if (
      !sessao.acesso.ehDgp &&
      !sessao.acesso.prefixosPermitidos.includes(prefixoEh(prefixo))
    ) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }
    where.codigoEh = { startsWith: prefixoEh(prefixo) };
  } else if (!sessao.acesso.ehDgp) {
    const prefixos = sessao.acesso.prefixosPermitidos;
    if (prefixos.length === 0) {
      return NextResponse.json({ servidores: [], fonte: "carga" });
    }
  }

  let vinculos = await prisma.gpServidorVinculo.findMany({
    where,
    orderBy: [{ codigoEh: "asc" }, { nome: "asc" }],
    take: 1000,
  });

  if (!prefixo && !sessao.acesso.ehDgp) {
    const prefixosSet = new Set(sessao.acesso.prefixosPermitidos);
    vinculos = vinculos.filter((v) => prefixosSet.has(prefixoEh(v.codigoEh)));
  }

  return NextResponse.json({ servidores: vinculos, fonte: "carga" });
}
