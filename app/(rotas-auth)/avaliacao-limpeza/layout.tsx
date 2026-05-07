"use client";

import { useSession } from "next-auth/react";
import { TabsNav } from "@/components/tabs-nav";
import { abasAvaliavaoLimpeza } from "./abas";
import Titulo from "@/components/titulo";

export default function LayoutAvaliacaoLimpeza({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="w-full h-full flex flex-col">
      <TabsNav abas={abasAvaliavaoLimpeza} session={session} />
      <Titulo abas={abasAvaliavaoLimpeza} />
      {children}
    </div>
  );
}
