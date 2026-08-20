import { prisma } from "@/lib/prisma";
import FormEscala from "./_components/form-escala";

export default async function EscalaPage() {
  const unidades = await prisma.ttUnidade.findMany({
    where: { ativo: true },
    select: { id: true, sigla: true, nome: true },
    orderBy: { nome: "asc" },
  });
  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 h-full md:container mx-auto">
      <FormEscala unidades={unidades} />
    </div>
  );
}
