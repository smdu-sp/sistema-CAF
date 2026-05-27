export const PREFIXO_MOTIVO_PRODAM = "Motivo do envio para PRODAM:";

export function textoMotivoProdam(motivo: string): string {
  return `${PREFIXO_MOTIVO_PRODAM}\n${motivo.trim()}`;
}

export function isMensagemMotivoProdam(texto: string): boolean {
  return texto.trimStart().startsWith(PREFIXO_MOTIVO_PRODAM);
}
