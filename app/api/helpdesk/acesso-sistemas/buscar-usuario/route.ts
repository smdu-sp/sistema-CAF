import { NextRequest, NextResponse } from "next/server";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { buscarUsuarioSguPorLogin, buscarUsuarioSguPorRf } from "@/lib/sgu/responsaveis";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const sessao = await getSessaoHelpdesk();
  if ("error" in sessao) {
    return NextResponse.json({ error: sessao.error }, { status: sessao.status });
  }

  const rf = request.nextUrl.searchParams.get("rf")?.trim();
  const login = request.nextUrl.searchParams.get("login")?.trim();

  let dados = null;
  if (login) dados = await buscarUsuarioSguPorLogin(login);
  else if (rf) dados = await buscarUsuarioSguPorRf(rf);

  if (!dados && login) {
    const local = await prisma.usuario.findFirst({
      where: { login: login.toLowerCase(), status: true },
      select: { id: true, nome: true, login: true, email: true },
    });
    if (local) {
      return NextResponse.json({
        usuario: {
          id: local.id,
          nome: local.nome,
          rf: local.login,
          login: local.login,
          email: local.email,
        },
        fonte: "local",
      });
    }
  }

  if (!dados) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  let localId: string | null = null;
  if (dados.login) {
    const local = await prisma.usuario.findFirst({
      where: { login: dados.login, status: true },
      select: { id: true, email: true },
    });
    localId = local?.id ?? null;
  }

  return NextResponse.json({
    usuario: {
      id: localId,
      nome: dados.nome,
      rf: dados.rf || rf || login,
      login: dados.login,
      setor: dados.setor,
      siglaUnidade: dados.siglaUnidade,
    },
    fonte: "sgu",
  });
}
