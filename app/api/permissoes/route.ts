import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verificarDesenvolvedor } from "@/services/permissoes";
import { Modulo, Permissao } from "@/prisma/generated";

interface IPermissoesPaginado {
    data: Permissao[];
    total: number;
    pagina: number;
    limite: number;
}

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const desenvolvedor = await verificarDesenvolvedor();
    if (!desenvolvedor) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    let   pagina = +(request.nextUrl.searchParams.get("pagina") || "1");
    let   limite = +(request.nextUrl.searchParams.get("limite") || "10");
    const modulo = request.nextUrl.searchParams.get("modulo") as Modulo | null;
    const where = { modulo: modulo || undefined };
    const total = await prisma.permissao.count({ where });
    if (total === 0) return NextResponse.json({ permissoes: [], total: 0 });
    if (pagina < 1) pagina = 1;
    if (limite > total) {
        pagina = 1;
        limite = total;
    }
    const permissoes = await prisma.permissao.findMany({
        where,
        skip: (pagina - 1) * limite,
        take: limite,
        orderBy: { nome: "asc" },
    });
    const response: IPermissoesPaginado = {
        data: permissoes,
        total,
        pagina,
        limite
    };
    return NextResponse.json(response);
}