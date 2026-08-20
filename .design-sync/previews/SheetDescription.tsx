import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "salas-reuniao-ui";

export function PainelDetalhesChamado() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chamado HD-4821</SheetTitle>
          <SheetDescription>
            Aberto em 18/08/2026 por Carlos Lima · Prioridade Alta
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm">
          Impressora do 3º andar está sem toner desde ontem e não consegue
          imprimir os relatórios do fechamento mensal.
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function PainelNovoEquipamento() {
  return (
    <Sheet defaultOpen>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Novo Equipamento</SheetTitle>
          <SheetDescription>
            Cadastre um novo item no inventário de TI vinculado a um número
            de patrimônio.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <div>
            <span className="font-medium">Tipo:</span> Notebook
          </div>
          <div>
            <span className="font-medium">Patrimônio:</span> 000482
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
