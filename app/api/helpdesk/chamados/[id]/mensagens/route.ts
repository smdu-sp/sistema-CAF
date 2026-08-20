import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import {
  chamadoInclude,
  collectUserIdsFromChamados,
  mapChamadoApi,
} from "@/lib/helpdesk/mappers";
import { getHelpdeskUserIdMaps } from "@/lib/helpdesk/user-id-maps";
import { getSessaoHelpdesk, isStaffPerfil } from "@/lib/helpdesk/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessao = await getSessaoHelpdesk();
    if ("error" in sessao) {
      return NextResponse.json({ error: sessao.error }, { status: sessao.status });
    }

    const { usuario, perfil, isStaff } = sessao;
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
      select: { status: true },
    });
    if (!chamadoAtual) {
      return NextResponse.json({ error: "Chamado não encontrado" }, { status: 404 });
    }
    if (chamadoAtual.status === "fechado" || chamadoAtual.status === "resolvido") {
      return NextResponse.json(
        { error: "Chamado encerrado — não é possível enviar mensagens" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const texto = typeof body.texto === "string" ? body.texto.trim() : "";
    let tipo = body.tipo === "interna" ? "interna" : "publica";

    if (!texto) {
      return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
    }

    if (tipo === "interna" && !isStaffPerfil(perfil)) {
      return NextResponse.json(
        { error: "Notas internas são apenas para técnicos" },
        { status: 403 }
      );
    }

    if (!isStaff && tipo === "interna") {
      tipo = "publica";
    }

    await prisma.hdMensagem.create({
      data: {
        chamadoId,
        autorId: usuario.id,
        texto,
        tipo: tipo as "publica" | "interna",
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
    console.error("[helpdesk/chamados/mensagens POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
