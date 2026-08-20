import DataTable from "@/components/data-table";
import { prisma } from "@/lib/prisma";
import { podeGerenciarCadastrosAssinatura } from "@/lib/assinatura-email/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { columns } from "./_components/columns";
import ModalUpdateAndCreate from "./_components/modal-update-create";

interface PageProps {
  searchParams: Promise<{ pagina?: string; limite?: string }>;
}

export default async function CargosAssinaturaPage({ searchParams }: PageProps) {
  if (!(await podeGerenciarCadastrosAssinatura())) redirect("/assinatura-email");

  const params = await searchParams;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const limite = Math.max(1, Number(params.limite) || 10);

  return (
    <Suspense fallback={null}>
      <CargosContent pagina={pagina} limite={limite} />
    </Suspense>
  );
}

async function CargosContent({ pagina, limite }: { pagina: number; limite: number }) {
  const skip = (pagina - 1) * limite;
  const [lista, total] = await Promise.all([
    prisma.assinaturaCargo.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, ativo: true },
      skip,
      take: limite,
    }),
    prisma.assinaturaCargo.count(),
  ]);

  return (
    <div className="w-full relative pb-20 md:pb-14">
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable
          columns={columns}
          data={lista}
          paginaAtual={pagina}
          limitePorPagina={limite}
          totalItens={total}
          labelItemSingular="cargo"
          labelItemPlural="cargos"
        />
      </div>
      <div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
        <ModalUpdateAndCreate isUpdating={false} />
      </div>
    </div>
  );
}
