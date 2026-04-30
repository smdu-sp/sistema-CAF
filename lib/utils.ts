import { format } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type format = "dia-mes" | "mes-ano" | "dia-mes-ano";
type separator = "/" | "-";

export function formatarData(data: Date, format: format = "dia-mes-ano", separator: separator = "/"): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = String(data.getFullYear()).slice(-2);

  let formatado: string;

  if (format === "dia-mes") {
    formatado = `${dia}${separator}${mes}`;
  } else if (format === "mes-ano") {
    formatado = `${mes}${separator}${ano}`;
  } else {
    formatado = `${dia}${separator}${mes}${separator}${ano}`;
  }

  return formatado;
}
