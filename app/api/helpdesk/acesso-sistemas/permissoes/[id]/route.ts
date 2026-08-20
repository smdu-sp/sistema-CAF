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
  const permissaoId = parseInt(id, 10);
  if (Number.isNaN(permissaoId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await request.json();
  const data: { nome?: string; descricao?: string | null; ativo?: boolean } = {};
  if (typeof body.nome === "string" && body.nome.trim()) data.nome = body.nome.trim();
  if (body.descricao !== undefined) {
    data.descricao =
      typeof body.descricao === "string" ? body.descricao.trim() || null : null;
  }
  if (typeof body.ativo === "boolean") data.ativo = body.ativo;

  const atualizada = await prisma.hdSistemaPermissao.update({
    where: { id: permissaoId },
    data,
    include: { sistema: true },
  });

  return NextResponse.json({ permissao: atualizada });
}
