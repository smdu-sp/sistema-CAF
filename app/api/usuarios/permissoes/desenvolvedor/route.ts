/** @format */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.usuario?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const usuario = await prisma.usuario.findUnique({
    where: { id: session.usuario.id },
    select: { desenvolvedor: true }
  });
  return NextResponse.json({ desenvolvedor: usuario?.desenvolvedor || false });
}
