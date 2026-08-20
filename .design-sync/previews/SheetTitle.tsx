import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "salas-reuniao-ui";

export function PainelTituloChamado() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chamado HD-4821 - Impressora sem toner</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function PainelTituloReserva() {
  return (
    <Sheet defaultOpen>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Sala 301 - Board Room</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
