/** @format */

import { IntranetEvent } from "../_types/intranet";

export const mockEvents: IntranetEvent[] = [
  {
    id: 1,
    day: "08",
    monthShort: "JUL",
    title: "Reuniao geral SMUL",
    desc: "Auditorio principal, 10h - apresentacao de resultados do semestre.",
  },
  {
    id: 2,
    day: "10",
    monthShort: "JUL",
    title: "Treinamento SEI para novos servidores",
    desc: "Sala de treinamento, 18 andar, 14h.",
  },
  {
    id: 3,
    day: "14",
    monthShort: "JUL",
    title: "Palestra Urbanismo em Pauta",
    desc: "Convidados externos discutem planejamento urbano em SP.",
  },
  {
    id: 4,
    day: "21",
    monthShort: "JUL",
    title: "Manutencao programada do SIMPROC",
    desc: "Sistema indisponivel das 20h as 23h.",
  },
  {
    id: 5,
    day: "31",
    monthShort: "JUL",
    title: "Fechamento mensal de indicadores",
    desc: "Envio dos relatorios ate 18h.",
  },
];
