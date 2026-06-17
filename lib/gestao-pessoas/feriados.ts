/** Feriados nacionais e móveis (baseado no sistema legado). */
export function obterFeriadosDoAno(ano: number): Date[] {
  const pascoa = calcularPascoa(ano);
  const diaPascoa = pascoa.getDate();
  const mesPascoa = pascoa.getMonth();
  const anoPascoa = pascoa.getFullYear();

  const feriados = [
    new Date(ano, 0, 1),
    new Date(ano, 3, 21),
    new Date(ano, 4, 1),
    new Date(ano, 8, 7),
    new Date(ano, 9, 12),
    new Date(ano, 10, 2),
    new Date(ano, 10, 15),
    new Date(ano, 11, 25),
    new Date(anoPascoa, mesPascoa, diaPascoa - 48),
    new Date(anoPascoa, mesPascoa, diaPascoa - 47),
    new Date(anoPascoa, mesPascoa, diaPascoa - 2),
    new Date(anoPascoa, mesPascoa, diaPascoa),
    new Date(anoPascoa, mesPascoa, diaPascoa + 60),
  ];

  return feriados.sort((a, b) => a.getTime() - b.getTime());
}

function calcularPascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes, dia);
}

export function ehFeriado(data: Date, feriados: Date[]): boolean {
  const y = data.getFullYear();
  const m = data.getMonth();
  const d = data.getDate();
  return feriados.some(
    (f) => f.getFullYear() === y && f.getMonth() === m && f.getDate() === d
  );
}

export const DIAS_SEMANA = [
  "DOMINGO",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "SÁBADO",
] as const;
