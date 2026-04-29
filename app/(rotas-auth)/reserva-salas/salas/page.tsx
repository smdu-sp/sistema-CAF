import { auth } from "@/lib/auth/auth";
import { SalasContent } from "../../salas/_components/salas-context";
import { redirect } from "next/navigation";

export default async function SalasPage() {
  const session = await auth();
    if (!session) redirect("/login");
  
    const usuario = (session as any).usuario;
    const isAdmin =
      usuario?.permissao === "ADM" || usuario?.permissao === "DEV";
  
    if (!isAdmin) redirect("/reserva-salas");
    
  return (
    <div className="flex items-center justify-center py-8">
      <SalasContent />
    </div>
  );
}