import type { Chamado, ChamadoEvento } from "@/app/(rotas-auth)/helpdesk/_types";

export function isEventoEntradaProdam(evento: ChamadoEvento): boolean {
  if (evento.tipo !== "statusAlterado") return false;
  const t = evento.texto.trim().toLowerCase();
  return t.includes("prodam");
}

export function isEventoSaidaProdam(evento: ChamadoEvento): boolean {
  if (isEventoEntradaProdam(evento)) return false;

  if (
    evento.tipo === "resolucao" ||
    evento.tipo === "fechamento" ||
    evento.tipo === "reabertura" ||
    evento.tipo === "encaminhamento"
  ) {
    return true;
  }

  if (evento.tipo !== "statusAlterado") return false;

  const t = evento.texto.trim().toLowerCase();
  if (t.includes("observador")) return false;
  if (t.includes("alterou o status para")) return true;
  if (t.startsWith("status alterado para")) return true;

  return false;
}

export function calcularTempoProdamMs(
  eventos: ChamadoEvento[],
  fimReferenciaMs: number
): number {
  const sorted = [...eventos].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );

  let total = 0;
  let inicioProdam: number | null = null;

  for (const ev of sorted) {
    const ts = new Date(ev.data).getTime();
    if (Number.isNaN(ts)) continue;

    if (isEventoEntradaProdam(ev)) {
      if (inicioProdam === null) inicioProdam = ts;
    } else if (inicioProdam !== null && isEventoSaidaProdam(ev)) {
      total += ts - inicioProdam;
      inicioProdam = null;
    }
  }

  if (inicioProdam !== null) {
    total += fimReferenciaMs - inicioProdam;
  }

  return Math.max(0, total);
}

export function dataFimAtendimento(chamado: Chamado): number | null {
  const iso = chamado.dataResolucao ?? chamado.dataFechamento;
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
}

export function chamadoEncerrado(chamado: Chamado): boolean {
  return chamado.status === "resolvido" || chamado.status === "fechado";
}

export function calcularTempoAtendimentoLiquidoMs(chamado: Chamado): number | null {
  if (!chamadoEncerrado(chamado)) return null;

  const fim = dataFimAtendimento(chamado);
  if (fim === null) return null;

  const inicio = new Date(chamado.abertura).getTime();
  if (Number.isNaN(inicio) || fim <= inicio) return null;

  const total = fim - inicio;
  const prodam = calcularTempoProdamMs(chamado.eventos, fim);
  return Math.max(0, total - prodam);
}

export function mediana(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const sorted = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[meio - 1] + sorted[meio]) / 2;
  }
  return sorted[meio];
}

export function media(valores: number[]): number | null {
  if (valores.length === 0) return null;
  return valores.reduce((acc, v) => acc + v, 0) / valores.length;
}

export function formatarDuracaoMs(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 1) return "< 1 min";
  if (totalMin < 60) return `${totalMin} min`;

  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;

  if (horas < 48) {
    return `${horas}h ${String(minutos).padStart(2, "0")}min`;
  }

  const dias = Math.floor(horas / 24);
  const horasRestantes = horas % 24;
  return `${dias}d ${horasRestantes}h`;
}

export type MetricasTempoAtendimento = {
  amostra: number;
  medianaMs: number | null;
  mediaMs: number | null;
  prodamMedianaMs: number | null;
};

export function metricasTempoAtendimento(chamados: Chamado[]): MetricasTempoAtendimento {
  const liquidos: number[] = [];
  const prodam: number[] = [];

  for (const c of chamados) {
    const liquido = calcularTempoAtendimentoLiquidoMs(c);
    if (liquido !== null) liquidos.push(liquido);

    if (!chamadoEncerrado(c)) continue;
    const fim = dataFimAtendimento(c);
    if (fim === null) continue;
    const tempoProdam = calcularTempoProdamMs(c.eventos, fim);
    if (tempoProdam > 0) prodam.push(tempoProdam);
  }

  return {
    amostra: liquidos.length,
    medianaMs: mediana(liquidos),
    mediaMs: media(liquidos),
    prodamMedianaMs: mediana(prodam),
  };
}
