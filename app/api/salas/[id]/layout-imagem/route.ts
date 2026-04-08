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
    select: { id: true, layoutImagemUrl: true },
  });
  if (!sala) {
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
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

  if (sala.layoutImagemUrl && isCaminhoUploadSalaSeguro(sala.layoutImagemUrl)) {
    await removerArquivoLayoutImagem(sala.layoutImagemUrl);
  }

  await prisma.sala.update({
    where: { id: salaId },
    data: { layoutImagemUrl: publicUrl },
  });

  return NextResponse.json({ layoutImagemUrl: publicUrl });
}
