import { NextRequest, NextResponse } from "next/server";
import { ingerirColeta, parseColetaPayload } from "@/lib/inventario/coleta";

/**
 * Ingestão de coleta de rede (worker/coletor PowerShell).
 * Autenticação por API key (X-Api-Key), não por sessão — quem chama é uma máquina.
 * Configurar INV_COLETA_API_KEY no ambiente.
 */
export async function POST(request: NextRequest) {
  const chaveConfig = process.env.INV_COLETA_API_KEY;
  if (!chaveConfig) {
    return NextResponse.json(
      { error: "Ingestão de coleta não configurada (defina INV_COLETA_API_KEY)" },
      { status: 503 }
    );
  }

  const chaveEnviada = request.headers.get("x-api-key");
  if (!chaveEnviada || chaveEnviada !== chaveConfig) {
    return NextResponse.json({ error: "API key inválida" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Payload deve ser um objeto" },
      { status: 400 }
    );
  }

  const parsed = parseColetaPayload(body);
  if (parsed.error || !parsed.data) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const resultado = await ingerirColeta(parsed.data);
    return NextResponse.json(resultado, {
      status: resultado.criado ? 201 : 200,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao processar coleta: ${msg}` },
      { status: 500 }
    );
  }
}
