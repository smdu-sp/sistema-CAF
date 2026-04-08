import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  MIME_EXT_LAYOUT,
  isCaminhoUploadSalaSeguro,
  removerArquivoLayoutImagem,
} from "@/lib/sala-layout-imagem";

const MAX_BYTES = 5 * 1024 * 1024;

/** POST: nova foto de layout ou substituição (campo replaceFotoId). FormData: file, descricao, replaceFotoId? */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const usuario = (session as any).usuario;
  if (usuario?.permissao !== "ADM" && usuario?.permissao !== "DEV") {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { id: salaId } = await params;
  if (!salaId) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  const sala = await prisma.sala.findUnique({
    where: { id: salaId },
    select: { id: true, layout: true },
  });
  if (!sala) {
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
  }
  if (sala.layout !== "MOVEL") {
    return NextResponse.json(
      { error: "Só é possível enviar fotos de layout quando o tipo da sala é Móvel." },
      { status: 400 }
    );
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

  const descricaoRaw = formData.get("descricao");
  const descricao =
    typeof descricaoRaw === "string" ? descricaoRaw.trim() : "";
  if (!descricao) {
    return NextResponse.json(
      { error: "Informe o tipo ou nome do layout (campo descricao)." },
      { status: 400 }
    );
  }
  if (descricao.length > 120) {
    return NextResponse.json(
      { error: "Descrição do layout: máximo 120 caracteres." },
      { status: 400 }
    );
  }

  const replaceRaw = formData.get("replaceFotoId");
  const replaceFotoId =
    typeof replaceRaw === "string" && replaceRaw.trim() ? replaceRaw.trim() : null;

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Arquivo muito grande (máx. 5 MB)" },
      { status: 400 }
    );
  }

  const mime = file.type || "application/octet-stream";
  const ext = MIME_EXT_LAYOUT[mime];
  if (!ext) {
    return NextResponse.json(
      { error: "Formato não permitido. Use JPEG, PNG, WebP ou GIF." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const nomeArquivo = `${salaId}-${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "salas");
  await mkdir(dir, { recursive: true });
  const caminhoFs = path.join(dir, nomeArquivo);
  await writeFile(caminhoFs, buffer);

  const publicUrl = `/uploads/salas/${nomeArquivo}`;

  if (replaceFotoId) {
    const existente = await prisma.salaLayoutFoto.findFirst({
      where: { id: replaceFotoId, salaId },
    });
    if (!existente) {
      await removerArquivoLayoutImagem(publicUrl);
      return NextResponse.json({ error: "Foto de layout não encontrada." }, { status: 404 });
    }
    const urlAntiga = existente.imagemUrl;
    const atualizado = await prisma.salaLayoutFoto.update({
      where: { id: replaceFotoId },
      data: { descricao, imagemUrl: publicUrl },
      select: { id: true, descricao: true, imagemUrl: true, ordem: true },
    });
    if (
      urlAntiga &&
      urlAntiga !== publicUrl &&
      isCaminhoUploadSalaSeguro(urlAntiga)
    ) {
      await removerArquivoLayoutImagem(urlAntiga);
    }
    return NextResponse.json(atualizado);
  }

  const agg = await prisma.salaLayoutFoto.aggregate({
    where: { salaId },
    _max: { ordem: true },
  });
  const ordem = (agg._max.ordem ?? -1) + 1;

  const criado = await prisma.salaLayoutFoto.create({
    data: {
      salaId,
      descricao,
      imagemUrl: publicUrl,
      ordem,
    },
    select: { id: true, descricao: true, imagemUrl: true, ordem: true },
  });

  return NextResponse.json(criado, { status: 201 });
}
