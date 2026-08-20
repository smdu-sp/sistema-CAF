import DataTable from "@/components/data-table";
import { prisma } from "@/lib/prisma";
import { colunasServidores } from "./_components/columns";
import ModalUpdateAndCreate from "./_components/modal-update-create";

interface PageProps {
  searchParams: Promise<{ pagina?: string; limite?: string }>;
}

export default async function ServidoresTeletrabalhoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const limite = Math.max(1, Number(params.limite) || 10);
  const skip = (pagina - 1) * limite;

  const [lista, total, unidades, cargos] = await Promise.all([
    prisma.ttServidor.findMany({
      orderBy: { nome: "asc" },
      skip,
      take: limite,
      include: {
        unidade: { select: { id: true, nome: true, sigla: true } },
        cargo: { select: { id: true, nome: true } },
        escala: { select: { grupo: true } },
      },
    }),
    prisma.ttServidor.count(),
    prisma.ttUnidade.findMany({ where: { ativo: true }, select: { id: true, sigla: true, nome: true }, orderBy: { nome: "asc" } }),
    prisma.ttCargo.findMany({ where: { ativo: true }, select: { id: true, nome: true, unidadeId: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable
          columns={colunasServidores(unidades, cargos)}
          data={lista}
          paginaAtual={pagina}
          limitePorPagina={limite}
          totalItens={total}
          labelItemSingular="servidor"
          labelItemPlural="servidores"
        />
      </div>
      <div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
        <ModalUpdateAndCreate isUpdating={false} unidades={unidades} cargos={cargos} />
      </div>
    </div>
  );
}
