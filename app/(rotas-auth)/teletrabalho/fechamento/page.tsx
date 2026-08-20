import { prisma } from "@/lib/prisma";
import PainelFechamento from "./_components/painel-fechamento";

export default async function FechamentoPage() {
  const [unidades, fechamentos] = await Promise.all([
    prisma.ttUnidade.findMany({
      where: { ativo: true },
      select: { id: true, sigla: true, nome: true },
      orderBy: { nome: "asc" },
    }),
    prisma.ttFechamentoMensal.findMany({
      orderBy: [{ ano: "desc" }, { mes: "desc" }],
      take: 24,
      include: { unidade: { select: { sigla: true } } },
    }),
  ]);

  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 h-full md:container mx-auto">
      <PainelFechamento unidades={unidades} fechamentos={fechamentos} />
    </div>
  );
}
