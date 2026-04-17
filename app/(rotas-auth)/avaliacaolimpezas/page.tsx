"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import DataTable from "@/components/data-table";
import { columns } from "./_components/columns";
import { Plus } from "lucide-react";

const mockData = [
  {
    id: 1,
    mes: 1,
    ano: 2026,
    salaId: 1,
    observacao: "Limpeza geral realizada com sucesso",
    criadoEm: new Date("2026-01-15"),
    sala: { nome: "Sala de Reuniões A" },
    avaliacaoCriterios: [
      { id: 1, criterioAvaliacaoId: 1, nota: "BOM" as const },
      { id: 2, criterioAvaliacaoId: 2, nota: "OTIMO" as const },
      { id: 3, criterioAvaliacaoId: 3, nota: "BOM" as const },
    ],
  },
  {
    id: 2,
    mes: 1,
    ano: 2026,
    salaId: 2,
    observacao: "Alguns pontos precisam de melhoria",
    criadoEm: new Date("2026-01-14"),
    sala: { nome: "Sala de Reuniões B" },
    avaliacaoCriterios: [
      { id: 4, criterioAvaliacaoId: 1, nota: "REGULAR" as const },
      { id: 5, criterioAvaliacaoId: 2, nota: "BOM" as const },
      { id: 6, criterioAvaliacaoId: 3, nota: "REGULAR" as const },
    ],
  },
  {
    id: 3,
    mes: 12,
    ano: 2025,
    salaId: 3,
    observacao: "Excelente condição",
    criadoEm: new Date("2025-12-28"),
    sala: { nome: "Auditório Principal" },
    avaliacaoCriterios: [
      { id: 7, criterioAvaliacaoId: 1, nota: "OTIMO" as const },
      { id: 8, criterioAvaliacaoId: 2, nota: "OTIMO" as const },
      { id: 9, criterioAvaliacaoId: 3, nota: "OTIMO" as const },
    ],
  },
];

type TabType = "avaliacoes" | "categorias" | "criterios" | "salas";

export default function AvaliacaoLimpezasPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("avaliacoes");

  const usuario = (session as any)?.usuario;
  const isAdmin = usuario?.permissao === "ADM"; // ← só ADM

  // Botão aparece se NÃO for ADM (DEV e USR)
  const shouldShowButton = status === "authenticated" && !isAdmin;

  const renderTabContent = () => {
    switch (activeTab) {
      case "avaliacoes":
        return <DataTable columns={columns} data={mockData} />;
      case "categorias":
        return <div>Conteúdo de Categorias</div>;
      case "criterios":
        return <div>Conteúdo de Critérios de Avaliação</div>;
      case "salas":
        return <div>Conteúdo de Salas</div>;
      default:
        return null;
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "avaliacoes", label: "Avaliações" },
    // Abas extras só para ADM
    ...(isAdmin ? [
      { id: "categorias" as const, label: "Categorias" },
      { id: "criterios" as const, label: "Critérios" },
      { id: "salas" as const, label: "Salas" },
    ] : []),
  ];

  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      {/* Botão só aparece se NÃO for admin */}
      {shouldShowButton && (
        <div className="flex justify-center">
          <div className="border border-border rounded-lg mb-4 p-6 max-w-md w-full flex items-start gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border">
                <Plus className="h-4 w-4 flex items-center" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Fazer nova avaliação</h3>
              <p className="text-sm text-muted-foreground mt-1">Realize uma nova avaliação de limpeza para as salas da instituição</p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-xl md:text-4xl font-bold">Avaliação de Limpezas</h1>
      <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie avaliações de limpeza das salas da instituição.</p>

      {/* Abas - ADM vê 4, usuário vê 1 */}
      <div className="flex gap-4 border-b my-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-blue-500 text-blue-500" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">{renderTabContent()}</div>
    </div>
  );
}
