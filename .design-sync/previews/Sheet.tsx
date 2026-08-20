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

export function PainelDetalhesReserva() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes da Reserva</SheetTitle>
          <SheetDescription>
            Sala 301 - Board Room · 19/08/2026, 14h às 15h
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <div>
            <span className="font-medium">Responsável:</span> Bruno Vieira
          </div>
          <div>
            <span className="font-medium">Participantes:</span> 6 pessoas
          </div>
          <div>
            <span className="font-medium">Assunto:</span> Alinhamento de Sprint
          </div>
        </div>
        <SheetFooter>
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline">Fechar</Button>
            </SheetClose>
            <Button variant="destructive">Cancelar Reserva</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
