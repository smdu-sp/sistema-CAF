"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ResponsiveAvaliacaoView from "./_components/responsive-avaliacao-view";
import { Plus } from "lucide-react";

type TabType = "avaliacoes" | "categorias" | "criterios" | "salas";

const mockDataAvaliacoes = [
  {
    id: 1,
    mes: 4,
    ano: 2026,
    salaId: 1,
    avaliadoPor: "usuario-x395801",
    observacao: "Limpeza geral realizada com sucesso. Sala impecável.",
    criadoEm: new Date("2026-04-23"),
    sala: { nome: "Sala de Reuniões A" },
    avaliacaoCriterios: [
      { id: 1, criterioAvaliacaoId: 1, nota: "OTIMO" as const },
      { id: 2, criterioAvaliacaoId: 2, nota: "BOM" as const },
      { id: 3, criterioAvaliacaoId: 3, nota: "OTIMO" as const },
    ],
  },
  {
    id: 2,
    mes: 4,
    ano: 2026,
    salaId: 2,
    avaliadoPor: "usuario-x395801",
    observacao: "Alguns pontos precisam de melhoria na limpeza.",
    criadoEm: new Date("2026-04-22"),
    sala: { nome: "Auditório Principal" },
    avaliacaoCriterios: [
      { id: 4, criterioAvaliacaoId: 1, nota: "REGULAR" as const },
      { id: 5, criterioAvaliacaoId: 2, nota: "BOM" as const },
      { id: 6, criterioAvaliacaoId: 3, nota: "REGULAR" as const },
    ],
  },
  {
    id: 3,
    mes: 4,
    ano: 2026,
    salaId: 3,
    avaliadoPor: "usuario-x395801",
    observacao: "Excelente estado de limpeza. Parabéns à equipe.",
    criadoEm: new Date("2026-04-21"),
    sala: { nome: "Sala de Treinamento" },
    avaliacaoCriterios: [
      { id: 7, criterioAvaliacaoId: 1, nota: "OTIMO" as const },
      { id: 8, criterioAvaliacaoId: 2, nota: "OTIMO" as const },
      { id: 9, criterioAvaliacaoId: 3, nota: "OTIMO" as const },
    ],
  },
];

export default function AvaliacaoLimpezasPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("avaliacoes");
const data = mockDataAvaliacoes;
const loading = false;

  const usuario = (session as any)?.usuario;
  const isAdmin = usuario?.permissao === "ADM";

  // Botão aparece se NÃO for ADM (DEV e USR)
  const shouldShowButton = status === "authenticated" && !isAdmin;

  const renderTabContent = () => {
    switch (activeTab) {
      case "avaliacoes":
        return (
          <ResponsiveAvaliacaoView data={data} loading={loading} />
        );
      case "categorias":
        return (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Conteúdo de Categorias</p>
          </div>
        );
      case "criterios":
        return (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Conteúdo de Critérios de Avaliação</p>
          </div>
        );
      case "salas":
        return (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Conteúdo de Salas</p>
          </div>
        );
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
    <div className="w-full h-full flex flex-col">
      {/* Container com padding responsivo */}
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 relative pb-20 md:pb-14">
        {/* Botão Nova Avaliação - Responsivo */}
        {shouldShowButton && (
          <div className="flex justify-center mb-6">
            <div className="border border-border rounded-lg p-4 sm:p-6 w-full sm:max-w-md flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold leading-tight">
                  Fazer nova avaliação
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Realize uma nova avaliação de limpeza para as salas da instituição
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Título e Descrição - Responsivos */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Avaliação de Limpezas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Cadastre e gerencie avaliações de limpeza das salas da instituição.
          </p>
        </div>

        {/* Abas - Scroll horizontal em mobile */}
        <div className="w-full overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8 mb-6">
          <div className="flex gap-2 sm:gap-4 border-b px-4 sm:px-6 md:px-8 min-w-min md:min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo - Responsivo */}
        <div className="w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}