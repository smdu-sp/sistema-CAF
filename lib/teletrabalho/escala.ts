import { getWeek } from "date-fns";
import { partesData } from "./datas";

export type StatusDiaEscala = "Folga" | "Presencial" | "Teletrabalho";

/**
 * Algoritmo ATECC: 2 grupos, 2 remotos / 3 presenciais,
 * dia de presença integral rotativo (seg/qua/sex conforme o mês).
 */
export function statusDiaAtecc(data: Date, grupo: 1 | 2): StatusDiaEscala {
  const { weekday, mes } = partesData(data);
  if (weekday === 0 || weekday === 6) return "Folga";

  const local = new Date(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate());
  const weekNumber = getWeek(local, { weekStartsOn: 1 });
  const weekParity = weekNumber % 2 === 1 ? "odd" : "even";

  let allDay = 1;
  if ([5, 8, 11].includes(mes)) allDay = 3;
  if ([6, 9, 12].includes(mes)) allDay = 5;
  if (weekday === allDay) return "Presencial";

  if ([1, 2, 3, 4, 7, 10].includes(mes)) {
    if (weekParity === "odd") {
      if (weekday === 2 || weekday === 4) return grupo === 2 ? "Presencial" : "Teletrabalho";
      if (weekday === 3 || weekday === 5) return grupo === 1 ? "Presencial" : "Teletrabalho";
    } else {
      if (weekday === 2 || weekday === 4) return grupo === 1 ? "Presencial" : "Teletrabalho";
      if (weekday === 3 || weekday === 5) return grupo === 2 ? "Presencial" : "Teletrabalho";
    }
  }

  if ([5, 8, 11].includes(mes)) {
    if (weekParity === "odd") {
      if (weekday === 1 || weekday === 5) return grupo === 1 ? "Presencial" : "Teletrabalho";
      if (weekday === 2 || weekday === 4) return grupo === 2 ? "Presencial" : "Teletrabalho";
    } else {
      if (weekday === 1 || weekday === 5) return grupo === 2 ? "Presencial" : "Teletrabalho";
      if (weekday === 2 || weekday === 4) return grupo === 1 ? "Presencial" : "Teletrabalho";
    }
  }

  if ([6, 9, 12].includes(mes)) {
    if (weekParity === "odd") {
      if (weekday === 1 || weekday === 3) return grupo === 1 ? "Presencial" : "Teletrabalho";
      if (weekday === 2 || weekday === 4) return grupo === 2 ? "Presencial" : "Teletrabalho";
    } else {
      if (weekday === 1 || weekday === 3) return grupo === 2 ? "Presencial" : "Teletrabalho";
      if (weekday === 2 || weekday === 4) return grupo === 1 ? "Presencial" : "Teletrabalho";
    }
  }

  return "Teletrabalho";
}

export function resolverStatusDia(params: {
  data: Date;
  grupo: number;
  algoritmo: "atecc_grupos_2" | "personalizado";
  ehFeriado: boolean;
}): StatusDiaEscala {
  if (params.ehFeriado) return "Folga";
  const grupo = params.grupo === 2 ? 2 : 1;
  if (params.algoritmo === "atecc_grupos_2") {
    return statusDiaAtecc(params.data, grupo);
  }
  return statusDiaAtecc(params.data, grupo);
}

export function ehDiaTeletrabalho(params: {
  data: Date;
  grupo: number;
  algoritmo: "atecc_grupos_2" | "personalizado";
  ehFeriado: boolean;
}): boolean {
  return resolverStatusDia(params) === "Teletrabalho";
}
