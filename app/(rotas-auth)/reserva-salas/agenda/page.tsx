import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { AgendaAdminContent } from "../_components/agenda-admin-content";

export default async function AgendaPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const usuario = (session as any).usuario;
  const isAdmin = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";

  if (!isAdmin) redirect("/reserva-salas");

  return (
    <main className="p-4 md:p-6 w-full mx-auto space-y-6">
      <section className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6 w-100%"> 
        <AgendaAdminContent usuario={usuario} />
      </section>
    </main>
  );
}
