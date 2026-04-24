import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TabsContainer } from "./_components/tabs-container";
import { ReservasContent } from "./_components/reservas-content";
import { SalasContent } from "../salas/_components/salas-context";
import { AgendaAdminContent } from "./_components/agenda-admin-content";

export default async function ReservaSalasPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;

  return (
    <TabsContainer 
      usuario={usuario} 
      minhasReservasContent={<ReservasContent usuario={usuario} />}
      salasContent={<SalasContent />}
      agendaContent={<AgendaAdminContent usuario={usuario} />}
    />
  );
}