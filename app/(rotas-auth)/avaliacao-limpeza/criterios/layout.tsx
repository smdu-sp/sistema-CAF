import { redirect } from "next/navigation";
import { validarPermissao } from "@/services/permissoes";

export default async function LayoutCriteriosAvaliacaoLimpeza({ children }: { children: React.ReactNode }) {
  const permissao = "avaliacao_limpeza.criterios.visualizar";
  if (!(await validarPermissao(permissao))) redirect("/avaliacao-limpeza");
  return children;
}
