import DataTable from "@/components/data-table";
import { columns } from "./_components/columns";
import { ActionButton } from "@/components/action-button";
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

export default function AvaliacaoLimpezasPage() {
  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <div className="flex justify-center">
        <ActionButton
          title="Fazer nova avaliação"
          description="Realize uma nova avaliação de limpeza para as salas da instituição"
          href="#"
          icon={Plus}
        />
      </div>
      <h1 className="text-xl md:text-4xl font-bold">Avaliação de Limpezas</h1>
      <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie avaliações de limpeza das salas da instituição.</p>

      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable columns={columns} data={mockData} />
      </div>
    </div>
  );
}
