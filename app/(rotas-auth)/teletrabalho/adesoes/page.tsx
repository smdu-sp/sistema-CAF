import DataTable from "@/components/data-table";
import { prisma } from "@/lib/prisma";
import { colunasAdesoes } from "./_components/columns";
import ModalUpdateAndCreate from "./_components/modal-update-create";

interface PageProps {
  searchParams: Promise<{ pagina?: string; limite?: string }>;
}

export default async function AdesoesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const limite = Math.max(1, Number(params.limite) || 10);

  const [lista, total, servidores] = await Promise.all([
    prisma.ttTermoAdesao.findMany({
      orderBy: { dataAssinatura: "desc" },
      skip: (pagina - 1) * limite,
      take: limite,
      include: { servidor: { select: { id: true, nome: true, rf: true, unidade: { select: { sigla: true } } } } },
    }),
    prisma.ttTermoAdesao.count(),
    prisma.ttServidor.findMany({ where: { ativo: true }, select: { id: true, nome: true, rf: true }, orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable columns={colunasAdesoes(servidores)} data={lista} paginaAtual={pagina} limitePorPagina={limite} totalItens={total} labelItemSingular="termo" labelItemPlural="termos" />
      </div>
      <div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
        <ModalUpdateAndCreate isUpdating={false} servidores={servidores} />
      </div>
    </div>
  );
}
