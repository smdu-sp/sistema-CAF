import { NextRequest } from "next/server";
import { jsonErro } from "./auth-api";

export async function lerJson<T>(request: NextRequest): Promise<T | ReturnType<typeof jsonErro>> {
  try {
    return (await request.json()) as T;
  } catch {
    return jsonErro("Corpo da requisição inválido");
  }
}

export function texto(valor: unknown, max = 250): string {
  return typeof valor === "string" ? valor.trim().slice(0, max) : "";
}
