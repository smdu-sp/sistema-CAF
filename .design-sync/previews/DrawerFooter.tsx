import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Button,
} from "salas-reuniao-ui";

export function AcoesDeDetalheDaReserva() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Reserva de 25/08/2026</DrawerTitle>
        </DrawerHeader>
        <p style={{ padding: "0 16px", fontSize: 14, color: "var(--muted-foreground)" }}>
          Sala Diretoria, 14:00 às 15:00.
        </p>
        <DrawerFooter>
          <Button variant="destructive">Cancelar reserva</Button>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
