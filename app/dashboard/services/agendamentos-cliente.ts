"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function listarAgendamentosPorDiaCliente(data: Date) {
  // Nesta versão de exemplo, apenas retorna uma lista vazia.
  // Em produção, chame a rota interna /api/agendamentos?data=YYYY-MM-DD
  // e retorne os dados da API.
  const _ = data;

  return Promise.resolve<
    { id: string; salaNome: string; inicio: string; fim: string }[]
  >([]);
}

export function formatarDataHora(d: Date) {
  return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

