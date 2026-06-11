import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { podeGerenciarAcessoSistemasHelpdesk } from "@/lib/permissoes";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessao = await getSessaoHelpdesk();
  if ("error" in sessao) {
    return NextResponse.json({ error: sessao.error }, { status: sessao.status });
  }
  if (!podeGerenciarAcessoSistemasHelpdesk(sessao.usuario.permissao)) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id } = await params;
  const pontoId = parseInt(id, 10);
  if (Number.isNaN(pontoId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await request.json();
  const ativo = typeof body.ativo === "boolean" ? body.ativo : undefined;
  if (ativo === undefined) {
    return NextResponse.json({ error: "Campo ativo é obrigatório" }, { status: 400 });
  }

  const atualizado = await prisma.hdPontoFocalUnidade.update({
    where: { id: pontoId },
    data: { ativo },
  });

  return NextResponse.json({ pontoFocal: atualizado });
}
