import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usuario = session.user as any;

  // ADM vê tudo, outros vêem só suas avaliações
  const where =
    usuario.permissao === "ADM" ? {} : { avaliadoPor: usuario.id };

  const avaliacoes = await prisma.avaliacao.findMany({
    where,
    include: {
      sala: true,
      avaliador: true,
      avaliacaoCriterios: true,
    },
    orderBy: { criadoEm: "desc" },
  });

  return Response.json(avaliacoes);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const usuario = session.user as any;

  try {
    const avaliacao = await prisma.avaliacao.create({
      data: {
        mes: body.mes,
        ano: body.ano,
        salaId: body.salaId,
        avaliadoPor: usuario.id,
        observacao: body.observacao,
      },
      include: {
        sala: true,
        avaliador: true,
      },
    });

    return Response.json(avaliacao, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Erro ao criar avaliação" },
      { status: 400 }
    );
  }
}
