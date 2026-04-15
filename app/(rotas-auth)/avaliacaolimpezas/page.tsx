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
      { id: 1, criterioAvaliacaoId: 1, nota: "BOM" },
      { id: 2, criterioAvaliacaoId: 2, nota: "OTIMO" },
      { id: 3, criterioAvaliacaoId: 3, nota: "BOM" },
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
      { id: 4, criterioAvaliacaoId: 1, nota: "REGULAR" },
      { id: 5, criterioAvaliacaoId: 2, nota: "BOM" },
      { id: 6, criterioAvaliacaoId: 3, nota: "REGULAR" },
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
      { id: 7, criterioAvaliacaoId: 1, nota: "OTIMO" },
      { id: 8, criterioAvaliacaoId: 2, nota: "OTIMO" },
      { id: 9, criterioAvaliacaoId: 3, nota: "OTIMO" },
    ],
  },
];

export default function AvaliacaoLimpezasPage() {
  return (
    <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
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
      <h1 className="text-xl md:text-4xl font-bold">Avaliação de Limpezas</h1>
      <p className="text-sm text-muted-foreground mt-1">Cadastre e gerencie avaliações de limpeza das salas da instituição.</p>

      <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
        <DataTable columns={columns} data={mockData} />
      </div>
    </div>
  );
}
