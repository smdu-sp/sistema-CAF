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

  const permissoes = await prisma.hdSistemaPermissao.findMany({
    include: { sistema: true },
    orderBy: [{ sistema: { nome: "asc" } }, { nome: "asc" }],
  });

  return NextResponse.json({
    permissoes: permissoes.map((p) => ({
      id: p.id,
      sistemaId: p.sistemaId,
      sistema: p.sistema.nome,
      nome: p.nome,
      descricao: p.descricao,
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
  const sistemaId = Number(body.sistemaId);
  const nome = typeof body.nome === "string" ? body.nome.trim() : "";
  const descricao =
    typeof body.descricao === "string" ? body.descricao.trim() : null;

  if (!sistemaId || !nome) {
    return NextResponse.json({ error: "Sistema e nome são obrigatórios" }, { status: 400 });
  }

  const criada = await prisma.hdSistemaPermissao.create({
    data: { sistemaId, nome, descricao, ativo: true },
    include: { sistema: true },
  });

  return NextResponse.json({ permissao: criada }, { status: 201 });
}
