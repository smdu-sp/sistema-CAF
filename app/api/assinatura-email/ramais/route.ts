import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { podeGerenciarCadastrosAssinatura } from "@/lib/assinatura-email/auth";

export async function GET(request: NextRequest) {
  if (!(await podeGerenciarCadastrosAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);
  const limite = Math.max(1, Math.min(100, Number(searchParams.get("limite")) || 10));
  const skip = (pagina - 1) * limite;

  const where = q
    ? {
        OR: [
          { usuario: { contains: q } },
          { ramalGrupo: { contains: q } },
        ],
      }
    : {};

  const [lista, total] = await Promise.all([
    prisma.assinaturaGrupoRamal.findMany({
      where,
      orderBy: { usuario: "asc" },
      skip,
      take: limite,
      select: { id: true, usuario: true, ramalGrupo: true },
    }),
    prisma.assinaturaGrupoRamal.count({ where }),
  ]);

  return NextResponse.json({ lista, total, pagina, limite });
}

export async function POST(request: NextRequest) {
  if (!(await podeGerenciarCadastrosAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  let body: { usuario?: string; ramalGrupo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const usuario = typeof body.usuario === "string" ? body.usuario.trim() : "";
  const ramalGrupo = typeof body.ramalGrupo === "string" ? body.ramalGrupo.trim() : "";
  if (!usuario || !ramalGrupo) {
    return NextResponse.json(
      { error: "Login e ramal de grupo são obrigatórios" },
      { status: 400 },
    );
  }

  const existente = await prisma.assinaturaGrupoRamal.findUnique({
    where: { usuario },
  });
  if (existente) {
    return NextResponse.json(
      { error: "Já existe ramal cadastrado para este login" },
      { status: 409 },
    );
  }

  const ramal = await prisma.assinaturaGrupoRamal.create({
    data: { usuario, ramalGrupo },
    select: { id: true, usuario: true, ramalGrupo: true },
  });
  return NextResponse.json(ramal, { status: 201 });
}
