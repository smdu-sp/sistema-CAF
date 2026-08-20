import { NextRequest, NextResponse } from "next/server";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { validarRegistros } from "@/lib/teletrabalho/registro";

export async function POST(request: NextRequest) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  if (!sessao.acesso.podeValidar) return jsonErro("Sem permissão", 403);
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown) => typeof id === "string") : [];
  if (!ids.length) return jsonErro("Informe os registros");
  try {
    await validarRegistros({ ids, acesso: sessao.acesso, atorId: sessao.usuario.id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonErro(e instanceof Error ? e.message : "Erro ao validar");
  }
}
