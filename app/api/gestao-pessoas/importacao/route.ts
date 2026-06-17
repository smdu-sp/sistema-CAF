import { NextRequest, NextResponse } from "next/server";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";
import { importarCargaSigpeg } from "@/lib/gestao-pessoas/importar-carga";

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeImportar) {
    return NextResponse.json({ error: "Sem permissão para importar" }, { status: 403 });
  }

  const form = await request.formData();
  const arquivo = form.get("arquivo");
  const mes = Number(form.get("mes"));
  const ano = Number(form.get("ano"));

  if (!(arquivo instanceof File)) {
    return NextResponse.json({ error: "Arquivo é obrigatório" }, { status: 400 });
  }
  if (!mes || mes < 1 || mes > 12 || !ano || ano < 2000) {
    return NextResponse.json({ error: "Mês e ano inválidos" }, { status: 400 });
  }

  const conteudo = await arquivo.text();

  try {
    const resultado = await importarCargaSigpeg(
      conteudo,
      mes,
      ano,
      sessao.usuario.id
    );
    return NextResponse.json(resultado);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro na importação";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
