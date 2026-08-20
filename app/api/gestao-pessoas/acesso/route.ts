import { NextResponse } from "next/server";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";

export async function GET() {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  return NextResponse.json(sessao.acesso);
}
