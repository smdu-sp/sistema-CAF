import { auth } from "@/lib/auth";
import { SalasContent } from "./_components/salas-content";
import { redirect } from "next/navigation";
import { validarPermissao } from "@/services/permissoes";

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

  const isAdmin = await validarPermissao("usuarios.importar");

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