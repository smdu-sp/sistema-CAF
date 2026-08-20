import { NextRequest, NextResponse } from "next/server";
import { processarAutorizacoesPendentesExpiradas } from "@/lib/helpdesk/acesso-sistemas/autorizar-solicitacao";

function autorizado(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-cron-secret");

  return header === secret;
}

/** Job: autoriza solicitações sem negativa após 7 dias. Agendar via cron/Task Scheduler. */
export async function POST(request: NextRequest) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const processados = await processarAutorizacoesPendentesExpiradas();
    return NextResponse.json({ ok: true, processados });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
