import { redirect } from "next/navigation";
import { validarPermissao } from "@/services/permissoes";

export default async function LayoutCategoriasAvaliacaoLimpeza({ children }: { children: React.ReactNode }) {
  const permissao = "avaliacao_limpeza.categorias.visualizar";
  if (!(await validarPermissao(permissao))) redirect("/avaliacao-limpeza");
  return children;
}
