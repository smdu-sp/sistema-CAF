import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "salas-reuniao-ui";

export function PainelPerfilColaborador() {
  return (
    <Sheet defaultOpen>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Perfil do Colaborador</SheetTitle>
          <SheetDescription>Ana Souza · TI - Desenvolvimento</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export function PainelDetalhesPatrimonio() {
  return (
    <Sheet defaultOpen>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Patrimônio 000482</SheetTitle>
          <SheetDescription>
            Notebook Dell Latitude 5440 · Alocado a Bruno Vieira
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
