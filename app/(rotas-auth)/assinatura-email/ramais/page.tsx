import DataTable from "@/components/data-table";
import { prisma } from "@/lib/prisma";
import { podeGerenciarCadastrosAssinatura } from "@/lib/assinatura-email/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { columns } from "./_components/columns";
import ModalUpdateAndCreate from "./_components/modal-update-create";
import { FiltroRamais } from "./_components/filtro-ramais";

interface PageProps {
  searchParams: Promise<{ pagina?: string; limite?: string; q?: string }>;
}

export default async function RamaisAssinaturaPage({ searchParams }: PageProps) {
  if (!(await podeGerenciarCadastrosAssinatura())) redirect("/assinatura-email");

  const params = await searchParams;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const limite = Math.max(1, Number(params.limite) || 10);
  const q = (params.q ?? "").trim();

  return (
    <Suspense fallback={null}>
      <RamaisContent pagina={pagina} limite={limite} q={q} />
    </Suspense>
  );
}

async function RamaisContent({
  pagina,
  limite,
  q,
}: {
  pagina: number;
  limite: number;
  q: string;
}) {
  const skip = (pagina - 1) * limite;
  const where = q
    ? { OR: [{ usuario: { contains: q } }, { ramalGrupo: { contains: q } }] }
    : {};

  const [lista, total] = await Promise.all([
    prisma.assinaturaGrupoRamal.findMany({
      where,
      orderBy: { usuario: "asc" },
      select: { id: true, usuario: true, ramalGrupo: true },
      skip,
      take: limite,
    }),
    prisma.assinaturaGrupoRamal.count({ where }),
  ]);

  return (
    <div className="w-full relative pb-20 md:pb-14">
      <FiltroRamais valorInicial={q} />
      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable
          columns={columns}
          data={lista}
          paginaAtual={pagina}
          limitePorPagina={limite}
          totalItens={total}
          labelItemSingular="ramal"
          labelItemPlural="ramais"
        />
      </div>
      <div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
        <ModalUpdateAndCreate isUpdating={false} />
      </div>
    </div>
  );
}
