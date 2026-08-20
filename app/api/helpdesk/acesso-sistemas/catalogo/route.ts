import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import { usuarioEhPontoFocal, unidadesDoPontoFocal } from "@/lib/helpdesk/acesso-sistemas/ponto-focal";
import { usuarioEhAutorizadorAcesso } from "@/lib/helpdesk/acesso-sistemas/autorizador";
import { listarUnidadesAtivasHelpdesk } from "@/lib/helpdesk/unidade";

export async function GET() {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const [sistemas, ehPontoFocal, ehAutorizador, unidades, unidadesPontoFocal] = await Promise.all([
      prisma.hdSistemaAcesso.findMany({
        where: { ativo: true },
        include: {
          permissoes: {
            where: { ativo: true },
            orderBy: { nome: "asc" },
          },
        },
        orderBy: { nome: "asc" },
      }),
      usuarioEhPontoFocal(sessao.usuario.id),
      usuarioEhAutorizadorAcesso(sessao.usuario.id),
      listarUnidadesAtivasHelpdesk(),
      unidadesDoPontoFocal(sessao.usuario.id),
    ]);

    return NextResponse.json({
      sistemas: sistemas.map((s) => ({
        id: s.id,
        codigo: s.codigo,
        nome: s.nome,
        permissoes: s.permissoes.map((p) => ({
          id: p.id,
          nome: p.nome,
          descricao: p.descricao,
        })),
      })),
      ehPontoFocal: ehPontoFocal || sessao.isStaff,
      ehAutorizador,
      unidades,
      unidadesPontoFocal,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
