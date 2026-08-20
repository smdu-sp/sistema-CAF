import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_BYTES = 10 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

export function isCaminhoAnexoHelpdeskSeguro(url: string): boolean {
  return (
    typeof url === "string" &&
    url.startsWith("/uploads/helpdesk/") &&
    !url.includes("..")
  );
}

export async function salvarAnexoHelpdesk(file: File) {
  if (file.size > MAX_BYTES) {
    throw new Error("Arquivo excede o limite de 10 MB");
  }

  const ext = MIME_EXT[file.type];
  if (!ext) {
    throw new Error("Tipo de arquivo não permitido");
  }

  const nomeArquivo = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "helpdesk");
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, nomeArquivo), buffer);

  return {
    nomeArquivo: file.name.slice(0, 255),
    urlArquivo: `/uploads/helpdesk/${nomeArquivo}`,
    tipoMime: file.type,
    tamanho: file.size,
  };
}
