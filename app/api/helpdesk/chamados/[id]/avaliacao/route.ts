import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import { textoAvaliacao } from "@/lib/helpdesk/eventos";
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

    const { usuario, isStaff } = sessao;
    const { id: idParam } = await params;
    const chamadoId = parseInt(idParam, 10);
    if (Number.isNaN(chamadoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const pode = await usuarioPodeAcessarChamado(chamadoId, usuario.id, isStaff);
    if (!pode) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const avaliacao = Number(body.avaliacao);
    if (!Number.isInteger(avaliacao) || avaliacao < 1 || avaliacao > 5) {
      return NextResponse.json({ error: "A avaliação deve ser de 1 a 5 estrelas" }, { status: 400 });
    }

    const chamadoAtual = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      select: {
        status: true,
        solicitanteId: true,
        abertoEmNomeDeId: true,
      },
    });
    if (!chamadoAtual) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    if (chamadoAtual.status !== "fechado") {
      return NextResponse.json(
        { error: "A avaliação só pode ser enviada para chamados fechados" },
        { status: 400 }
      );
    }

    const isResponsavel =
      usuario.id === chamadoAtual.solicitanteId || usuario.id === chamadoAtual.abertoEmNomeDeId;
    if (!isStaff && !isResponsavel) {
      return NextResponse.json(
        { error: "Somente o solicitante pode avaliar este chamado" },
        { status: 403 }
      );
    }

    await prisma.hdChamadoEvento.create({
      data: {
        chamadoId,
        tipo: "statusAlterado",
        autorId: usuario.id,
        texto: textoAvaliacao(usuario.nome, avaliacao),
      },
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

    return NextResponse.json({ chamado: mapChamadoApi(completo, uuidToNum, isStaff) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/avaliacao POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
