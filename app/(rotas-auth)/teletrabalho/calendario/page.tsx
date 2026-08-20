import { prisma } from "@/lib/prisma";
import CalendarioEscala from "./_components/calendario-escala";

export default async function CalendarioPage() {
  const unidades = await prisma.ttUnidade.findMany({
    where: { ativo: true },
    select: { id: true, sigla: true, nome: true },
    orderBy: { nome: "asc" },
  });
  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 h-full md:container mx-auto">
      <CalendarioEscala unidades={unidades} />
    </div>
  );
}
