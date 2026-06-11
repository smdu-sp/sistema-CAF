import { auth } from "@/lib/auth";
import { SalasContent } from "../../salas/_components/salas-context";
import { redirect } from "next/navigation";

interface SalasPageProps {
  searchParams: Promise<{
    pagina?: string;
    limite?: string;
  }>;
}

export default async function SalasPage({
  searchParams,
}: SalasPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const usuario = (session as any).usuario;

  const isAdmin =
    usuario?.permissao === "ADM" ||
    usuario?.permissao === "DEV";

  if (!isAdmin) {
    redirect("/reserva-salas");
  }

  const params = await searchParams;

  const pagina = parseInt(
    params.pagina ?? "1",
    10,
  );

  const limite = parseInt(
    params.limite ?? "10",
    10,
  );

  return (
    <div className="flex items-center justify-center py-8">
      <SalasContent pagina={pagina} limite={limite} />
    </div>
  );
}