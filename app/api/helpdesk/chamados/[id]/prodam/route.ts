import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import { textoStatusProdam } from "@/lib/helpdesk/eventos";
import { textoMotivoProdam } from "@/lib/helpdesk/prodam";
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
        { error: "Apenas técnicos podem enviar para a PRODAM" },
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

    const chamadoAtual = await prisma.hdChamado.findUnique({
      where: { id: chamadoId },
      select: { status: true },
    });
    if (!chamadoAtual) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }
    const statusAtual = String(chamadoAtual.status);
    if (statusAtual === "fechado" || statusAtual === "resolvido") {
      return NextResponse.json(
        { error: "Chamado encerrado — não pode ser enviado para PRODAM" },
        { status: 400 }
      );
    }
    if (statusAtual === "prodam") {
      return NextResponse.json(
        { error: "Chamado já está em Aguardando PRODAM" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    if (!texto) {
      return NextResponse.json(
        { error: "Informe o motivo do envio para a PRODAM" },
        { status: 400 }
      );
    }

    const agora = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.hdChamado.update({
        where: { id: chamadoId },
        data: {
          status: "prodam" as any,
        },
      });

      await tx.hdChamadoEvento.create({
        data: {
          chamadoId,
          tipo: "statusAlterado",
          autorId: usuario.id,
          texto: textoStatusProdam(usuario.nome),
        },
      });

      await tx.hdMensagem.create({
        data: {
          chamadoId,
          autorId: usuario.id,
          texto: textoMotivoProdam(texto),
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

    return NextResponse.json({ chamado: mapChamadoApi(completo, uuidToNum, sessao.isStaff) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/prodam POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
