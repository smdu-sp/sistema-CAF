/** @format */

export function parseDateBirthday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function dataAniversarioAtual(day: number, month: number, ano?: number) {
  const anoBase = ano ?? new Date().getFullYear();
  const data = new Date(anoBase, month - 1, day);
  data.setHours(0, 0, 0, 0);
  return data;
}

export function diasDesdeAniversario(
  data_nascimento: { day: number; month: number },
  hoje: Date,
) {
  const aniversarioEsteAno = dataAniversarioAtual(
    data_nascimento.day,
    data_nascimento.month,
  );
  const umDiaEmMs = 1000 * 60 * 60 * 24;
  const hojeZerado = new Date(hoje);
  hojeZerado.setHours(0, 0, 0, 0);
  return Math.floor(
    (hojeZerado.getTime() - aniversarioEsteAno.getTime()) / umDiaEmMs,
  );
}

export function dentroDaJanelaDeFelicitacao(
  data_nascimento: { day: number; month: number },
  hoje: Date = new Date(),
) {
  const diff = diasDesdeAniversario(data_nascimento, hoje);
  return diff === 0 || diff === 1;
}