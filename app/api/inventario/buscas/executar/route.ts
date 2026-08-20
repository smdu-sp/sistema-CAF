import { spawn } from "node:child_process";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { exigeInventario } from "@/lib/inventario/api-helpers";

/**
 * Dispara o coletor no servidor (modo -FromQueue) para processar a fila.
 * Requer que a aplicação rode em Windows na rede (com PowerShell e acesso às
 * máquinas). Os argumentos são fixos — nenhum input do usuário entra no shell.
 */
export async function POST(request: NextRequest) {
  const gate = await exigeInventario();
  if ("error" in gate) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  const apiKey = process.env.INV_COLETA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Coleta não configurada: defina INV_COLETA_API_KEY no servidor." },
      { status: 503 }
    );
  }

  if (process.platform !== "win32") {
    return NextResponse.json(
      {
        error:
          "Execução pelo servidor requer Windows. Em outro SO, use o coletor agendado (Task Scheduler).",
      },
      { status: 501 }
    );
  }

  const scriptPath = path.join(process.cwd(), "scripts", "inventario", "coletar.ps1");
  const apiUrl = `${request.nextUrl.origin}/api/inventario/coleta`;

  try {
    const child = spawn(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        scriptPath,
        "-ApiUrl",
        apiUrl,
        "-ApiKey",
        apiKey,
        "-FromQueue",
        "-IncludeSoftware",
      ],
      { detached: true, stdio: "ignore", windowsHide: true }
    );
    // Evita que um erro de spawn derrube o processo do servidor.
    child.on("error", (e) => {
      console.error("[inventario] falha ao iniciar coletor:", e.message);
    });
    child.unref();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro desconhecido";
    return NextResponse.json(
      { error: `Não foi possível iniciar o coletor: ${msg}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, mensagem: "Coletor disparado. A fila será processada em instantes." },
    { status: 202 }
  );
}
