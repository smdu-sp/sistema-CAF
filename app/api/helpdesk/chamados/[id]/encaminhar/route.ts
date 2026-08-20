import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  textoEncaminhamento,
  textoMotivoEncaminhamento,
} from "@/lib/helpdesk/eventos";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getSessaoHelpdesk } from "@/lib/helpdesk/session";
import {
  isTipoChamado,
  labelTipoChamado,
  type TipoChamado,
} from "@/lib/helpdesk/tipos-chamado";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import type { HdTipoChamado } from "@/prisma/generated";

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
        { error: "Apenas técnicos podem encaminhar chamados" },
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
    const areaParaRaw =
      typeof body.areaPara === "string" ? body.areaPara.trim() : "";
    const motivo = typeof body.motivo === "string" ? body.motivo.trim() : "";

    if (!isTipoChamado(areaParaRaw)) {
      return NextResponse.json({ error: "Área de destino inválida" }, { status: 400 });
    }
    if (!motivo) {
      return NextResponse.json(
        { error: "Informe o motivo do encaminhamento" },
        { status: 400 }
      );
    }

    const areaPara = areaParaRaw as TipoChamado;

    const chamadoAtual = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      select: { status: true, areaAtual: true },
    });
    if (!chamadoAtual) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }

    const statusAtual = String(chamadoAtual.status);
    if (statusAtual === "fechado" || statusAtual === "resolvido") {
      return NextResponse.json(
        { error: "Chamado encerrado — não pode ser encaminhado" },
        { status: 400 }
      );
    }

    const areaDe = chamadoAtual.areaAtual as TipoChamado;
    if (areaDe === areaPara) {
      return NextResponse.json(
        { error: "O chamado já está nesta área" },
        { status: 400 }
      );
    }

    const areaDeLabel = labelTipoChamado(areaDe);
    const areaParaLabel = labelTipoChamado(areaPara);

    await prisma.$transaction(async (tx) => {
      await tx.hdChamado.update({
        where: { id: chamadoId },
        data: {
          areaAtual: areaPara as HdTipoChamado,
          status: statusAtual === "prodam" ? "aberto" : (chamadoAtual.status as any),
        },
      });

      await tx.hdChamadoEncaminhamento.create({
        data: {
          chamadoId,
          areaDe: areaDe as HdTipoChamado,
          areaPara: areaPara as HdTipoChamado,
          motivo,
          autorId: usuario.id,
        },
      });

      await tx.hdChamadoUsuario.deleteMany({
        where: { chamadoId, papel: "tecnico" },
      });

      await tx.hdChamadoEvento.create({
        data: {
          chamadoId,
          tipo: "encaminhamento",
          autorId: usuario.id,
          texto: textoEncaminhamento(usuario.nome, areaDeLabel, areaParaLabel),
        },
      });

      await tx.hdMensagem.create({
        data: {
          chamadoId,
          autorId: usuario.id,
          texto: textoMotivoEncaminhamento(motivo),
          tipo: "interna",
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

    return NextResponse.json({
      chamado: mapChamadoApi(completo, uuidToNum, sessao.isStaff),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/encaminhar POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
