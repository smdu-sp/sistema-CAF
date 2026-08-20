import type { Registro, Unidade, User, CargoConfig, CalendarActivity, DutyStaff } from "../types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
}

export const api = {
  getRegistros: () => get<Registro[]>("/registros"),
  createRegistro: (r: Registro) => post<Registro>("/registros", r),
  deleteRegistro: (id: string) => del(`/registros/${id}`),

  getUnidades: () => get<Unidade[]>("/unidades"),
  putUnidades: (u: Unidade[]) => put<Unidade[]>("/unidades", u),

  getUsers: () => get<User[]>("/users"),
  putUsers: (u: User[]) => put<User[]>("/users", u),

  getCargoConfigs: () => get<CargoConfig[]>("/cargo-configs"),
  putCargoConfigs: (c: CargoConfig[]) => put<CargoConfig[]>("/cargo-configs", c),

  getCalendarActivities: () => get<CalendarActivity[]>("/calendar-activities"),
  putCalendarActivities: (a: CalendarActivity[]) => put<CalendarActivity[]>("/calendar-activities", a),

  getDutyStaff: () => get<DutyStaff[]>("/duty-staff"),
  putDutyStaff: (d: DutyStaff[]) => put<DutyStaff[]>("/duty-staff", d),
};
