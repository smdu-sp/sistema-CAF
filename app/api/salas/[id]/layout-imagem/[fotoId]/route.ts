import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import {
  isCaminhoUploadSalaSeguro,
  removerArquivoLayoutImagem,
} from "@/lib/sala-layout-imagem";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; fotoId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  if (usuario?.permissao !== "ADM" && usuario?.permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id: salaId, fotoId } = await params;
  if (!salaId || !fotoId) {
    return NextResponse.json({ error: "IDs obrigatórios" }, { status: 400 });
  }

  const foto = await prisma.salaLayoutFoto.findFirst({
    where: { id: fotoId, salaId },
    select: { id: true, imagemUrl: true },
  });
  if (!foto) {
    return NextResponse.json({ error: "Foto não encontrada" }, { status: 404 });
  }

  await prisma.salaLayoutFoto.delete({ where: { id: foto.id } });

  if (foto.imagemUrl && isCaminhoUploadSalaSeguro(foto.imagemUrl)) {
    await removerArquivoLayoutImagem(foto.imagemUrl);
  }

  return NextResponse.json({ ok: true });
}

/** Atualiza apenas a descrição (tipo de layout) da foto. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fotoId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  if (usuario?.permissao !== "ADM" && usuario?.permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id: salaId, fotoId } = await params;
  if (!salaId || !fotoId) {
    return NextResponse.json({ error: "IDs obrigatórios" }, { status: 400 });
  }

  let body: { descricao?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const descricao =
    typeof body.descricao === "string" ? body.descricao.trim() : "";
  if (!descricao) {
    return NextResponse.json({ error: "Descrição é obrigatória" }, { status: 400 });
  }
  if (descricao.length > 120) {
    return NextResponse.json(
      { error: "Descrição: máximo 120 caracteres." },
      { status: 400 }
    );
  }

  const existente = await prisma.salaLayoutFoto.findFirst({
    where: { id: fotoId, salaId },
  });
  if (!existente) {
    return NextResponse.json({ error: "Foto não encontrada" }, { status: 404 });
  }

  const atualizado = await prisma.salaLayoutFoto.update({
    where: { id: fotoId },
    data: { descricao },
    select: { id: true, descricao: true, imagemUrl: true, ordem: true },
  });

  return NextResponse.json(atualizado);
}
