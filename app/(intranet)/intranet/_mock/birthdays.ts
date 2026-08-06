/** @format */

import {
  IntranetBirthday,
  IntranetBirthdayConfig,
} from "../_types/intranet";

export const mockBirthdayConfig: IntranetBirthdayConfig = {
  today: 6,
  monthLabel: "Julho",
};

export const mockBirthdays: IntranetBirthday[] = [
  {
    id: 1,
    name: "Mieco Miyazato Ricieri Teixeira",
    dept: "Coordenadoria de Cadastro, Análise de Dados e Sistema Eletrônico de Licenciamento - CASE",
    day: 6,
    congratulated: false,
    congratulators: ["Ingrid Jesus Costa", "Sandra Maria Coelho Cruz"],
  },
  {
    id: 2,
    name: "Ingrid Jesus Costa",
    dept: "Divisão de Gestão de Pessoas",
    day: 6,
    congratulated: false,
    congratulators: [],
  },
  {
    id: 3,
    name: "Sandra Maria Coelho Cruz",
    dept: "SERVIN / DSIGP",
    day: 11,
    congratulated: false,
    congratulators: ["Mieco Miyazato Ricieri Teixeira"],
  },
  {
    id: 4,
    name: "Rogério do N. Gonçalves",
    dept: "RESID",
    day: 15,
    congratulated: false,
    congratulators: [],
  },
  {
    id: 5,
    name: "Paulo Roberto Andrade",
    dept: "Coordenadoria de Planejamento Urbano",
    day: 19,
    congratulated: false,
    congratulators: [],
  },
  {
    id: 6,
    name: "Fernanda Lima Souza",
    dept: "Assessoria Jurídica",
    day: 22,
    congratulated: false,
    congratulators: [],
  },
  {
    id: 7,
    name: "Carlos Eduardo Prado",
    dept: "Coordenadoria de Licenciamento",
    day: 27,
    congratulated: false,
    congratulators: [],
  },
  {
    id: 8,
    name: "Beatriz Nascimento Alves",
    dept: "GeoSampa",
    day: 30,
    congratulated: false,
    congratulators: [],
  },
];
