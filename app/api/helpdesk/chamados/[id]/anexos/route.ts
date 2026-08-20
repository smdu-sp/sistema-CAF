import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { usuarioPodeAcessarChamado } from "@/lib/helpdesk/acesso";
import { salvarAnexoHelpdesk } from "@/lib/helpdesk/upload-anexo";
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

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo é obrigatório" }, { status: 400 });
    }

    const mensagemRaw = formData.get("mensagemId");
    const mensagemId =
      typeof mensagemRaw === "string" && mensagemRaw.trim()
        ? parseInt(mensagemRaw, 10)
        : null;

    if (mensagemId && !Number.isNaN(mensagemId)) {
      const msg = await prisma.hdMensagem.findFirst({
        where: { id: mensagemId, chamadoId },
      });
      if (!msg) {
        return NextResponse.json({ error: "Mensagem não encontrada" }, { status: 400 });
      }
    }

    const meta = await salvarAnexoHelpdesk(file);

    const anexo = await prisma.hdAnexo.create({
      data: {
        chamadoId,
        mensagemId: mensagemId && !Number.isNaN(mensagemId) ? mensagemId : null,
        autorId: usuario.id,
        nomeArquivo: meta.nomeArquivo,
        urlArquivo: meta.urlArquivo,
        tipoMime: meta.tipoMime,
        tamanho: meta.tamanho,
      },
    });

    return NextResponse.json({
      anexo: {
        id: anexo.id,
        nomeArquivo: anexo.nomeArquivo,
        urlArquivo: anexo.urlArquivo,
        tipoMime: anexo.tipoMime,
        tamanho: anexo.tamanho,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[helpdesk/chamados/anexos POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
