const TZ_OFFSET_MINUTES = 180; // America/Sao_Paulo (sem horário de verão desde 2019)

export function parseDataIso(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) {
    throw new Error("Data inválida. Use aaaa-mm-dd.");
  }
  const ano = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  return new Date(Date.UTC(ano, mes - 1, dia));
}

export function formatarDataIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

export function formatarDataBr(data: Date | string): string {
  const iso = typeof data === "string" ? data.slice(0, 10) : formatarDataIso(data);
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function hojeSaoPaulo(): Date {
  const agora = new Date();
  const utc = agora.getTime() + agora.getTimezoneOffset() * 60_000;
  const sp = new Date(utc - TZ_OFFSET_MINUTES * 60_000);
  return new Date(Date.UTC(sp.getUTCFullYear(), sp.getUTCMonth(), sp.getUTCDate()));
}

export function dataUtc(ano: number, mes: number, dia: number): Date {
  return new Date(Date.UTC(ano, mes - 1, dia));
}

export function partesData(data: Date): { ano: number; mes: number; dia: number; weekday: number } {
  return {
    ano: data.getUTCFullYear(),
    mes: data.getUTCMonth() + 1,
    dia: data.getUTCDate(),
    weekday: data.getUTCDay(),
  };
}

export function mesmaData(a: Date, b: Date): boolean {
  return formatarDataIso(a) === formatarDataIso(b);
}

export function adicionarDias(data: Date, dias: number): Date {
  const d = new Date(data.getTime());
  d.setUTCDate(d.getUTCDate() + dias);
  return d;
}
