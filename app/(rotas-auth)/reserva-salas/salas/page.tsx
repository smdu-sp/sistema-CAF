import { auth } from "@/lib/auth";
import { SalasContent } from "../../salas/_components/salas-context";
import { redirect } from "next/navigation";

interface SalasPageProps {
  searchParams: { pagina?: string };
}

export default async function SalasPage({ searchParams }: SalasPageProps) {
  const params = await searchParams
  const pagina = parseInt(params.pagina || "1", 10);

  return (
    <div className="flex items-center justify-center py-8">
      <SalasContent pagina={pagina} />
    </div>
  );
}
