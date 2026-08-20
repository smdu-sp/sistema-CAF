import { prisma } from "@/lib/prisma";
import FilaValidacao from "./_components/fila-validacao";

export default async function ValidacaoPage() {
  const registros = await prisma.ttRegistroDiario.findMany({
    where: { estado: "ENVIADO", excluidoEm: null },
    orderBy: { data: "asc" },
    include: {
      servidor: { select: { nome: true, rf: true } },
      atividades: { select: { descricaoSnapshot: true, quantidade: true, pontuacaoUnitaria: true } },
    },
  });

  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 h-full md:container mx-auto">
      <FilaValidacao registros={registros} />
    </div>
  );
}
