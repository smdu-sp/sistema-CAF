import { unlink } from "fs/promises";
import path from "path";

const PREFIX = "/uploads/salas/";

export function isCaminhoUploadSalaSeguro(url: string): boolean {
  if (!url.startsWith(PREFIX)) return false;
  if (url.includes("..") || url.includes("\\")) return false;
  const nome = url.slice(PREFIX.length);
  if (!nome || nome.includes("/")) return false;
  return /^[a-zA-Z0-9._-]+$/.test(nome);
}

export async function removerArquivoLayoutImagem(url: string | null | undefined): Promise<void> {
  if (!url || !isCaminhoUploadSalaSeguro(url)) return;
  const relativo = url.replace(/^\//, "");
  const absoluto = path.join(process.cwd(), "public", relativo);
  const publicRoot = path.join(process.cwd(), "public");
  if (!absoluto.startsWith(publicRoot)) return;
  try {
    await unlink(absoluto);
  } catch {
    /* arquivo já removido ou inexistente */
  }
}

export const MIME_EXT_LAYOUT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
