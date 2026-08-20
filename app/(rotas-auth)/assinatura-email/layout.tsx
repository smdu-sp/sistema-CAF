import { TabsNav } from "@/components/tabs-nav";
import Titulo from "@/components/titulo";
import { abasAssinaturaEmail } from "./abas";

export default async function LayoutAssinaturaEmail({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex flex-col">
      <TabsNav abas={abasAssinaturaEmail} modulo="assinatura_email" />
      <Titulo abas={abasAssinaturaEmail} />
      {children}
    </div>
  );
}
