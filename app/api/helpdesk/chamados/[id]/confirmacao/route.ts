import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import { textoConfirmacaoSolucao, textoReabertura } from "@/lib/helpdesk/eventos";
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

    const chamadoAtual = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      select: {
        status: true,
        dataResolucao: true,
        solicitanteId: true,
        abertoEmNomeDeId: true,
      },
    });
    if (!chamadoAtual) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    if (chamadoAtual.status !== "resolvido") {
      return NextResponse.json(
        { error: "A confirmação só é permitida para chamados resolvidos" },
        { status: 400 }
      );
    }

    if (!chamadoAtual.dataResolucao) {
      return NextResponse.json(
        { error: "Data de resolução inválida para confirmação" },
        { status: 400 }
      );
    }

    const prazoLimite = chamadoAtual.dataResolucao.getTime() + 7 * 24 * 60 * 60 * 1000;
    if (Date.now() > prazoLimite) {
      return NextResponse.json(
        { error: "Prazo de confirmação expirado. O chamado foi fechado automaticamente." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const solucionado = Boolean(body.solucionado);
    const isResponsavel =
      usuario.id === chamadoAtual.solicitanteId || usuario.id === chamadoAtual.abertoEmNomeDeId;

    if (!isStaff && !isResponsavel) {
      return NextResponse.json(
        { error: "Somente o solicitante pode confirmar a solução do chamado" },
        { status: 403 }
      );
    }

    const agora = new Date();

    await prisma.$transaction(async (tx) => {
      if (solucionado) {
        await tx.hdChamado.update({
          where: { id: chamadoId },
          data: {
            status: "fechado",
            dataFechamento: agora,
          },
        });
        await tx.hdChamadoEvento.create({
          data: {
            chamadoId,
            tipo: "fechamento",
            autorId: usuario.id,
            texto: textoConfirmacaoSolucao(usuario.nome),
          },
        });
        return;
      }

      await tx.hdChamado.update({
        where: { id: chamadoId },
        data: {
          status: "aberto",
          resolucao: null,
          dataResolucao: null,
          dataFechamento: null,
        },
      });
      await tx.hdChamadoEvento.create({
        data: {
          chamadoId,
          tipo: "reabertura",
          autorId: usuario.id,
          texto: textoReabertura(usuario.nome),
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

    return NextResponse.json({ chamado: mapChamadoApi(completo, uuidToNum, isStaff) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/confirmacao POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
