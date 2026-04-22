import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TabsContainer } from "./_components/tabs-container";
import { ReservasContent } from "./_components/reservas-content";
import { SalasContent } from "../salas/_components/salas-context";
import { AgendaAdminContent } from "./_components/agenda-admin-content";
import { Plus } from "lucide-react";

export default async function ReservaSalasPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;

  return (
    <div>
      <div className="flex justify-center">
        <div className="border border-border rounded-lg mb-4 p-6 max-w-md w-full flex items-start gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border">
              <Plus className="h-4 w-4 flex items-center" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Fazer nova reserva de sala</h3>
            <p className="text-sm text-muted-foreground mt-1">Realize uma nova reserva para uma sala da instituição</p>
          </div>
        </div>
      </div>
      <h1 className="text-xl md:text-4xl font-bold">Reserva de Salas</h1>
      <p className="text-sm text-muted-foreground mt-1">Gerencie suas reservas, visualize as salas disponíveis e acompanhe a agenda de reservas.</p>
      <TabsContainer
        usuario={usuario}
        minhasReservasContent={<ReservasContent usuario={usuario} />}
        salasContent={<SalasContent />}
        agendaContent={<AgendaAdminContent usuario={usuario} />}
      />
    </div>
  );
}