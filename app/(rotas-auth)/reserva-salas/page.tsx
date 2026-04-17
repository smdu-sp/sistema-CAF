import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { TabsContainer } from "./_components/tabs-container";
import { MinhasReservasContent } from "../reservas/minhas/_components/minhas-reservas-content";
import { SalasContent } from "../salas/_components/salas-context";

export default async function ReservaSalasPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <h1 className="text-xl md:text-4xl font-bold">Reserva de Salas</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Gerencie suas reservas e as salas disponíveis.
      </p>
    <TabsContainer 
      usuario={usuario} 
      minhasReservasContent={<MinhasReservasContent usuarioLogin={usuario.login} />}
      salasContent={<SalasContent />}
    />
   </div> 
  );
}