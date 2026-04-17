import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

export default async function UserDashboard() {
  const session = await auth();
  if (!session) return null;

  const usuario = (session as any).usuario;

  const nomeExibicao =
    usuario?.nomeSocial || usuario?.nome || usuario?.login || "";

  const pathname = (await headers()).get("x-pathname") || "";

  const isAdmin = usuario?.permissao === "ADM" || usuario?.permissao === "DEV";

  const navItems = [
    ...(isAdmin
      ? [
          { label: "Reservas", href: "/reserva-salas" },
          { label: "Salas", href: "/salas" },
          { label: "Agenda", href: "/reserva-salas/admin" },
        ]
      : [{ label: "Reservas", href: "/reserva-salas" }]),
  ];

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <h1 className="text-xl md:text-4xl font-bold">Olá, {nomeExibicao}</h1>

      <p className="text-sm text-muted-foreground mt-1">
        Faça reservas de salas de reunião.
      </p>

      <nav className="flex gap-2 mt-6 border-b pb-2">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? "default" : "ghost"}
                className={cn(
                  "rounded-full transition-colors",
                  active && "bg-[#F94668] text-white hover:bg-[#F94668]/90",
                )}
                style={active ? { backgroundColor: "#F94668" } : {}}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3 my-5 w-full">
        <section className="grid gap-4 md:grid-cols-2">
          <Link href="/reservas/nova">
            <div className="border border-border rounded-lg p-4 hover:shadow-md cursor-pointer bg-card">
              <h2 className="font-medium">Nova Reserva</h2>
              <p className="text-sm text-muted-foreground">
                Agende uma nova sala de reunião.
              </p>
            </div>
          </Link>

          <Link href="/reservas/minhas">
            <div className="border border-border rounded-lg p-4 hover:shadow-md cursor-pointer bg-card">
              <h2 className="font-medium">Minhas Reservas</h2>
              <p className="text-sm text-muted-foreground">
                Consulte e gerencie suas reservas futuras.
              </p>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
