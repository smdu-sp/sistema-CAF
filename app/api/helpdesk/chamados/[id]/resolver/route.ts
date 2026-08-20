import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import { textoResolucao } from "@/lib/helpdesk/eventos";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    if (!sessao.isStaff) {
      return NextResponse.json(
        { error: "Apenas técnicos podem resolver chamados" },
        { status: 403 }
      );
    }

    const { usuario } = sessao;
    const { id: idParam } = await params;
    const chamadoId = parseInt(idParam, 10);
    if (Number.isNaN(chamadoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const pode = await usuarioPodeAcessarChamado(chamadoId, usuario.id, true);
    if (!pode) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    if (!texto) {
      return NextResponse.json(
        { error: "Descreva a solução aplicada" },
        { status: 400 }
      );
    }

    const agora = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.hdChamado.update({
        where: { id: chamadoId },
        data: {
          status: "resolvido",
          resolucao: texto,
          dataResolucao: agora,
        },
      });

      await tx.hdChamadoEvento.create({
        data: {
          chamadoId,
          tipo: "resolucao",
          autorId: usuario.id,
          texto: textoResolucao(usuario.nome),
        },
      });

      await tx.hdMensagem.create({
        data: {
          chamadoId,
          autorId: usuario.id,
          texto,
          tipo: "solucao",
        },
      });
    });

    const completo = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      include: chamadoInclude,
    });

    if (!completo) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    const ids = collectUserIdsFromChamados([completo]);
    const { uuidToNum } = await getHelpdeskUserIdMaps(ids);

    return NextResponse.json({ chamado: mapChamadoApi(completo, uuidToNum, sessao.isStaff) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/resolver POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
