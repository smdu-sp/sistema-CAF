import { redirect } from "next/navigation";
import { validarPermissao } from "@/services/permissoes";

export default async function LayoutSalasAvaliacaoLimpeza({ children }: { children: React.ReactNode }) {
  const permissao = "reserva_salas.salas.visualizar";
  if (!(await validarPermissao(permissao))) redirect("/reserva-salas");
  return children;
}
