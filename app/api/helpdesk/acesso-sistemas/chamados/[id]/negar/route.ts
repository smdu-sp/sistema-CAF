import { NextRequest, NextResponse } from "next/server";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { negarSolicitacaoAcesso } from "@/lib/helpdesk/acesso-sistemas/negar-solicitacao";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const { id } = await params;
    const chamadoId = parseInt(id, 10);
    if (Number.isNaN(chamadoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const motivo = typeof body.motivo === "string" ? body.motivo.trim() : "";
    if (!motivo) {
      return NextResponse.json({ error: "Informe o motivo da negativa" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
      request.nextUrl.origin;

    const chamado = await negarSolicitacaoAcesso({
      chamadoId,
      negadorId: sessao.usuario.id,
      negadorNome: sessao.usuario.nome,
      motivo,
      baseUrl,
    });

    return NextResponse.json({ chamado });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
