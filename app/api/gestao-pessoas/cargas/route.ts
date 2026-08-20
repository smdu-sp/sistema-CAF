import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";

export async function GET() {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeVisualizar) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const cargas = await prisma.gpCargaMensal.findMany({
    orderBy: [{ ano: "desc" }, { mes: "desc" }],
    select: {
      id: true,
      mes: true,
      ano: true,
      totalRegistros: true,
      importadoEm: true,
      importadoPor: { select: { nome: true, login: true } },
    },
  });

  return NextResponse.json({ cargas });
}
