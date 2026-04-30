import { Button } from "@/components/ui/button";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
  labelItemSingular?: string;
  labelItemPlural?: string;
  onPageChange: (pagina: number) => void;
}

export function Paginacao({
  paginaAtual,
  totalPaginas,
  totalItens,
  labelItemSingular = "item",
  labelItemPlural = "itens",
  onPageChange,
}: PaginacaoProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2 border-t bg-muted/30 text-sm">
      <span className="text-muted-foreground">
        Página {paginaAtual} de {totalPaginas} ({totalItens}{" "}
        {totalItens === 1 ? labelItemSingular : labelItemPlural})
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={paginaAtual <= 1}
          onClick={() => onPageChange(Math.max(1, paginaAtual - 1))}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={paginaAtual >= totalPaginas}
          onClick={() => onPageChange(Math.min(totalPaginas, paginaAtual + 1))}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}