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

export function PainelAcoesChamado() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chamado HD-4821</SheetTitle>
        </SheetHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Impressora do 3º andar sem toner. Atribuído a: Equipe de Suporte.
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
            <Button>Marcar como Resolvido</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function PainelAcoesReserva() {
  return (
    <Sheet defaultOpen>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Sala 301 - Board Room</SheetTitle>
        </SheetHeader>
        <div className="px-4 text-sm text-muted-foreground">
          Reunião de Diretoria · 19/08/2026, 14h às 15h
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <Button variant="outline">Editar Reserva</Button>
            <Button variant="destructive">Cancelar</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
