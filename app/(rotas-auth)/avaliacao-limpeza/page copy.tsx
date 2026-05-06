"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ResponsiveAvaliacaoView from "./_components/responsive-avaliacao-view";
import FormAvaliacao from "./_components/form-avaliacao";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type TabType = "avaliacoes" | "categorias" | "criterios" | "salas";

const initialMockData = [
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
  const [openDialog, setOpenDialog] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState(initialMockData);

  const usuario = (session as any)?.usuario;
  const permissao = usuario?.permissao;

  // Define o comportamento por perfil
  const isDevUser = permissao === "DEV";
  const isUserProfile = permissao === "USR";
  const isAdmin = permissao === "ADM";

  const shouldShowButton = isUserProfile; // Botão só para USR
  const shouldShowTabs = isAdmin || isUserProfile; // Abas para USR e ADM

  // Função para adicionar nova avaliação
  const handleAddAvaliacao = (novaAvaliacao: any) => {
    const salasFromMock = [
      { id: 1, nome: "Sala de Reuniões A" },
      { id: 2, nome: "Sala de Reuniões B" },
      { id: 3, nome: "Auditório Principal" },
      { id: 4, nome: "Sala de Treinamento" },
    ];
    const salaSelecionada = salasFromMock.find((s) => s.id === novaAvaliacao.salaId);

    const avaliacaoFormatada = {
      id: Math.max(...avaliacoes.map((a) => a.id), 0) + 1,
      salaId: novaAvaliacao.salaId,
      mes: novaAvaliacao.mes,
      ano: novaAvaliacao.ano,
      avaliadoPor: usuario?.login || "usuario",
      observacao: novaAvaliacao.observacao,
      criadoEm: new Date(),
      sala: { nome: salaSelecionada?.nome || "Sem sala" },
      avaliacaoCriterios: novaAvaliacao.criterios.map((c: any, idx: number) => ({
        id: idx + 1,
        criterioAvaliacaoId: c.criterioId,
        nota: c.nota,
      })),
    };

    setAvaliacoes([avaliacaoFormatada, ...avaliacoes]);
    setOpenDialog(false);
  };

  const loading = false;

  // Função que renderiza o conteúdo baseado na aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "avaliacoes":
        return <ResponsiveAvaliacaoView data={avaliacoes} loading={loading} />;
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

  // Se for DEV, retorna apenas a tabela
  if (isDevUser) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 relative">
          <ResponsiveAvaliacaoView data={data} loading={loading} />
        </div>
      </div>
    );
  }

  // Para USR e ADM
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 relative pb-20 md:pb-14">
        {/* Botão Nova Avaliação - Responsivo */}
        {shouldShowButton && (
          <div className="flex justify-center mb-6">
            <div
              onClick={() => setOpenDialog(true)}
              className="border border-border rounded-lg p-4 sm:p-6 w-full sm:max-w-md flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-border">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold leading-tight">Fazer nova avaliação</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Realize uma nova avaliação de limpeza para as salas da instituição</p>
              </div>
            </div>
          </div>
        )}
        {/* Conteúdo da Aba Ativa */}
        <div className="w-full">{renderTabContent()}</div>
      </div>

      {/* Dialog do Formulário */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl duration-300">
          <DialogHeader>
            <DialogTitle>Nova Avaliação</DialogTitle>
          </DialogHeader>
          <FormAvaliacao isUpdating={false} onSubmit={handleAddAvaliacao} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
