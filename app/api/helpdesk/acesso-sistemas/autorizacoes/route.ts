import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import {
  filtroSolicitacoesParaAutorizador,
  usuarioEhAutorizadorAcesso,
} from "@/lib/helpdesk/acesso-sistemas/autorizador";

export async function GET(request: NextRequest) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const ehAutorizador =
      sessao.isStaff || (await usuarioEhAutorizadorAcesso(sessao.usuario.id));
    if (!ehAutorizador) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const status = request.nextUrl.searchParams.get("status") || "aguardando";
    const whereBase = sessao.isStaff
      ? {}
      : await filtroSolicitacoesParaAutorizador(sessao.usuario.id);

    const lista = await prisma.hdSolicitacaoAcesso.findMany({
      where: {
        ...whereBase,
        ...(status !== "todos" ? { statusAutorizacao: status as "aguardando" | "negado" | "autorizado" } : {}),
      },
      include: {
        sistema: true,
        permissao: true,
        unidade: true,
        coordenadoria: true,
        chamado: {
          select: {
            id: true,
            status: true,
            abertura: true,
            solicitante: { select: { nome: true, login: true } },
          },
        },
      },
      orderBy: { criadoEm: "desc" },
      take: 200,
    });

    return NextResponse.json({
      solicitacoes: lista.map((s) => ({
        id: s.id,
        chamadoId: s.chamadoId,
        statusChamado: s.chamado.status,
        abertura: s.chamado.abertura.toISOString(),
        solicitante: s.chamado.solicitante.nome,
        solicitanteRf: s.chamado.solicitante.login,
        nomeBeneficiario: s.nomeBeneficiario,
        rfBeneficiario: s.rfBeneficiario,
        sistema: s.sistema.nome,
        permissao: s.permissao.nome,
        unidade: s.unidade.nome,
        coordenadoria: s.coordenadoria?.nome ?? null,
        observacao: s.observacao,
        statusAutorizacao: s.statusAutorizacao,
        responsavelAutorizacaoNome: s.responsavelAutorizacaoNome,
        motivoNegacao: s.motivoNegacao,
        dataAutorizacao: s.dataAutorizacao?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
