import { NextRequest, NextResponse } from "next/server";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { criarSolicitacaoAcesso } from "@/lib/helpdesk/acesso-sistemas/criar-solicitacao";

export async function POST(request: NextRequest) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const body = await request.json();
    const paraSiMesmo = body.paraSiMesmo !== false;
    const nomeBeneficiario =
      typeof body.nomeBeneficiario === "string" ? body.nomeBeneficiario.trim() : "";
    const rfBeneficiario =
      typeof body.rfBeneficiario === "string" ? body.rfBeneficiario.trim() : "";
    const sistemaId = Number(body.sistemaId);
    const permissaoId = Number(body.permissaoId);
    const unidadeId =
      typeof body.unidadeId === "string" ? body.unidadeId.trim() : "";
    const observacao =
      typeof body.observacao === "string" ? body.observacao.trim() : undefined;
    const beneficiarioUsuarioId =
      typeof body.beneficiarioUsuarioId === "string"
        ? body.beneficiarioUsuarioId.trim() || null
        : null;

    if (!nomeBeneficiario) {
      return NextResponse.json({ error: "Nome do beneficiário é obrigatório" }, { status: 400 });
    }
    if (!rfBeneficiario) {
      return NextResponse.json({ error: "RF é obrigatório" }, { status: 400 });
    }
    if (!sistemaId || Number.isNaN(sistemaId)) {
      return NextResponse.json({ error: "Sistema é obrigatório" }, { status: 400 });
    }
    if (!permissaoId || Number.isNaN(permissaoId)) {
      return NextResponse.json({ error: "Tipo de permissão é obrigatório" }, { status: 400 });
    }
    if (!unidadeId) {
      return NextResponse.json({ error: "Unidade é obrigatória" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
      request.nextUrl.origin;

    const chamado = await criarSolicitacaoAcesso({
      autorId: sessao.usuario.id,
      autorNome: sessao.usuario.nome,
      autorLogin: sessao.usuario.login,
      isStaff: sessao.isStaff,
      baseUrl,
      input: {
        paraSiMesmo,
        nomeBeneficiario,
        rfBeneficiario,
        beneficiarioUsuarioId,
        sistemaId,
        permissaoId,
        unidadeId,
        observacao,
        prioridade: body.prioridade,
      },
    });

    return NextResponse.json({ chamado }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
