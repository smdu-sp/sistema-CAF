import * as React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Button,
} from "salas-reuniao-ui";

export function AbrirPainelFiltros() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Filtrar Chamados</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrar Chamados</SheetTitle>
          <SheetDescription>
            Selecione o status e a prioridade para refinar a lista.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function AbrirDetalhesReserva() {
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button>Ver Detalhes da Reserva</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Sala 203 - Videoconferência</SheetTitle>
          <SheetDescription>
            Hoje, 16h às 17h · Reunião com Cliente Externo
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
