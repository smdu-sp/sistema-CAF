import { IAba } from "@/types/aba";
 
export function filtrarAbasPorPermissao(
  usuario: any,
  abas: IAba[]
): IAba[] {
  return abas.filter((aba) =>
    aba.permissoes.some(
      (permissao) =>
        usuario?.permissao === permissao ||
        usuario?.permissao === "ADM" ||
        usuario?.permissao === "DEV"
    )
  );
}