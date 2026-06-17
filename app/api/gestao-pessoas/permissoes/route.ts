import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { obterSessaoGestaoPessoas } from "@/lib/gestao-pessoas/auth-api";

export async function GET() {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeGerenciarPermissoes) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const [vinculos, usuarios, unidades] = await Promise.all([
    prisma.gpUsuarioUnidade.findMany({
      include: {
        usuario: { select: { id: true, nome: true, login: true, email: true } },
        unidade: { select: { id: true, codigoEh: true, nome: true, prefixoEh: true } },
      },
      orderBy: [{ usuario: { nome: "asc" } }],
    }),
    prisma.usuario.findMany({
      where: { status: true },
      select: { id: true, nome: true, login: true },
      orderBy: { nome: "asc" },
    }),
    prisma.gpUnidade.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, codigoEh: true, nome: true, prefixoEh: true },
    }),
  ]);

  return NextResponse.json({ vinculos, usuarios, unidades });
}

const criarSchema = z.object({
  usuarioId: z.string().uuid(),
  unidadeId: z.string().uuid(),
  papel: z.enum(["usuario", "administrador", "dgp"]),
});

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeGerenciarPermissoes) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = criarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vinculo = await prisma.gpUsuarioUnidade.upsert({
    where: {
      usuarioId_unidadeId: {
        usuarioId: parsed.data.usuarioId,
        unidadeId: parsed.data.unidadeId,
      },
    },
    create: parsed.data,
    update: { papel: parsed.data.papel },
    include: {
      usuario: { select: { id: true, nome: true, login: true } },
      unidade: { select: { id: true, codigoEh: true, nome: true } },
    },
  });

  return NextResponse.json(vinculo, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const sessao = await obterSessaoGestaoPessoas();
  if ("error" in sessao) return sessao.error;

  if (!sessao.acesso.podeGerenciarPermissoes) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const usuarioId = request.nextUrl.searchParams.get("usuarioId");
  const unidadeId = request.nextUrl.searchParams.get("unidadeId");

  if (!usuarioId || !unidadeId) {
    return NextResponse.json(
      { error: "Informe usuarioId e unidadeId" },
      { status: 400 }
    );
  }

  await prisma.gpUsuarioUnidade.delete({
    where: { usuarioId_unidadeId: { usuarioId, unidadeId } },
  });

  return NextResponse.json({ ok: true });
}
