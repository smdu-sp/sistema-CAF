import { prisma } from "@/lib/prisma";
import { parseDataIso, formatarDataIso, partesData, mesmaData } from "./datas";

export async function listarFeriadosDoAno(ano: number): Promise<Date[]> {
  const exercicio = await prisma.ttExercicio.findUnique({
    where: { ano },
    include: { feriados: { where: { ativo: true } } },
  });
  if (!exercicio) return [];
  return exercicio.feriados.map((f) => f.data);
}

export function ehFeriado(data: Date, feriados: Date[]): boolean {
  return feriados.some((f) => mesmaData(f, data));
}

export function ehFimDeSemana(data: Date): boolean {
  const { weekday } = partesData(data);
  return weekday === 0 || weekday === 6;
}

export function ehDiaUtil(data: Date, feriados: Date[]): boolean {
  return !ehFimDeSemana(data) && !ehFeriado(data, feriados);
}

export async function ehDiaUtilPersistido(data: Date): Promise<boolean> {
  const { ano } = partesData(data);
  const feriados = await listarFeriadosDoAno(ano);
  return ehDiaUtil(data, feriados);
}

export function proximoDiaUtil(data: Date, feriados: Date[]): Date {
  const atual = new Date(data.getTime());
  atual.setUTCDate(atual.getUTCDate() + 1);
  while (!ehDiaUtil(atual, feriados)) {
    atual.setUTCDate(atual.getUTCDate() + 1);
  }
  return atual;
}

export function contarDiasUteis(inicio: Date, fim: Date, feriados: Date[]): number {
  if (inicio.getTime() > fim.getTime()) return 0;
  let count = 0;
  const cursor = new Date(inicio.getTime());
  while (cursor.getTime() <= fim.getTime()) {
    if (ehDiaUtil(cursor, feriados)) count += 1;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

export function prazoPreenchimento(dataRegistro: Date, feriados: Date[]): Date {
  return proximoDiaUtil(dataRegistro, feriados);
}

export function atrasoObrigatorio(dataRegistro: Date, dataPreenchimento: Date, feriados: Date[]): boolean {
  const prazo = prazoPreenchimento(dataRegistro, feriados);
  return dataPreenchimento.getTime() > prazo.getTime();
}

export { parseDataIso, formatarDataIso };
