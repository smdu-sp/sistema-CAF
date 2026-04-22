import { MinhasReservasContent } from "../../reservas/minhas/_components/minhas-reservas-content";
import { ProximosEventos } from "../admin/_components/proximos-eventos";

interface UsuarioData {
  login: string;
  permissao: string;
}

interface ReservasContentProps {
  usuario: UsuarioData;
}

export async function ReservasContent({ usuario }: ReservasContentProps) {
  const isAdminOrDev = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";

  if (isAdminOrDev) {
    return <ProximosEventos />;
  }

  return <MinhasReservasContent usuarioLogin={usuario.login} />;
}
