import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
  Button,
} from "salas-reuniao-ui";

export function PainelSolicitacaoTeletrabalho() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Solicitação de Teletrabalho</SheetTitle>
          <SheetDescription>
            Período: 24/08/2026 a 28/08/2026 · Colaborador: Ana Souza
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <div>
            <span className="font-medium">Setor:</span> TI - Desenvolvimento
          </div>
          <div>
            <span className="font-medium">Justificativa:</span> Atividade
            focada em desenvolvimento sem necessidade de presença física.
          </div>
          <div>
            <span className="font-medium">Status:</span> Aguardando aprovação
          </div>
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Rejeitar</Button>
            </SheetClose>
            <Button>Aprovar Solicitação</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
