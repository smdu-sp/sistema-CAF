import { TabsNav } from "@/components/tabs-nav";
import Titulo from "@/components/titulo";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { obterAcessoTeletrabalho } from "@/lib/teletrabalho/permissoes";
import { redirect } from "next/navigation";
import { abasTeletrabalho } from "./abas";

export default async function LayoutTeletrabalho({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const usuarioId = (session as { usuario?: { id?: string } })?.usuario?.id;
  if (!usuarioId) redirect("/login");

  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { id: true, desenvolvedor: true, permissao: true },
  });
  if (!usuario) redirect("/");

  const acesso = await obterAcessoTeletrabalho(
    usuario.id,
    usuario.desenvolvedor,
    String(usuario.permissao),
  );
  if (!acesso.podeVisualizar) redirect("/");

  return (
    <div className="w-full h-full flex flex-col">
      <TabsNav abas={abasTeletrabalho} modulo="teletrabalho" />
      <Titulo abas={abasTeletrabalho} />
      {children}
    </div>
  );
}
