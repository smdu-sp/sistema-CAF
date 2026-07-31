import { MinhasReservasContent } from "../minhas/_components/minhas-reservas-content";
import { ProximosEventos } from "../admin/_components/proximos-eventos";
import { ActionButton } from "@/components/action-button";
import { Plus } from "lucide-react";
import { validarPermissao } from "@/services/permissoes";

interface UsuarioData {
  login: string;
  permissao: string;
}

interface ReservasContentProps {
  usuario: UsuarioData;
}

export async function ReservasContent({ usuario }: ReservasContentProps) {
  const temPermissao = await validarPermissao("usuarios.importar");

  return (
    <div>
      <div className="flex justify-center mb-6">
        <ActionButton
          title="Criar Reserva"
          description="Agende uma nova sala para sua reunião ou evento"
          href="/reserva-salas/nova"
          icon={Plus}
        />
      </div>
      {temPermissao ? <ProximosEventos /> : <MinhasReservasContent usuarioLogin={usuario.login} />}
    </div>
  );
}
