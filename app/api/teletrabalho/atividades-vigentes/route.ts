import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { parseDataIso } from "@/lib/teletrabalho/datas";
import { atividadesVigentesDoCargo } from "@/lib/teletrabalho/pontuacao";

export async function GET(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const servidorId = request.nextUrl.searchParams.get("servidorId") || sessao.acesso.servidorId;
  const dataIso = request.nextUrl.searchParams.get("data");
  if (!servidorId || !dataIso) return jsonErro("servidorId e data são obrigatórios");
  const servidor = await prisma.ttServidor.findUnique({ where: { id: servidorId } });
  if (!servidor) return jsonErro("Servidor não encontrado", 404);
  const vigentes = await atividadesVigentesDoCargo(servidor.cargoId, parseDataIso(dataIso));
  return NextResponse.json({ cargoId: servidor.cargoId, cargoNome: undefined, atividades: vigentes });
}
