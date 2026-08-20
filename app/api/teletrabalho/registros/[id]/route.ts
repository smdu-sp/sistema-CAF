import { NextRequest, NextResponse } from "next/server";
import { obterSessaoTeletrabalho, jsonErro } from "@/lib/teletrabalho/auth-api";
import { excluirRegistro } from "@/lib/teletrabalho/registro";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const sessao = await obterSessaoTeletrabalho();
  if ("error" in sessao) return sessao.error;
  const { id } = await params;
  const body = await request.json().catch(() => ({ motivo: "" }));
  try {
    await excluirRegistro({
      id,
      motivo: typeof body.motivo === "string" ? body.motivo : "",
      acesso: sessao.acesso,
      atorId: sessao.usuario.id,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return jsonErro(e instanceof Error ? e.message : "Erro ao excluir");
  }
}
