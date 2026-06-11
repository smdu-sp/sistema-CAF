import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { podeGerenciarAcessoSistemasHelpdesk } from "@/lib/permissoes";

export async function GET() {
  const sessao = await getSessaoHelpdesk();
  if ("error" in sessao) {
    return NextResponse.json({ error: sessao.error }, { status: sessao.status });
  }
  if (!podeGerenciarAcessoSistemasHelpdesk(sessao.usuario.permissao)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const lista = await prisma.hdPontoFocalUnidade.findMany({
    include: {
      unidade: { select: { id: true, nome: true, sigla: true } },
      usuario: { select: { id: true, nome: true, login: true, email: true } },
    },
    orderBy: [{ unidade: { nome: "asc" } }, { usuario: { nome: "asc" } }],
  });

  return NextResponse.json({
    pontosFocais: lista.map((p) => ({
      id: p.id,
      unidadeId: p.unidadeId,
      unidade: p.unidade.nome,
      usuarioId: p.usuarioId,
      usuario: p.usuario.nome,
      login: p.usuario.login,
      email: p.usuario.email,
      ativo: p.ativo,
    })),
  });
}

export async function POST(request: NextRequest) {
  const sessao = await getSessaoHelpdesk();
  if ("error" in sessao) {
    return NextResponse.json({ error: sessao.error }, { status: sessao.status });
  }
  if (!podeGerenciarAcessoSistemasHelpdesk(sessao.usuario.permissao)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const body = await request.json();
  const unidadeId = typeof body.unidadeId === "string" ? body.unidadeId.trim() : "";
  const usuarioId = typeof body.usuarioId === "string" ? body.usuarioId.trim() : "";

  if (!unidadeId || !usuarioId) {
    return NextResponse.json(
      { error: "Unidade e usuário são obrigatórios" },
      { status: 400 }
    );
  }

  const criado = await prisma.hdPontoFocalUnidade.upsert({
    where: { unidadeId_usuarioId: { unidadeId, usuarioId } },
    create: { unidadeId, usuarioId, ativo: true },
    update: { ativo: true },
    include: {
      unidade: true,
      usuario: { select: { nome: true, login: true } },
    },
  });

  return NextResponse.json({ pontoFocal: criado }, { status: 201 });
}
