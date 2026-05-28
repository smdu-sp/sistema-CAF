import { redirect } from "next/navigation";
import { validarPermissao } from "@/services/permissoes";

export default async function LayoutSalasAvaliacaoLimpeza({ children }: { children: React.ReactNode }) {
  const permissao = "avaliacao_limpeza.salas.visualizar";
  if (!(await validarPermissao(permissao))) redirect("/avaliacao-limpeza");
  return children;
}
