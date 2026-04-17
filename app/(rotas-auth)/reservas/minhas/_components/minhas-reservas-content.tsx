import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listarMinhasReservas } from "../../services/reservas";
import { MinhasReservasTable } from "./minhas-reservas-table";
import { Plus } from "lucide-react";

interface MinhasReservasContentProps {
  usuarioLogin: string;
}

export async function MinhasReservasContent({ usuarioLogin }: MinhasReservasContentProps) {
  const reservas = await listarMinhasReservas(usuarioLogin);

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
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
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/reservas/nova">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}