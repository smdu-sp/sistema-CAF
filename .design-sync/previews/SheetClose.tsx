import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  Button,
} from "salas-reuniao-ui";

export function PainelFiltrosComFechar() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrar Chamados</SheetTitle>
        </SheetHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Ajuste os filtros e aplique para atualizar a lista de chamados do
          Helpdesk.
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Cancelar</Button>
            </SheetClose>
            <SheetClose asChild>
              <Button>Aplicar Filtros</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function PainelConfirmarCancelamento() {
  return (
    <Sheet defaultOpen>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Cancelar Reserva</SheetTitle>
        </SheetHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Tem certeza que deseja cancelar a reserva da Sala 203 -
          Videoconferência para hoje às 16h?
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Manter Reserva</Button>
            </SheetClose>
            <Button variant="destructive">Confirmar Cancelamento</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
