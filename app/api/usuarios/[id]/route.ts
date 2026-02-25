import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _request: NextRequest,
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
  const { id } = await params;
  let body: { coordenadoriaId?: string | null };
  try {
    body = await _request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo inválido" },
      { status: 400 }
    );
  }
  const coordenadoriaId =
    body.coordenadoriaId === null || body.coordenadoriaId === ""
      ? null
      : body.coordenadoriaId;
  if (coordenadoriaId !== null && typeof coordenadoriaId !== "string") {
    return NextResponse.json(
      { error: "coordenadoriaId deve ser string ou null" },
      { status: 400 }
    );
  }
  if (coordenadoriaId) {
    const c = await prisma.coordenadoria.findUnique({
      where: { id: coordenadoriaId },
    });
    if (!c) {
      return NextResponse.json(
        { error: "Coordenadoria não encontrada" },
        { status: 404 }
      );
    }
  }
  await prisma.usuario.update({
    where: { id },
    data: { coordenadoriaId },
  });
  return NextResponse.json({ ok: true });
}
