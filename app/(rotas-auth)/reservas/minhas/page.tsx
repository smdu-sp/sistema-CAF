import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listarMinhasReservas } from "../services/reservas";
import { MinhasReservasTable } from "./_components/minhas-reservas-table";

export default async function MinhasReservasPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;
  if (!usuario?.login) redirect("/login");

  const reservas = await listarMinhasReservas(usuario.login);

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <h1 className="text-xl md:text-4xl font-bold">Minhas Reservas</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Consulte e gerencie suas reservas futuras.
      </p>
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/reservas/nova">Nova reserva</Link>
          </Button>
        </div>
        {reservas.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            Você não possui reservas futuras.{" "}
            <Link href="/reservas/nova" className="text-primary underline">
              Fazer uma reserva
            </Link>
          </p>
        ) : (
          <MinhasReservasTable reservas={reservas} />
        )}
      </div>
    </div>
  );
}
