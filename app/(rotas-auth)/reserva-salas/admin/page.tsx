import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { AgendaAdmin } from "./agenda-admin";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;
  const isAdmin = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";
  if (!isAdmin) redirect("/reserva-salas");

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Painel do Administrador</h1>
        <p className="text-sm text-muted-foreground">
          Agenda de todas as salas: visualize reservas e cancele quando necessário.
        </p>
      </header>
      <section className="bg-card border border-border rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="font-medium mb-4">Agenda das salas (9h–19h)</h2>
        <AgendaAdmin />
      </section>
    </main>
  );
}
