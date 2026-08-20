import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dataUtc, formatarDataBr, formatarDataIso, hojeSaoPaulo, partesData } from "@/lib/teletrabalho/datas";
import { ehFeriado, listarFeriadosDoAno } from "@/lib/teletrabalho/dias-uteis";
import { ehDiaTeletrabalho } from "@/lib/teletrabalho/escala";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TeletrabalhoHomePage() {
  const session = await auth();
  const usuarioId = (session as { usuario?: { id?: string } })?.usuario?.id;
  const servidor = usuarioId
    ? await prisma.ttServidor.findUnique({
        where: { usuarioId },
        include: { escala: true, unidade: { include: { regimeEscala: true } } },
      })
    : null;

  const hoje = hojeSaoPaulo();
  const { ano, mes } = partesData(hoje);
  const pendentes: string[] = [];

  if (servidor) {
    const feriados = await listarFeriadosDoAno(ano);
    const registros = await prisma.ttRegistroDiario.findMany({
      where: {
        servidorId: servidor.id,
        excluidoEm: null,
        data: { gte: dataUtc(ano, mes, 1), lte: hoje },
      },
      select: { data: true, estado: true },
    });
    const porData = new Map(registros.map((r) => [formatarDataIso(r.data), r.estado]));
    for (let d = 1; d <= hoje.getUTCDate(); d++) {
      const data = dataUtc(ano, mes, d);
      const iso = formatarDataIso(data);
      const tele = ehDiaTeletrabalho({
        data,
        grupo: servidor.escala?.grupo ?? 1,
        algoritmo: servidor.unidade.regimeEscala?.algoritmo ?? "atecc_grupos_2",
        ehFeriado: ehFeriado(data, feriados),
      });
      if (!tele) continue;
      const estado = porData.get(iso);
      if (!estado || estado === "RASCUNHO" || estado === "DEVOLVIDO") pendentes.push(iso);
    }
  }

  const enviados = await prisma.ttRegistroDiario.count({
    where: { estado: "ENVIADO", excluidoEm: null },
  });

  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 h-full md:container mx-auto space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Pendências do mês</p>
          <p className="text-3xl font-bold">{pendentes.length}</p>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Aguardando validação</p>
          <p className="text-3xl font-bold">{enviados}</p>
        </div>
        <div className="border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Unidade</p>
          <p className="text-lg font-medium">{servidor?.unidade.sigla ?? "—"}</p>
        </div>
      </div>
      {pendentes.length > 0 && (
        <div className="border rounded-xl p-4 space-y-2">
          <p className="font-medium">Dias sem registro enviado</p>
          <p className="text-sm text-muted-foreground">{pendentes.map((d) => formatarDataBr(d)).join(", ")}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Link href="/teletrabalho/registro"><Button>Novo registro</Button></Link>
        <Link href="/teletrabalho/calendario"><Button variant="outline">Ver escala</Button></Link>
        <Link href="/teletrabalho/validacao"><Button variant="outline">Validar equipe</Button></Link>
      </div>
    </div>
  );
}
