import DataTable from "@/components/data-table";
import { prisma } from "@/lib/prisma";
import { columns } from "./_components/columns";
import ModalUpdateAndCreate from "./_components/modal-update-create";

interface PageProps {
  searchParams: Promise<{ pagina?: string; limite?: string; ano?: string }>;
}

export default async function FeriadosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const limite = Math.max(1, Number(params.limite) || 15);
  const ano = Number(params.ano) || new Date().getFullYear();
  const exercicio = await prisma.ttExercicio.findUnique({ where: { ano } });
  const where = exercicio ? { exercicioId: exercicio.id } : { id: "nenhum" };

  const [lista, total] = await Promise.all([
    prisma.ttFeriado.findMany({
      where,
      orderBy: { data: "asc" },
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.ttFeriado.count({ where }),
  ]);

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <p className="text-sm text-muted-foreground">Exercício {ano}</p>
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable columns={columns} data={lista} paginaAtual={pagina} limitePorPagina={limite} totalItens={total} labelItemSingular="feriado" labelItemPlural="feriados" />
      </div>
      <div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
        <ModalUpdateAndCreate isUpdating={false} />
      </div>
    </div>
  );
}
