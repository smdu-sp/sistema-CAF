import { TabsNav } from "@/components/tabs-nav";
import { abasReservaSalas } from "./abas";
import Titulo from "@/components/titulo";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { filtrarAbasPorPermissao } from "./_components/filtrar-abas";

export default async function LayoutReservaSalas({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const usuario = (session as any).usuario;

  const abasPermitidas = filtrarAbasPorPermissao(usuario, abasReservaSalas);

  return (
    <div className="w-full h-full flex flex-col">
      <TabsNav abas={abasPermitidas} />
      <Titulo abas={abasPermitidas} />
      {children}
    </div>
  );
}
