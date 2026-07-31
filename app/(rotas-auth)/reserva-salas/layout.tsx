import { TabsNav } from "@/components/tabs-nav";
import { abasReservaSalas } from "./abas";
import Titulo from "@/components/titulo";
import { validarPermissao } from "@/services/permissoes";
import { redirect } from "next/navigation";

export default async function LayoutReservaSalas({
  children,
}: {
  children: React.ReactNode;
}) {
  const permissao = "reserva_salas.reservas.visualizar";
  const temPermissao = await validarPermissao(permissao);
  if (!temPermissao) redirect("/");

  return (
    <div className="w-full h-full flex flex-col">
      <TabsNav abas={abasReservaSalas} modulo="reserva_salas" />
      <Titulo abas={abasReservaSalas} />
      {children}
    </div>
  );
}